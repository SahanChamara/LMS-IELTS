import { Clock, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ExamPaper from "./ExamPaper";
import { useAppDispatch, useAppSelector } from "../../redux/store-config/store";
import { getExamByIdAPI } from "../../redux/features/examIeltsSlice";

const ExamIntro = ({ exam, onBack }) => {
  const dispatch = useAppDispatch();
  const { currentExam, loading, error } = useAppSelector(
    (state) => state.examIelts
  );
  const [startExam, setStartExam] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const instructions = [
    "Read all questions carefully before answering",
    "You cannot go back to previous sections once completed",
    "Manage your time wisely - there's a timer for each section",
    "Copy and paste functions are disabled for security",
    "Screenshots and screen recording are not allowed",
    "Ensure stable internet connection throughout the exam",
    "Submit your answers before the time limit expires",
  ];

  const examDetails = [
    { label: "Duration", value: `${exam.duration} minutes`, icon: Clock },
    {
      label: "Questions",
      value: exam.totalQuestions.toString(),
      icon: FileText,
    },
    { label: "Difficulty", value: exam.difficulty, icon: AlertTriangle },
    { label: "Type", value: exam.type, icon: CheckCircle },
  ];

  const handleStartExamNow = async () => {
    //setLoading(true);
    // Simulate async operation (e.g., loading exam data)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await dispatch(getExamByIdAPI(exam._id)).unwrap();
    if (result) {      
      console.log("get exam by id result", result);
      setSelectedExam(result);
      setStartExam(true);
    }
  };

  if (startExam) {       
    return <ExamPaper exam={selectedExam} onBack={() => setStartExam(false)} />;
  }

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8" role="banner">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Exam Introduction
            </h1>
            <p className="text-lg text-gray-600">
              Please read the instructions carefully before starting
            </p>
          </div>

          {/* Exam Details Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 mb-6 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {exam.title}
              </h2>
              <p className="text-lg text-gray-600">{exam.description}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {examDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg"
                  >
                    <detail.icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">
                        {detail.label}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 mb-6 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Important Instructions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-red-50 border border-red-200 mb-8 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Notice
              </h2>
            </div>
            <div className="p-6">
              <div className="text-red-700 space-y-2">
                <p>• This exam is monitored for security purposes</p>
                <p>• Copy, paste, and screenshot functions are disabled</p>
                <p>
                  • Any attempt to cheat will result in automatic
                  disqualification
                </p>
                <p>• Please ensure you're in a quiet environment</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={onBack}
              className="px-8 py-3 text-lg border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleStartExamNow}
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Start Exam Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamIntro;
