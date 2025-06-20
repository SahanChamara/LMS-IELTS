// assessmentsdata.js
export const Assessmentss = {
  BUS301: {
    name: "Strategic Management",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which framework analyzes competitive forces in an industry?",
        options: [
          "SWOT Analysis",
          "Porter's Five Forces",
          "Balanced Scorecard",
          "Ansoff Matrix"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "What does 'BCG' stand for in the BCG Matrix?",
        options: [
          "Boston Consulting Group",
          "Business Category Growth",
          "Brand Competitive Graph",
          "Basic Corporate Governance"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain the difference between vertical and horizontal integration with examples.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which strategy focuses on creating unique value for customers?",
        options: [
          "Cost Leadership",
          "Differentiation",
          "Focus Strategy",
          "Operational Excellence"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Analyze how digital transformation is changing corporate strategy in traditional industries.",
        marks: 3
      }
    ]
  },
  BUS205: {
    name: "Business Ethics",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which philosopher is most associated with utilitarianism?",
        options: [
          "Immanuel Kant",
          "John Stuart Mill",
          "Aristotle",
          "John Rawls"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "What is 'whistleblowing' in business ethics?",
        options: [
          "Reporting unethical behavior",
          "Creating fake accounts",
          "Marketing strategy",
          "Employee evaluation process"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Discuss the ethical implications of AI in hiring decisions.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which concept refers to a corporation's social responsibilities?",
        options: [
          "CSR",
          "ROI",
          "KPI",
          "B2B"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Compare shareholder vs stakeholder theory with real-world examples.",
        marks: 3
      }
    ]
  },
  MKT310: {
    name: "Marketing Analytics",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "What does 'CTR' stand for in digital marketing?",
        options: [
          "Click-Through Rate",
          "Customer Transaction Ratio",
          "Conversion Tracking Report",
          "Content Targeting Reach"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "Which metric measures marketing campaign profitability?",
        options: [
          "ROAS",
          "CPC",
          "Bounce Rate",
          "Impression Share"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "coding",
        text: "Write Python code to calculate monthly customer retention rate from a pandas DataFrame containing customer transactions.",
        language: "python",
        marks: 3
      },
      {
        id: 4,
        type: "mcq",
        text: "What type of analysis identifies customer segments?",
        options: [
          "Cluster Analysis",
          "Regression Analysis",
          "Time Series Analysis",
          "Sentiment Analysis"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Explain how predictive analytics can reduce customer churn.",
        marks: 2
      }
    ]
  },
  OPS320: {
    name: "Operations Research",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which technique is used for project scheduling?",
        options: [
          "PERT",
          "EOQ",
          "Markov Chains",
          "Game Theory"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "The transportation problem is a special case of:",
        options: [
          "Linear Programming",
          "Integer Programming",
          "Nonlinear Programming",
          "Dynamic Programming"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain how queueing theory applies to hospital emergency room management.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which method is used for decision-making under uncertainty?",
        options: [
          "Decision Trees",
          "Linear Regression",
          "Factor Analysis",
          "Cluster Analysis"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "coding",
        text: "Implement the Hungarian algorithm to solve an assignment problem in Python.",
        language: "python",
        marks: 3
      }
    ]
  },
  HRM210: {
    name: "Organizational Behavior",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which theory proposes X and Y assumptions about workers?",
        options: [
          "McGregor's Theory",
          "Herzberg's Theory",
          "Maslow's Theory",
          "Vroom's Theory"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "What does 'EQ' stand for in organizational behavior?",
        options: [
          "Emotional Quotient",
          "Efficiency Quality",
          "Executive Qualification",
          "Ethical Questionnaire"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Analyze how remote work affects team dynamics using organizational behavior theories.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which conflict resolution style seeks win-win solutions?",
        options: [
          "Collaborating",
          "Competing",
          "Avoiding",
          "Accommodating"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Discuss the role of organizational culture in mergers and acquisitions.",
        marks: 3
      }
    ]
  },
  ACC101: {
    name: "Financial Accounting",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which principle states expenses should match revenues?",
        options: [
          "Matching Principle",
          "Revenue Recognition",
          "Conservatism",
          "Consistency"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "What increases on the credit side of an account?",
        options: [
          "Assets",
          "Liabilities",
          "Expenses",
          "Dividends"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain the difference between LIFO and FIFO inventory valuation methods.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which financial ratio measures short-term liquidity?",
        options: [
          "Current Ratio",
          "Debt-to-Equity",
          "Return on Assets",
          "Gross Margin"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Analyze how lease accounting changes (ASC 842) impact financial statements.",
        marks: 3
      }
    ]
  },
  HRM315: {
    name: "Leadership & Influence",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which leadership style focuses on serving others first?",
        options: [
          "Transformational",
          "Servant",
          "Transactional",
          "Autocratic"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "Emotional intelligence includes all EXCEPT:",
        options: [
          "Self-awareness",
          "Self-regulation",
          "Technical skills",
          "Social skills"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Compare authentic leadership with charismatic leadership.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which influence tactic uses facts and data?",
        options: [
          "Rational Persuasion",
          "Inspirational Appeals",
          "Coalition",
          "Pressure"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Discuss how leaders can create psychological safety in teams.",
        marks: 3
      }
    ]
  },
  ENT302: {
    name: "Innovation Management",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "The 'Innovator's Dilemma' refers to:",
        options: [
          "Focusing too much on current customers",
          "Lack of R&D funding",
          "Poor patent protection",
          "Slow decision-making"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "Which phase comes first in design thinking?",
        options: [
          "Ideate",
          "Prototype",
          "Empathize",
          "Test"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain open innovation and provide a corporate example.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Blue Ocean Strategy emphasizes:",
        options: [
          "Creating new market spaces",
          "Competing on cost",
          "Improving existing products",
          "Acquiring competitors"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Analyze how corporate venture capital drives innovation.",
        marks: 3
      }
    ]
  },
  OPS410: {
    name: "Supply Chain Management",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "What does 'JIT' stand for in inventory management?",
        options: [
          "Just-In-Time",
          "Joint Inventory Transfer",
          "Journal of International Trade",
          "Job Instruction Training"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "Which technology improves supply chain visibility?",
        options: [
          "Blockchain",
          "Virtual Reality",
          "3D Printing",
          "Chatbots"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain the bullwhip effect and how to mitigate it.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Cross-docking is associated with:",
        options: [
          "Reducing storage time",
          "Quality inspection",
          "Customs clearance",
          "Retail pricing"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Discuss how COVID-19 changed global supply chain strategies.",
        marks: 3
      }
    ]
  },
  BUS350: {
    name: "Data-Driven Decision Making",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which technique identifies relationships between variables?",
        options: [
          "Correlation Analysis",
          "Cluster Analysis",
          "Content Analysis",
          "Cost Analysis"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "What is the purpose of A/B testing?",
        options: [
          "Compare two versions",
          "Analyze time series",
          "Segment customers",
          "Clean datasets"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "coding",
        text: "Write SQL to calculate monthly sales growth percentage from a sales table.",
        language: "sql",
        marks: 3
      },
      {
        id: 4,
        type: "mcq",
        text: "Which visualization shows parts of a whole?",
        options: [
          "Pie Chart",
          "Line Graph",
          "Scatter Plot",
          "Histogram"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Explain how prescriptive analytics differs from predictive analytics.",
        marks: 2
      }
    ]
  },
  BUS220: {
    name: "International Business",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which agreement created the largest free trade area?",
        options: [
          "USMCA",
          "RCEP",
          "CPTPP",
          "EU Single Market"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "Hofstede's cultural dimensions include all EXCEPT:",
        options: [
          "Power Distance",
          "Uncertainty Avoidance",
          "Gross National Product",
          "Masculinity vs Femininity"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Analyze how currency fluctuations impact multinational corporations.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which strategy uses standardized products globally?",
        options: [
          "Transnational",
          "Global",
          "Multidomestic",
          "International"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Discuss the challenges of managing global supply chains post-pandemic.",
        marks: 3
      }
    ]
  },
  HRM405: {
    name: "Human Resource Strategy",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which HR metric measures time-to-fill positions?",
        options: [
          "Recruitment Efficiency",
          "Time-to-Hire",
          "Offer Acceptance Rate",
          "Cost-per-Hire"
        ],
        correctAnswer: 1,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "The 'War for Talent' refers to:",
        options: [
          "Competition for skilled workers",
          "Military recruitment",
          "Sports team drafting",
          "University admissions"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain how HR analytics can reduce employee turnover.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which law prohibits workplace discrimination?",
        options: [
          "Title VII",
          "ERISA",
          "FLSA",
          "FMLA"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Discuss strategic approaches to managing a multigenerational workforce.",
        marks: 3
      }
    ]
  },
  FIN401: {
    name: "Corporate Finance",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which capital budgeting method considers the time value of money?",
        options: [
          "Payback Period",
          "Accounting Rate of Return",
          "Net Present Value",
          "All of the above"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "The optimal capital structure minimizes:",
        options: [
          "Cost of equity",
          "Cost of debt",
          "Weighted average cost of capital",
          "Tax liability"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Explain the Modigliani-Miller theorem and its assumptions.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which risk is diversifiable in a portfolio?",
        options: [
          "Systematic risk",
          "Market risk",
          "Unsystematic risk",
          "Inflation risk"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 5,
        type: "coding",
        text: "Write Python code to calculate the present value of future cash flows given a discount rate.",
        language: "python",
        marks: 3
      }
    ]
  },
  MGT450: {
    name: "Project Management",
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Which document formally authorizes a project?",
        options: [
          "Project Charter",
          "Business Case",
          "Work Breakdown Structure",
          "Gantt Chart"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 2,
        type: "mcq",
        text: "The critical path in a project network is:",
        options: [
          "The shortest path",
          "The path with most dependencies",
          "The longest path with no slack",
          "The path with most resources"
        ],
        correctAnswer: 2,
        marks: 1
      },
      {
        id: 3,
        type: "written",
        text: "Compare agile and waterfall project management methodologies.",
        marks: 2
      },
      {
        id: 4,
        type: "mcq",
        text: "Which technique is used to identify project risks?",
        options: [
          "SWOT Analysis",
          "Pareto Chart",
          "Control Chart",
          "Scatter Diagram"
        ],
        correctAnswer: 0,
        marks: 1
      },
      {
        id: 5,
        type: "written",
        text: "Discuss how earned value management helps track project performance.",
        marks: 3
      }
    ]
  }
};

export const messages = {
  en: {
    assessments: "Assessments",
    startAssessment: "Start Assessment",
    viewDetails: "View Details",
    viewAttempts: "View Attempts",
    assessmentQuiz: "Assessment Quiz",
    question: "Question",
    time: "Time",
    marks: "Marks",
    assessmentSubmitted: "Assessment Submitted!",
    submissionConfirmation: "Your answers have been recorded. You can now close this window.",
    close: "Close",
    previous: "Previous",
    next: "Next",
    submit: "Submit",
    typeYourAnswerHere: "Type your answer here...",
    writeYourCodeHere: "Write your code here...",
    attemptDetails: "Attempt Details",
    attemptSummary: "Attempt Summary",
    startedAt: "Started at",
    finishedAt: "Finished at",
    duration: "Duration",
    score: "Score",
    questionBreakdown: "Question Breakdown",
    totalQuestions: "Total questions",
    answered: "Answered",
    unanswered: "Unanswered",
    questionDetails: "Question Details",
    answeredAt: "Answered at",
    type: "Type",
    yourAnswer: "Your answer",
    availableFrom: "Available from",
    availableUntil: "Available until",
    timeLimit: "Time limit",
    minutes: "minutes",
    attemptsAllowed: "Attempts allowed",
    remainingAttempts: "Remaining attempts",
    quizNotAvailable: "Quiz not available",
    quizNotAvailableMessage: "This quiz is not currently available.",
    quizExpired: "Quiz expired",
    quizExpiredMessage: "The due date for this quiz has passed.",
    quizNotStarted: "Quiz not started",
    quizNotStartedMessage: "This quiz will be available on {date} at {time}.",
    timeRemaining: "Time remaining",
    overdue: "Overdue",
    submitConfirmation: "Are you sure you want to submit your answers?",
    confirm: "Confirm",
    cancel: "Cancel",
    quizInstructions: "Quiz Instructions",
    readCarefully: "Please read the following instructions carefully:",
    instruction1: "You have {time} minutes to complete the quiz.",
    instruction2: "Once started, the quiz must be completed in one sitting.",
    instruction3: "You cannot go back to previous questions after moving forward.",
    instruction4: "The quiz will auto-submit when time expires.",
    beginQuiz: "Begin Quiz",
    attemptHistory: "Attempt History",
    noAttempts: "No attempts yet",
    attemptNumber: "Attempt #{number}",
    dateSubmitted: "Date submitted",
    finalScore: "Final score",
    view: "View",
    backToAssessments: "Back to Assessments",
    timeUp: "Time's up!",
    timeUpMessage: "Your quiz has been auto-submitted as the time limit has been reached."
  }
};