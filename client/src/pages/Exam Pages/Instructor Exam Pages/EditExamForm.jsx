import React, { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import CreateExamForm from "./CreateExamForm";
import AddQuestionsForm from "./AddQuestionsForm";
import AddSectionsForm from "./AddSectionsForm";
import Lecsidebar from "../../lecturepages/Lecsidebar";

const EditExamForm = ({ exam, onBack, onExamUpdated }) => {
  const [currentStep, setCurrentStep] = useState("basic"); //<'basic' | 'sections' | 'questions' | 'review'>
  const [examData, setExamData] = useState(exam);
  const [selectedSection, setSelectedSection] = useState(null);

  // Custom toast function as a replacement for useToast
  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const handleBasicInfoUpdate = (updatedExam) => {
    setExamData(updatedExam);
    setCurrentStep("sections");
  };

  const handleSectionsUpdate = (updatedExam) => {
    setExamData(updatedExam);
    setCurrentStep("review");
  };

  const handleQuestionsUpdate = (updatedSection) => {
    const updatedSections =
      examData.sectionsData?.map((s) =>
        s.id === updatedSection.id ? updatedSection : s
      ) || [];

    const updatedExam = {
      ...examData,
      sectionsData: updatedSections,
      questions: updatedSections.reduce(
        (total, section) => total + (section.questions?.length || 0),
        0
      ),
    };

    setExamData(updatedExam);
    setCurrentStep("sections");
    setSelectedSection(null);
  };

  const handlePublish = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const publishedExam = {
        ...examData,
        status: "published",
        available: true,
      };

      onExamUpdated(publishedExam);
      showToast(
        "Exam Published",
        "Your exam has been published successfully and is now available to students."
      );
    } catch (error) {
      showToast(
        "Error",
        "Failed to publish exam. Please try again.",
        "destructive"
      );
    }
  };

  if (currentStep === "basic") {
    return (
      <CreateExamForm
        onBack={onBack}
        onExamCreated={handleBasicInfoUpdate}
        initialData={examData}
        isEdit={true}
      />
    );
  }

  if (currentStep === "sections") {
    return (
      <AddSectionsForm
        exam={examData}
        onBack={() => setCurrentStep("basic")}
        onComplete={handleSectionsUpdate}
        onEditQuestions={(section) => {
          setSelectedSection(section);
          setCurrentStep("questions");
        }}
      />
    );
  }

  if (currentStep === "questions" && selectedSection) {
    return (
      <AddQuestionsForm
        section={selectedSection}
        examType={examData.type}
        onBack={() => setCurrentStep("sections")}
        onComplete={handleQuestionsUpdate}
      />
    );
  }

  // Review step
  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => setCurrentStep("sections")}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg mr-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sections
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Review & Publish
              </h1>
              <p className="text-gray-600">
                Step 4 of 4: Review your exam and publish
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span className="text-blue-600 font-medium">Basic Info</span>
              <span className="text-blue-600 font-medium">Add Sections</span>
              <span className="text-blue-600 font-medium">Add Questions</span>
              <span className="text-blue-600 font-medium">
                Review & Publish
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-full transition-all duration-300"></div>
            </div>
          </div>

          {/* Exam Summary */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow-md mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {examData.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {examData.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${
                    examData.type === "Reading"
                      ? "bg-blue-100 text-blue-800"
                      : examData.type === "Writing"
                      ? "bg-green-100 text-green-800"
                      : examData.type === "Listening"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-orange-100 text-orange-800"
                  }
                `}
                  >
                    {examData.type}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
                    {examData.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {examData.duration}
                  </p>
                  <p className="text-sm text-gray-600">Minutes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {examData.sectionsData?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Sections</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {examData.questions || 0}
                  </p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Summary */}
          <div className="space-y-4 mb-8">
            {examData.sectionsData?.map((section, index) => (
              <div
                key={section.id}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Section {index + 1}: {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {section.duration} minutes •{" "}
                    {section.questions?.length || 0} questions
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <div className="space-y-2">
                    {section.questions?.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">
                          Q{qIndex + 1}: {question.question.substring(0, 50)}...
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
                          {question.type} • {question.points}pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="space-x-4">
              <button
                onClick={() => setCurrentStep("basic")}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                Edit Basic Info
              </button>
              <button
                onClick={() => setCurrentStep("sections")}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                Edit Sections
              </button>
            </div>
            <div className="space-x-4">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                Publish Exam
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditExamForm;
