import React, { useState, useEffect, useMemo } from "react";
import { Clock, Volume2, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

const ListeningTest = React.memo(({ exam, onComplete, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sectionCompleted, setSectionCompleted] = useState({});
  const [transferTimeRemaining, setTransferTimeRemaining] = useState(600); // 10 minutes
  const [testPhase, setTestPhase] = useState("listening");
  const [isAudioPlaying, setIsAudioPlaying] = useState(true); // Track audio playback status

  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  // Use useMemo with stable dependency on exam.sections to prevent re-computation
  const listeningSections = useMemo(() => {
    return exam.sections.map((section) => ({
      id: section._id,
      title: section.title,
      audioUrl: section.audioUrl,
      context: section.context,
      questions: section.questions.map((q) => ({
        id: q._id,
        type: q.type,
        question: q.question,
        options: q.options || [],
        passage: q.passage || "",
      })),
    }));
  }, [exam.sections]);

  // Derive questions from listeningSections to ensure stability
  const questions = useMemo(() => {
    return listeningSections.flatMap((section) => section.questions);
  }, [listeningSections]);

  // Debug render cycle
  useEffect(() => {
    console.log("Listening page render", { currentSection, testPhase, exam, isAudioPlaying });
    return () => console.log("Listening page cleanup");
  }, [currentSection, testPhase, exam, isAudioPlaying]);

  // Manage transfer timer
  useEffect(() => {
    let timer;
    if (testPhase === "transfer" && transferTimeRemaining > 0) {
      timer = setInterval(() => {
        setTransferTimeRemaining((prev) => {
          if (prev <= 1) {
            setTestPhase("completed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testPhase, transferTimeRemaining]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSectionComplete = () => {
    setSectionCompleted((prev) => ({
      ...prev,
      [currentSection]: true,
    }));

    if (currentSection < listeningSections.length - 1) {
      showToast(
        "Section Complete",
        `Section ${currentSection + 1} completed. Moving to next section.`
      );
      setCurrentSection((prev) => prev + 1);
      setIsAudioPlaying(true); // Reset for next section
    } else {
      setTestPhase("transfer");
      showToast(
        "Listening Complete",
        "You now have 10 minutes to transfer your answers."
      );
    }
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const goToNextSection = () => {
    if (currentSection < listeningSections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (testPhase === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Completed</h2>
            <p className="text-gray-600 mb-6">
              Your listening test has been completed and submitted automatically.
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentListeningSection = listeningSections[currentSection];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IELTS Listening Test</h1>
              <p className="text-gray-600">
                {testPhase === "listening"
                  ? `${currentListeningSection.title} - Questions ${
                      currentSection * 4 + 1
                    }-${Math.min((currentSection + 1) * 4, questions.length)}`
                  : "Transfer Time - Review and finalize your answers"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {testPhase === "transfer" && (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-100 text-orange-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">
                    {formatTime(transferTimeRemaining)}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Section {currentSection + 1} of {listeningSections.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 sticky top-6 rounded-lg shadow">
              <div className="p-4">
                <h3 className="text-lg font-semibold">Test Progress</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {listeningSections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`p-3 rounded-lg border ${
                        index === currentSection
                          ? "bg-blue-100 border-blue-300"
                          : sectionCompleted[index]
                          ? "bg-green-100 border-green-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Section {index + 1}</span>
                        {sectionCompleted[index] && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {index === currentSection && testPhase === "listening" && (
                          <Volume2 className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Questions {index * 4 + 1}-{Math.min((index + 1) * 4, questions.length)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {testPhase === "listening" && (
              <>
                <div className="mb-6">
                  <AudioPlayer
                    key={currentSection}
                    audioUrl={currentListeningSection.audioUrl}
                    onSectionComplete={handleSectionComplete}
                    sectionTitle={currentListeningSection.title}
                    canReplay={false}
                    onPlayingStatusChange={setIsAudioPlaying} // Pass playing status
                  />
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-blue-200 mb-6 rounded-lg shadow p-4">
                  <p className="text-gray-700 italic">{currentListeningSection.context}</p>
                </div>
              </>
            )}

            {testPhase === "transfer" && (
              <>
                <div className="mb-6">
                  <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow p-4">
                    <p className="text-gray-700 italic">{currentListeningSection.context}</p>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow">
              <div className="p-6">
                <h3>Questions {currentSection * 4 + 1} - {Math.min((currentSection + 1) * 4, questions.length)}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {currentListeningSection.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h4 className="font-medium text-gray-900 mb-3">
                        {currentSection * 4 + index + 1}. {question.question}
                      </h4>

                      {question.type === "mcq" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) =>
                                  handleAnswerChange(question.id, e.target.value)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                disabled={testPhase === "transfer" ? false : false} // Always enabled during listening
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {(question.type === "form-completion" || question.type === "typing") && (
                        <input
                          type="text"
                          placeholder="Type your answer here..."
                          value={answers[question.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          className="max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={testPhase === "transfer" ? false : false} // Always enabled during listening
                        />
                      )}

                      {question.type === "matching" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-gray-700 min-w-[120px]">
                                {option}:
                              </span>
                              <input
                                type="text"
                                placeholder="Match..."
                                value={answers[`${question.id}-${optionIndex}`] || ""}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    `${question.id}-${optionIndex}`,
                                    e.target.value
                                  )
                                }
                                className="max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={testPhase === "transfer" ? false : false} // Always enabled during listening
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {testPhase === "transfer" && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={goToPreviousSection}
                  disabled={currentSection === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </button>
                <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow p-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
                    >
                      Submit Test
                    </button>
                    <button
                      onClick={onBack}
                      className="px-8 py-3 border border-gray-300 text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
                <button
                  onClick={goToNextSection}
                  disabled={currentSection === listeningSections.length - 1}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ListeningTest;