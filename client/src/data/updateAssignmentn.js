export const assignment = [
  // Strategic Management (BUS301)
{
    id: 1,
    title: "Competitive Strategy Analysis",
    description: "Analyze Porter's Five Forces for a chosen industry",
    dueDate: new Date("2025-05-19T14:30:00"),
    completed: false,
    subjectCode: "BUS301",
    type: "Case Study",
    marks: 100,
    rubric: "caseStudy"
  },
];

export const subjects = [
  // Business & Management
  {
    code: "BUS301",
    name: "Strategic Management",
    department: "Business",
    creditHours: 3,
  },
  {
    code: "BUS205",
    name: "Business Ethics",
    department: "Business",
    creditHours: 2,
  },
  {
    code: "MKT310",
    name: "Marketing Analytics",
    department: "Marketing",
    creditHours: 3,
  },
  {
    code: "OPS320",
    name: "Operations Research",
    department: "Operations",
    creditHours: 3,
  },
  {
    code: "HRM210",
    name: "Organizational Behavior",
    department: "HR",
    creditHours: 3,
  },
  {
    code: "ACC101",
    name: "Financial Accounting",
    department: "Finance",
    creditHours: 3,
  },
  {
    code: "HRM315",
    name: "Leadership & Influence",
    department: "HR",
    creditHours: 2,
  },
  {
    code: "ENT302",
    name: "Innovation Management",
    department: "Entrepreneurship",
    creditHours: 2,
  },
  {
    code: "OPS410",
    name: "Supply Chain Management",
    department: "Operations",
    creditHours: 3,
  },
  {
    code: "BUS350",
    name: "Data-Driven Decision Making",
    department: "Business",
    creditHours: 3,
  },
  {
    code: "BUS220",
    name: "International Business",
    department: "Business",
    creditHours: 3,
  },
  {
    code: "HRM405",
    name: "Human Resource Strategy",
    department: "HR",
    creditHours: 3,
  },
];

export const rubrics = {
  caseStudy: {
    criteria: ["Analysis", "Structure", "Practical Application"],
    weightage: [40, 30, 30],
  },
  financialAnalysis: {
    criteria: ["Accuracy", "Interpretation", "Recommendations"],
    weightage: [50, 30, 20],
  },
  dataProject: {
    criteria: ["Methodology", "Visualization", "Insights"],
    weightage: [40, 30, 30],
  },
};
