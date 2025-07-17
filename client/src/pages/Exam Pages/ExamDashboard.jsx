import React, { useEffect, useState } from "react";
import { Clock, BookOpen, Users, AlertCircle } from "lucide-react";
import ExamIntro from "../Exam Pages/ExamIntro";
import Sidebar from "../../components/Sidebar";
import { useAppDispatch, useAppSelector } from "../../redux/store-config/store";
import { getAllPublishedExamsAPI } from "../../redux/features/examIeltsSlice";

/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} title
 * @property {number} duration
 * @property {number} questions
 * @property {"Beginner" | "Intermediate" | "Advanced"} difficulty
 * @property {"Reading" | "Writing" | "Listening" | "Speaking"} type
 * @property {string} description
 * @property {boolean} available
 */

const ExamDashboard = () => {
  const dispatch = useAppDispatch();
  const {exams, loading, error} = useAppSelector((state) => state.examIelts);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [loadings, setLoadings] = useState(false);

  useEffect(() => {
    dispatch(getAllPublishedExamsAPI());    
  }, [dispatch])

  /* const exams = [
    {
      id: "1",
      title: "IELTS Academic Reading Test 1",
      duration: 60,
      questions: 40,
      difficulty: "Intermediate",
      type: "Reading",
      description:
        "Complete academic reading test with 3 passages and 40 questions",
      available: true,
    },
    {
      id: "2",
      title: "IELTS Academic Writing Test 1",
      duration: 60,
      questions: 2,
      difficulty: "Advanced",
      type: "Writing",
      description: "Task 1: Academic graph description, Task 2: Essay writing",
      available: true,
    },
    {
      id: "3",
      title: "IELTS Listening Test 1",
      duration: 40,
      questions: 40,
      difficulty: "Intermediate",
      type: "Listening",
      description:
        "4 sections with various listening scenarios and question types",
      available: true,
    },
    {
      id: "4",
      title: "IELTS Speaking Mock Test",
      duration: 15,
      questions: 3,
      difficulty: "Advanced",
      type: "Speaking",
      description:
        "Complete speaking test with 3 parts: Introduction, Individual task, Discussion",
      available: true,
    },
    {
      id: "5",
      title: "IELTS Academic Reading Test 2",
      duration: 60,
      questions: 40,
      difficulty: "Advanced",
      type: "Reading",
      description: "Advanced academic reading test with complex passages",
      available: true,
    },
    {
      id: "6",
      title: "IELTS Listening Test 2",
      duration: 40,
      questions: 40,
      difficulty: "Advanced",
      type: "Listening",
      description: "Advanced listening test with academic and social contexts",
      available: true,
    },
  ]; */

  const handleAttemptNow = (exam) => {
    setLoadings(true);
    setSelectedExam(exam);
    setShowIntro(true);
    setLoadings(false);
  };

  //const availableExams = exams.filter((exam) => exam.available);

  if (showIntro && selectedExam) {
    return <ExamIntro exam={selectedExam} onBack={() => setShowIntro(false)} />;
  }

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"> */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              IELTS Exam Center
            </h1>
            <p className="text-lg text-gray-600">
              Practice with authentic IELTS exam papers
            </p>
          </div>         

          {/* Exams Grid */}
          {loadings ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading exams...</p>
            </div>
          ) : Object.values(exams).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(exams).map((exam) => (
                <div
                  key={exam._id}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exam.type === "Reading"
                            ? "bg-blue-100 text-blue-800"
                            : exam.type === "Writing"
                            ? "bg-green-100 text-green-800"
                            : exam.type === "Listening"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {exam.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          exam.difficulty === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : exam.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {exam.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {exam.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {exam.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.duration} minutes
                        </span>
                        <span>{exam.totalQuestions} questions</span>
                      </div>

                      <button
                        onClick={() => handleAttemptNow(exam)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        Attempt Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow">
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Exams Available
                </h3>
                <p className="text-gray-600 text-center">
                  There are currently no IELTS exams available. Please check
                  back later or contact your instructor.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
      </main>
    </div>
  );
};

export default ExamDashboard;
