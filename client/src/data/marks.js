export const courses = [

  {
    id: "BUS100",
    unit: "Business Fundamentals",
    credits: 3,
    grade: "A+",
    isRepeated: false,
    assessments: {
      midterm: 45,
      project: 40,
      quizzes: 15
    },
    department: "Business Administration",
    year: 1,
    semester: 1
  },
  {
    id: "ECO101",
    unit: "Economics",
    credits: 3,
    grade: "B+",
    isRepeated: false,
    assessments: {
      midterm: 45,
      project: 40,
      quizzes: 15
    },
    department: "Economics",
    year: 1,
    semester: 1
  }
];


export const academicSummary = {
  finalGPA: 3.65,
  extraCurricularMarks: "95%",
  examDateRange: "March 2025 - April 2025",
  gradeMeanings: {
    "A+": "Excellent",
    "A": "Very Good",
    "B+": "Good",
    "B": "Above Average",
    "C+": "Average",
    "C": "Below Average"
    
  },
  repeatedSubjects: ["Statistics", "Supply Chain"],
  assessmentBreakdown: {
    midterm: "75%",
    project: "30%",
    quizzes: "85%"
  }
};


// Shared insitution page Dashboard Apexchart data
export const trendData = [
  { month: 'Jan', value: 80 },
  { month: 'Feb', value: 50 },
  { month: 'Mar', value: 70 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 80 },
  { month: 'Jun', value: 85 },
];
export const assessmentBreakdown = {
  midterm: "75%",
  project: "90%",
  quizzes: "85%"
};