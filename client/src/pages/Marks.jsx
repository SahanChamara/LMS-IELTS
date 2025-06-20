import React from "react";
import Sidebar from "../components/Sidebar";
import Card, { CardContent } from "../components/Card";
import { courses, academicSummary } from "../data/marks";
import ExamApplication from "../pages/Exam";
import { useNavigate } from "react-router-dom";


const Institution = () => {
  const transformCoursesToAcademicYears = () => {
    // Group courses by year and semester using the existing properties
    const years = {};
    
    courses.forEach(course => {
      const yearIndex = course.year - 1; // Convert to 0-based index
      const semesterIndex = course.semester - 1; // Convert to 0-based index
      
      if (!years[yearIndex]) {
        years[yearIndex] = {
          year: `Year ${course.year}`,
          semesters: [
            { name: "Semester 1", subjects: [] },
            { name: "Semester 2", subjects: [] }
          ]
        };
      }
      
      years[yearIndex].semesters[semesterIndex].subjects.push({
        name: course.name,
        grade: course.grade,
        courseData: course
      });
    });
    
    return Object.values(years);
  };

  const academicYears = transformCoursesToAcademicYears();
const navigate = useNavigate();
  // Prepare results summary using academicSummary data
  const resultsSummary = {
    examDates: academicSummary.examDateRange,
    continuousAssessments: [
      { 
        name: "Midterm Exam", 
        marks: parseFloat(academicSummary.assessmentBreakdown.midterm) 
      },
      { 
        name: "Project Work", 
        marks: parseFloat(academicSummary.assessmentBreakdown.project) 
      },
      { 
        name: "Quizzes", 
        marks: parseFloat(academicSummary.assessmentBreakdown.quizzes) 
      }
    ],
    repeatedSubjects: academicSummary.repeatedSubjects,
    extraCurricularMarks: academicSummary.extraCurricularMarks,
    finalGPA: academicSummary.finalGPA
  };

  // Prepare grade legend from academicSummary
  const gradeLegend = Object.entries(academicSummary.gradeMeanings).map(
    ([grade, meaning]) => ({ grade, meaning })
  );

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        {/* Academic years cards */}
        <Card>
          <div className="mb-1 px-10 mt-6">
            <h2 className="text-2xl font-semibold text-gray-900">Marks</h2>
            <p className="text-sm text-gray-600">
              LMS - Record of Formative Coursework Evaluation
            </p>
          </div>

          <CardContent>
            <div className="space-y-10">
              {academicYears.map((year, yearIdx) => (
                <div
                  key={yearIdx}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm transition p-6"
                >
                  <h3 className="text-xl font-semibold text-blue-700 mb-6 text-left">
                    {`${yearIdx + 1}. ${year.year}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {year.semesters.map((semester, semIdx) => (
                      <div
                        key={semIdx}
                        className="border rounded-lg p-4 bg-gray-50 flex flex-col items-center"
                      >
                        <h4 className="text-md font-semibold text-gray-800 mb-3">
                          {semester.name}
                        </h4>
                        <ul className="space-y-2 w-full">
                          {semester.subjects.map((subject, subIdx) => (
                            <li
                              key={subIdx}
                              className="flex items-center justify-between text-sm border-b pb-1 text-gray-700"
                            >
                              <span className="truncate">{subject.name}</span>
                              <span className="font-semibold w-12 flex items-center justify-center">
                                {subject.grade}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final results summary card */}
        <Card className="mt-10">
          <div className="mb-1 px-10 mt-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Results Summary
              </h2>
              <p className="text-sm text-gray-600">
                Exam Face Dates:{" "}
                <span className="font-medium">{resultsSummary.examDates}</span>
              </p>
            </div>

            <div className="text-sm text-gray-700 bg-gray-100 p-4 rounded-md shadow-inner w-52">
              <h4 className="font-semibold mb-2 text-center">Grade Meaning</h4>
              <ul className="space-y-1">
                {gradeLegend.map(({ grade, meaning }) => (
                  <li
                    key={grade}
                    className="flex justify-between border-b pb-1 last:border-none"
                  >
                    <span className="font-semibold w-10 text-center">{grade}</span>
                    <span className="text-left">{meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b border-gray-300 pb-1">
                  Continuous Assessments
                </h3>
                <ul className="space-y-2">
                  {resultsSummary.continuousAssessments.map((assessment, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b pb-1 text-gray-700"
                    >
                      <span>{assessment.name}</span>
                      <span className="font-semibold">{assessment.marks}%</span>
                    </li>
                  ))}
                </ul>

                {/* Applying for Exams Section */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Applying for Exams
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Apply for proper, repeat, or re-correction exams using the button below.
                  </p>
                   <button
      onClick={() => navigate('/exam-application')}
      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      Click here
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 transform rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 border-b border-gray-300 pb-1">
                  Repeated Subjects
                </h3>
                <ul className="list-disc list-inside mb-6 text-gray-700">
                  {resultsSummary.repeatedSubjects.length > 0 ? (
                    resultsSummary.repeatedSubjects.map((subject, idx) => (
                      <li key={idx}>{subject}</li>
                    ))
                  ) : (
                    <li>No repeated subjects</li>
                  )}
                </ul>

                <h3 className="font-semibold text-lg mb-3 border-b border-gray-300 pb-1">
                  Extra-Curricular Activity Marks
                </h3>
                <p className="text-gray-700 font-semibold text-xl">
                  {resultsSummary.extraCurricularMarks}
                </p>

                <h3 className="font-semibold text-lg mt-8 mb-3 border-b border-gray-300 pb-1">
                  Final GPA
                </h3>
                <p className="text-blue-700 font-bold text-2xl">
                  {resultsSummary.finalGPA}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>  
    </div>
  );
};

export default Institution;