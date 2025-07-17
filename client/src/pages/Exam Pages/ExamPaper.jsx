import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ListeningTest from "./ListeningTest";
import SpeakingTest from "./SpeakingTest";
import { createSubmissionAPI, updateSubmissionAPI } from "../../redux/features/examIeltsSubmissionSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store-config/store";

const ExamPaper = ({ exam, onBack }) => {
  const dispatch = useAppDispatch();
  const {loading,error, success} = useAppSelector((state) => state.examIeltsSubmission);

  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionId, setSubmissionId] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  useEffect(() => {
    if (error) showToast("Error", error, "destructive");
    if (success) showToast("Success", "Operation completed.", "success");
  }, [error, success]);

  const sections = exam.sections || [];
  const currentSection = sections[currentSectionIndex];
  const questions = currentSection
    ? currentSection.questions.map((q) => ({
        id: q._id,
        type: q.type,
        question: q.question,
        options: q.options || [],
        passage: q.passage || "",
      }))
    : [];

  const totalQuestions = sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
  const answeredQuestions = Object.keys(answers).length;
  const allSectionsCompleted = sections.every((section) =>
    section.questions.every((q) => answers[q._id])
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.ctrlKey &&
        (e.key === "c" || e.key === "v" || e.key === "a" || e.key === "s" || e.key === "p")
      ) {
        e.preventDefault();
        showToast(
          "Action Blocked",
          "Copy, paste, and print functions are disabled during the exam.",
          "destructive"
        );
      }
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "u")) {
        e.preventDefault();
        showToast(
          "Access Denied",
          "Developer tools are not allowed during the exam.",
          "destructive"
        );
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      showToast(
        "Action Blocked",
        "Right-click is disabled during the exam.",
        "destructive"
      );
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [showToast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1; 
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!submissionId && !loading) {
      const initialSubmission = {
        studentId: localStorage.getItem("user"),
        examId: exam._id,
        sectionIds: sections[0]?._id || "defaultSectionId",
        answers: answers,
        status: "in-progress",
      };
      dispatch(createSubmissionAPI(initialSubmission)).then((action) => {
        if (createSubmissionAPI.fulfilled.match(action)) {
          setSubmissionId(action.payload._id);
        }
      });
    } else if (submissionId && !loading) {
      saveProgress();
    }
  }, []);

  if (exam.type === "Listening") {
    return (
      <ListeningTest
        exam={exam}
        onComplete={(answers) => {
          console.log("Listening test completed:", answers);
          onBack();
        }}
        onBack={onBack}
      />
    );
  }

  if (exam.type === "Speaking") {
    return (
      <SpeakingTest
        exam={exam}
        onComplete={(recordings) => {
          console.log("Speaking test completed:", recordings);
          onBack();
        }}
        onBack={onBack}
      />
    );
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const saveProgress = async () => {
    if (submissionId && !loading) {
      console.log("save progress",submissionId, answers);
      
      dispatch(updateSubmissionAPI({ id: submissionId, updates: { answers, status: "in-progress" } }));
    }
  };

  const handleSubmit = async () => {
    console.log("handle submit", submissionId, answers);
    
    if (submissionId && allSectionsCompleted && !loading) {
      console.log("Handle Submit", submissionId, answers);
      
      dispatch(updateSubmissionAPI({ id: submissionId, updates: {answers, status: "submitted" } }));
      showToast(
        "Exam Submitted Successfully",
        "Your answers have been recorded. You will receive your results soon."
      );
      onBack();
    } else if (!allSectionsCompleted) {
      showToast(
        "Incomplete Submission",
        "Please answer all questions in every section before submitting.",
        "destructive"
      );
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600">
                Section {currentSectionIndex + 1} of {sections.length} - Question{" "}
                {currentQuestionIndex + 1} of {questions.length} (Progress: {answeredQuestions}/{totalQuestions})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={() => setShowSubmitDialog(true)}
                disabled={!allSectionsCompleted || loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  !allSectionsCompleted || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send className="h-4 w-4" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 sticky top-6 rounded-lg shadow">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Section Navigation</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    {sections.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          saveProgress();
                          setCurrentSectionIndex(index);
                          setCurrentQuestionIndex(0);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentSectionIndex === index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        Section {index + 1} ({sections[index].questions.length} questions)
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Question Navigation</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentQuestionIndex === index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        } ${
                          answers[questions[index].id] ? "border-green-300" : ""
                        } relative`}
                      >
                        {index + 1}
                        {answers[questions[index].id] && (
                          <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow">
                <div className="p-6">
                  {currentQ.type === "reading" && currentQ.passage && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Reading Passage
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-800 leading-relaxed">
                        {currentQ.passage}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Question {currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-800 mb-4">{currentQ.question}</p>

                    {currentQ.type === "mcq" && currentQ.options && (
                      <div className="space-y-2">
                        {currentQ.options.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <input
                              type="radio"
                              name={`question-${currentQ.id}`}
                              value={option}
                              checked={answers[currentQ.id] === option}
                              onChange={(e) =>
                                handleAnswerChange(currentQ.id, e.target.value)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {currentQ.type === "typing" && (
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={answers[currentQ.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQ.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {currentQ.type === "essay" && (
                      <textarea
                        placeholder="Write your essay here..."
                        value={answers[currentQ.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQ.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none"
                      />
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                      }
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentQuestionIndex(
                          Math.min(questions.length - 1, currentQuestionIndex + 1)
                        )
                      }
                      disabled={currentQuestionIndex === questions.length - 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showSubmitDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white max-w-md w-full mx-4 rounded-lg shadow">
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Confirm Submission
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to submit your exam? You cannot make
                    changes after submission.
                  </p>
                  <div className="text-sm text-gray-600 mb-4">
                    Answered: {answeredQuestions} of {totalQuestions} questions
                  </div>
                  <div className="flex space-x-3 p-6">
                    <button
                      onClick={() => setShowSubmitDialog(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Continue Exam
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Submit Exam
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamPaper;