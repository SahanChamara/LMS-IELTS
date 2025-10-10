// components/InstructorDiscussionsTab.js
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../redux/store-config/store";
import { getMessageAPI, replyMessageAPI } from "../../../redux/features/discussionSlice";

/**
 * InstructorDiscussionsTab
 * - left: thread list (students)
 * - right: messages for selected thread
 * - composer sends { discussionId, reply } via replyMessageAPI
 *
 * Important:
 * - Backend getMessageAPI(unitId) must return an array of discussions like:
 *   [{ discussionId, student: { _id, name }, content: [{ user, msg, timestamp }, ...], updatedAt }]
 * - This component will enrich each content item with senderId/senderName for ownership detection.
 */

const InstructorDiscussionsTab = ({ unitId }) => {
  const dispatch = useAppDispatch();
  const { loading: reduxLoading } = useAppSelector((s) => s.discussions);

  const [discussions, setDiscussions] = useState([]); // enriched discussions
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
  const [messages, setMessages] = useState([]); // messages of selected discussion (enriched)
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  // current user from localStorage (adjust to your app)
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const currentUserId = stored?._id || stored?.id || null;
  const currentUserName = stored?.name || localStorage.getItem("userName") || "Instructor";
  const currentUserRole = stored?.role || localStorage.getItem("userRole") || "instructor";

  // scroll helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // fetch discussions for the unit and enrich each message with senderId/senderName
  useEffect(() => {
    if (!unitId) {
      setDiscussions([]);
      setSelectedDiscussionId(null);
      setMessages([]);
      return;
    }

    const fetch = async () => {
      try {
        setError(null);
        const response = await dispatch(getMessageAPI(unitId)).unwrap();
        // response expected: { success:true, data: [ { discussionId, student, content, updatedAt } ] }
        const raw = response?.data || response || [];
        if (!Array.isArray(raw)) {
          setError("Unexpected response format from server.");
          setDiscussions([]);
          setMessages([]);
          setSelectedDiscussionId(null);
          return;
        }

        // Enrich content items: attach senderId and senderName for each content item.
        // For 'Student' messages -> senderId = student._id
        // For 'Instructor' messages -> senderId = instructor id (currentUserId)
        // (backend does not necessarily include instructor object here, but instructor is current user)
        const enriched = raw.map((d) => {
          const student = d.student || null;
          const instructor = d.instructor || null; // if backend includes instructor, good; otherwise use currentUser
          const content = Array.isArray(d.content)
            ? d.content.map((c, idx) => {
                const role = c.user || (c.user === "Student" ? "Student" : "Instructor");
                const senderId =
                  role === "Student"
                    ? (student?._id || student?._id || null)
                    : (instructor?._id || currentUserId); // instructor messages -> currentUser
                const senderName =
                  role === "Student"
                    ? (student?.name || "Student")
                    : (instructor?.name || currentUserName);
                return {
                  id: c._id || `${d.discussionId || "disc"}-${idx}-${(c.timestamp || Date.now())}`,
                  discussionId: d.discussionId,
                  user: role,
                  msg: c.msg || c.message || c.content || "",
                  timestamp: c.timestamp || c.date || c.createdAt || new Date().toISOString(),
                  senderId,
                  senderName,
                };
              })
            : [];

          return {
            discussionId: d.discussionId,
            student,
            instructor: instructor || { _id: currentUserId, name: currentUserName },
            content,
            updatedAt: d.updatedAt || null,
          };
        });

        setDiscussions(enriched);

        // pick default selected discussion (first) if none selected
        const first = enriched[0];
        const defaultId = first ? first.discussionId : null;
        setSelectedDiscussionId((prev) => (prev ? prev : defaultId));
        setMessages(first ? first.content || [] : []);
      } catch (err) {
        console.error("Failed to load discussions:", err);
        setError("Failed to load discussions.");
      }
    };

    fetch();
  }, [unitId, dispatch, currentUserId, currentUserName]);

  // update messages for currently selected discussion
  useEffect(() => {
    if (!selectedDiscussionId) {
      setMessages([]);
      return;
    }
    const discussion = discussions.find((d) => String(d.discussionId) === String(selectedDiscussionId));
    setMessages(discussion ? discussion.content || [] : []);
  }, [selectedDiscussionId, discussions]);

  const formatTime = (ts) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  // send a reply: must include discussionId (backend requires it)
  const handleReply = async () => {
    if (!newReply || !newReply.trim()) return;
    if (!selectedDiscussionId) {
      setError("No discussion selected to reply to.");
      return;
    }

    setIsSending(true);
    setError(null);

    // optimistic message (enriched)
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMsg = {
      id: tempId,
      discussionId: selectedDiscussionId,
      user: "Instructor",
      msg: newReply,
      timestamp: new Date().toISOString(),
      senderId: currentUserId,
      senderName: currentUserName,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewReply("");

    const payload = { discussionId: selectedDiscussionId, reply: newReply };

    try {
      await dispatch(replyMessageAPI(payload)).unwrap();

      // refresh discussions to get canonical messages for selected thread
      const refresh = await dispatch(getMessageAPI(unitId)).unwrap();
      const raw = refresh?.data || refresh || [];
      const enriched = raw.map((d) => {
        const student = d.student || null;
        const instructor = d.instructor || null;
        const content = Array.isArray(d.content)
          ? d.content.map((c, idx) => {
              const role = c.user || (c.user === "Student" ? "Student" : "Instructor");
              const senderId =
                role === "Student"
                  ? (student?._id || null)
                  : (instructor?._id || currentUserId);
              const senderName =
                role === "Student"
                  ? (student?.name || "Student")
                  : (instructor?.name || currentUserName);
              return {
                id: c._id || `${d.discussionId}-${idx}-${(c.timestamp || Date.now())}`,
                discussionId: d.discussionId,
                user: role,
                msg: c.msg || c.message || c.content || "",
                timestamp: c.timestamp || c.date || c.createdAt || new Date().toISOString(),
                senderId,
                senderName,
              };
            })
          : [];
        return {
          discussionId: d.discussionId,
          student,
          instructor: instructor || { _id: currentUserId, name: currentUserName },
          content,
          updatedAt: d.updatedAt || null,
        };
      });

      setDiscussions(enriched);
      const refreshed = enriched.find((x) => String(x.discussionId) === String(selectedDiscussionId));
      setMessages(refreshed ? refreshed.content || [] : []);
      setError(null);
    } catch (err) {
      console.error("Failed to send reply:", err);
      // rollback optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError("Failed to send reply. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  return (
    <div className="flex gap-4 h-[600px] bg-white rounded-lg overflow-hidden">
      {/* Threads list */}
      <aside className="w-64 border-r border-gray-200 p-3 bg-gray-50 overflow-auto">
        <h4 className="text-sm font-semibold mb-3">Threads</h4>

        {discussions.length === 0 ? (
          <p className="text-xs text-gray-500">No threads found for this unit.</p>
        ) : (
          <ul className="space-y-2">
            {discussions.map((d) => {
              const last = d.content && d.content.length ? d.content[d.content.length - 1] : null;
              const studentName = d.student?.name || "Student";
              return (
                <li key={d.discussionId}>
                  <button
                    onClick={() => setSelectedDiscussionId(d.discussionId)}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      String(selectedDiscussionId) === String(d.discussionId)
                        ? "bg-purple-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{studentName}</div>
                        <div className="text-xs text-gray-500 truncate" title={last?.msg || ""}>
                          {last ? (last.msg.length > 50 ? `${last.msg.slice(0, 50)}...` : last.msg) : "No messages yet"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{last ? formatTime(last.timestamp) : ""}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Messages + composer */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold">
                {(() => {
                  const sel = discussions.find((d) => String(d.discussionId) === String(selectedDiscussionId));
                  return sel ? sel.student?.name || "Student" : "Select a thread";
                })()}
              </h3>
              <div className="text-xs text-gray-500">
                {selectedDiscussionId ? `Thread ID: ${selectedDiscussionId}` : ""}
              </div>
            </div>
          </div>

          {/* messages */}
          {messages.length === 0 ? (
            <div className="text-sm text-gray-500">No messages in this thread.</div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const isMine = String(m.senderId) === String(currentUserId);
                return (
                  <div key={m.id || m.timestamp} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl ${isMine ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                      {!isMine && <div className="text-xs font-medium mb-1">{m.senderName}</div>}
                      <div className="text-sm whitespace-pre-wrap">{m.msg}</div>
                      <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(m.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* composer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-end gap-2">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedDiscussionId ? "Write a reply..." : "Select a thread to reply"}
              className="flex-1 resize-none p-3 rounded-xl border border-gray-300"
              rows={2}
              disabled={isSending || !selectedDiscussionId}
            />
            <button
              onClick={handleReply}
              disabled={!newReply.trim() || isSending || !selectedDiscussionId}
              className={`p-3 rounded-full ${newReply.trim() && !isSending && selectedDiscussionId ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default InstructorDiscussionsTab;
