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
  // Business Ethics (BUS205)
  {
    id: 2,
    title: "Ethical Decision-Making Report",
    description: "Evaluate a corporate scandal using ethical frameworks",
    dueDate: new Date("2025-05-23T14:30:00"),
    completed: false,
    subjectCode: "BUS205",
    type: "Reflection",
    marks: 50,
    wordCount: 1500
  },
  // Marketing Analytics (MKT310)
  {
    id: 3,
    title: "Customer Segmentation Analysis",
    description: "Use clustering techniques to segment market data",
    dueDate: new Date("2025-05-28T23:59:00"),
    completed: false,
    subjectCode: "MKT310",
    type: "Data Project",
    marks: 80,
    tools: ["Python", "Excel"]
  },
  // Operations Research (OPS320)
  {
    id: 4,
    title: "Linear Optimization Problem",
    description: "Solve a supply chain optimization problem using LP",
    dueDate: new Date("2025-06-02T10:00:00"),
    completed: false,
    subjectCode: "OPS320",
    type: "Simulation",
    marks: 70,
    software: "Excel Solver"
  },
  // Organizational Behavior (HRM210)
  {
    id: 5,
    title: "Team Dynamics Analysis",
    description: "Observe and report on a team's communication patterns",
    dueDate: new Date("2025-06-07T18:00:00"),
    completed: false,
    subjectCode: "HRM210",
    type: "Observation Report",
    marks: 60
  },
  // Financial Accounting (ACC101)
  {
    id: 6,
    title: "Financial Statement Analysis",
    description: "Interpret balance sheets and income statements",
    dueDate: new Date("2025-06-10T12:00:00"),
    completed: false,
    subjectCode: "ACC101",
    type: "Financial Report",
    marks: 90,
    rubric: "financialAnalysis"
  },
  // Leadership & Influence (HRM315)
  {
    id: 7,
    title: "Leadership Case Study",
    description: "Analyze a leader's influence during organizational change",
    dueDate: new Date("2025-06-15T14:30:00"),
    completed: false,
    subjectCode: "HRM315",
    type: "Case Study",
    marks: 70
  },
  // Innovation Management (ENT302)
  {
    id: 8,
    title: "New Product Pitch",
    description: "Develop and present an innovative product idea",
    dueDate: new Date("2025-06-20T09:00:00"),
    completed: false,
    subjectCode: "ENT302",
    type: "Presentation",
    marks: 60,
    teamSize: 4
  },
  // Supply Chain Management (OPS410)
  {
    id: 9,
    title: "Global Logistics Plan",
    description: "Design a cost-effective supply chain for a multinational",
    dueDate: new Date("2025-06-25T23:59:00"),
    completed: false,
    subjectCode: "OPS410",
    type: "Strategic Plan",
    marks: 85
  },
  // Data-Driven Decision Making (BUS350)
  {
    id: 10,
    title: "Predictive Analytics Report",
    description: "Use regression models to forecast sales trends",
    dueDate: new Date("2025-07-01T18:00:00"),
    completed: false,
    subjectCode: "BUS350",
    type: "Data Analysis",
    marks: 95,
    tools: ["R", "Tableau"]
  },
  // International Business (BUS220)
  {
    id: 11,
    title: "Market Entry Strategy",
    description: "Propose a strategy for entering an emerging market",
    dueDate: new Date("2025-07-05T14:30:00"),
    completed: false,
    subjectCode: "BUS220",
    type: "Business Plan",
    marks: 75
  },
  // Human Resource Strategy (HRM405)
  {
    id: 12,
    title: "HR Policy Overhaul",
    description: "Redesign HR policies to align with company strategy",
    dueDate: new Date("2025-07-10T12:00:00"),
    completed: false,
    subjectCode: "HRM405",
    type: "Policy Document",
    marks: 100,
    rubric: "caseStudy"
  }
];

export const subjects = [
  // Business & Management
  { code: "BUS301", name: "Strategic Management", department: "Business", creditHours: 3 },
  { code: "BUS205", name: "Business Ethics", department: "Business", creditHours: 2 },
  { code: "MKT310", name: "Marketing Analytics", department: "Marketing", creditHours: 3 },
  { code: "OPS320", name: "Operations Research", department: "Operations", creditHours: 3 },
  { code: "HRM210", name: "Organizational Behavior", department: "HR", creditHours: 3 },
  { code: "ACC101", name: "Financial Accounting", department: "Finance", creditHours: 3 },
  { code: "HRM315", name: "Leadership & Influence", department: "HR", creditHours: 2 },
  { code: "ENT302", name: "Innovation Management", department: "Entrepreneurship", creditHours: 2 },
  { code: "OPS410", name: "Supply Chain Management", department: "Operations", creditHours: 3 },
  { code: "BUS350", name: "Data-Driven Decision Making", department: "Business", creditHours: 3 },
  { code: "BUS220", name: "International Business", department: "Business", creditHours: 3 },
  { code: "HRM405", name: "Human Resource Strategy", department: "HR", creditHours: 3 }
];

export const rubrics = {
  caseStudy: {
    criteria: ["Analysis", "Structure", "Practical Application"],
    weightage: [40, 30, 30]
  },
  financialAnalysis: {
    criteria: ["Accuracy", "Interpretation", "Recommendations"],
    weightage: [50, 30, 20]
  },
  dataProject: {
    criteria: ["Methodology", "Visualization", "Insights"],
    weightage: [40, 30, 30]
  }
};