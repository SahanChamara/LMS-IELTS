import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
const Exams = () => {
  // Mock data - expanded for medical, student, and payment details
  const mockCourses = [
    {
      id: "med101",
      code: "MED101",
      name: "Anatomy",
      department: "Medicine",
      credits: 4,
    },
    {
      id: "cs201",
      code: "CS201",
      name: "Data Structures",
      department: "Computer Science",
      credits: 3,
    },
    {
      id: "eng301",
      code: "ENG301",
      name: "Thermodynamics",
      department: "Engineering",
      credits: 4,
    },
    {
      id: "math401",
      code: "MATH401",
      name: "Advanced Calculus",
      department: "Mathematics",
      credits: 3,
    },
  ];

  const mockStudents = [
    {
      stdId: "STD2023001",
      firstName: "Alex",
      lastName: "Johnson",
      program: "MBBS",
      semester: 3,
      bankDetails: {
        accountNumber: "1234567890",
        bankName: "International Bank",
        branch: "Main Campus Branch",
        ifscCode: "INTL000123",
      },
    },
  ];

  const mockExams = {
    med101: [
      {
        id: "med101-mid",
        name: "Midterm Practical",
        date: "2023-10-15",
        type: "practical",
      },
      {
        id: "med101-final",
        name: "Final Theory",
        date: "2023-12-10",
        type: "theory",
      },
    ],
    cs201: [
      {
        id: "cs201-mid",
        name: "Midterm Exam",
        date: "2023-10-20",
        type: "theory",
      },
      {
        id: "cs201-final",
        name: "Final Practical",
        date: "2023-12-15",
        type: "practical",
      },
    ],
    eng301: [
      {
        id: "eng301-mid",
        name: "Midterm Assessment",
        date: "2023-10-25",
        type: "theory",
      },
    ],
    math401: [
      {
        id: "math401-final",
        name: "Final Exam",
        date: "2023-12-20",
        type: "theory",
      },
    ],
  };

  const mockPreviousAttempts = [
    {
      id: "attempt1",
      date: "2023-06-15",
      score: 45,
      status: "Failed",
      remarks: "Incomplete practical component",
      medicalReport: null,
    },
    {
      id: "attempt2",
      date: "2023-08-20",
      score: 52,
      status: "Failed",
      remarks: "Borderline pass - requires improvement",
      medicalReport: "medical_report_202308.pdf",
    },
  ];

  // Application state
  const [step, setStep] = useState(1);
  const [examType, setExamType] = useState(null);
  const [courses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [justification, setJustification] = useState("");
  const [medicalReport, setMedicalReport] = useState(null);
  const [medicalReportName, setMedicalReportName] = useState("");
  const [studentDetails] = useState(mockStudents[0]);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  // Set exams when course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setExams([]);
      return;
    }
    setExams(mockExams[selectedCourse] || []);
    setSelectedExam("");
  }, [selectedCourse]);

  // Set mock previous attempts for repeat exams
  useEffect(() => {
    if (examType === "repeat" && selectedExam) {
      setPreviousAttempts(mockPreviousAttempts);
    } else {
      setPreviousAttempts([]);
    }
  }, [examType, selectedExam]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors({
          ...errors,
          medicalReport: "File size must be less than 5MB",
        });
        return;
      }
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setErrors({
          ...errors,
          medicalReport: "Only PDF, JPEG, or PNG files allowed",
        });
        return;
      }
      setMedicalReport(file);
      setMedicalReportName(file.name);
      setErrors({ ...errors, medicalReport: "" });
    }
  };

  // Handle exam type selection
  const handleExamTypeSelect = (type) => {
    setExamType(type);
    setErrors({});
  };

  // Handle next step
  const handleNext = () => {
    const validationErrors = validateCurrentStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep(step + 1);
    setErrors({});
  };

  // Handle previous step
  const handlePrev = () => {
    setStep(step - 1);
    setErrors({});
  };

  // Validate current step
  const validateCurrentStep = () => {
    const newErrors = {};

    if (step === 1 && !examType) {
      newErrors.examType = "Please select an exam type";
    }

    if (step === 2) {
      if (!selectedCourse) {
        newErrors.course = "Please select a course";
      }
      if (!selectedExam) {
        newErrors.exam = "Please select an exam";
      }
      if (examType === "re-correction" && justification.trim().length < 20) {
        newErrors.justification =
          "Please provide a detailed justification (at least 20 characters)";
      }
      if (
        examType === "repeat" &&
        !medicalReport &&
        previousAttempts.some((a) => a.medicalReport)
      ) {
        newErrors.medicalReport =
          "Medical report is required for this repeat attempt";
      }
    }

    if (step === 3) {
      if (!termsAgreed) {
        newErrors.terms = "You must agree to the terms to proceed";
      }
      if (paymentMethod === "credit-card") {
        if (!cardDetails.number || !/^\d{16}$/.test(cardDetails.number)) {
          newErrors.cardNumber = "Valid 16-digit card number required";
        }
        if (!cardDetails.name) {
          newErrors.cardName = "Cardholder name required";
        }
        if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
          newErrors.cardExpiry = "Valid expiry date (MM/YY) required";
        }
        if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
          newErrors.cardCvv = "Valid CVV required";
        }
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = () => {
    const validationErrors = validateCurrentStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulate submission
    setTimeout(() => {
      setSubmissionSuccess(true);
    }, 1500);
  };

  // Calculate fees based on exam type
  const calculateFees = () => {
    const baseFee = selectedCourse === "med101" ? 75 : 50; // Higher fee for medical courses
    switch (examType) {
      case "repeat":
        return baseFee * 1.5; // 50% more for repeats
      case "re-correction":
        return baseFee * 0.7; // 30% discount for re-correction
      default:
        return baseFee;
    }
  };

  // Render student information section
  const renderStudentInfo = () => (
    <div className="bg-blue-50 p-4 rounded-md mb-6">
      <h3 className="font-semibold text-lg mb-2">Student Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600">Student ID</p>
          <p className="font-medium">{studentDetails.stdId}</p>
        </div>
        <div>
          <p className="text-gray-600">Name</p>
          <p className="font-medium">
            {studentDetails.firstName} {studentDetails.lastName}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Program</p>
          <p className="font-medium">
            {studentDetails.program} (Semester {studentDetails.semester})
          </p>
        </div>
      </div>
    </div>
  );

  // Render exam type selection cards
  const renderExamTypeSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {["proper", "repeat", "re-correction"].map((type) => (
        <div
          key={type}
          className={`p-6 rounded-lg border cursor-pointer transition-all ${
            examType === type
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-green-300"
          }`}
          onClick={() => handleExamTypeSelect(type)}
        >
          <h3 className="font-semibold text-lg capitalize">
            {type.split("-").join(" ")} Exam
          </h3>
          <p className="text-gray-600 mt-2">
            {type === "proper" && "First attempt at an exam"}
            {type === "repeat" && "Retake after unsuccessful attempt"}
            {type === "re-correction" && "Request exam paper review"}
          </p>
          <div className="text-right text-green-500 font-bold">
            {examType === type && "✓"}
          </div>
        </div>
      ))}
      {errors.examType && (
        <p className="text-red-500 text-sm mt-1">{errors.examType}</p>
      )}
    </div>
  );

  // Render exam details form
  const renderExamDetails = () => (
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <label
          htmlFor="course-select"
          className="block font-medium text-gray-700"
        >
          Select Course
        </label>
        <select
          id="course-select"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name} ({course.department},{" "}
              {course.credits} credits)
            </option>
          ))}
        </select>
        {errors.course && (
          <p className="text-red-500 text-sm">{errors.course}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="exam-select"
          className="block font-medium text-gray-700"
        >
          Select Exam
        </label>
        <select
          id="exam-select"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          disabled={!selectedCourse}
        >
          <option value="">-- Select Exam --</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name} ({exam.type},{" "}
              {new Date(exam.date).toLocaleDateString()})
            </option>
          ))}
        </select>
        {errors.exam && <p className="text-red-500 text-sm">{errors.exam}</p>}
      </div>

      {examType === "repeat" && previousAttempts.length > 0 && (
        <div className="mt-4 space-y-4">
          <h4 className="font-medium text-gray-700">
            Previous Attempt History
          </h4>
          <div className="space-y-3">
            {previousAttempts.map((attempt, index) => (
              <div key={attempt.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">Attempt #{index + 1}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      attempt.status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {attempt.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <p>Date: {new Date(attempt.date).toLocaleDateString()}</p>
                  <p>Score: {attempt.score}/100</p>
                  <p>Remarks: {attempt.remarks}</p>
                  <p>
                    Medical Report:{" "}
                    {attempt.medicalReport ? "Submitted" : "Not submitted"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Medical Report (if applicable)
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
                <span className="text-blue-600">Upload File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <span className="text-sm text-gray-500">
                {medicalReportName || "No file selected"}
              </span>
            </div>
            <small className="text-gray-500">PDF, JPG, or PNG (max 5MB)</small>
            {errors.medicalReport && (
              <p className="text-red-500 text-sm">{errors.medicalReport}</p>
            )}
          </div>
        </div>
      )}

      {examType === "re-correction" && (
        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Re-Correction Justification
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="Explain why you're requesting re-correction..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <small className="text-gray-500">
            {justification.length}/500 characters
          </small>
          {errors.justification && (
            <p className="text-red-500 text-sm">{errors.justification}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render payment details
  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-semibold text-lg">Payment Method</h4>
        <div className="space-y-3">
          {["credit-card", "bank-transfer", "wallet"].map((method) => (
            <div key={method} className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                id={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
              <label htmlFor={method} className="flex-1 capitalize">
                <span>{method.split("-").join(" ")}</span>
                {method === "bank-transfer" && (
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Account: {studentDetails.bankDetails.accountNumber}</p>
                    <p>Bank: {studentDetails.bankDetails.bankName}</p>
                    <p>IFSC: {studentDetails.bankDetails.ifscCode}</p>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      {paymentMethod === "credit-card" && (
        <div className="bg-gray-50 p-4 rounded-md space-y-3">
          <h4 className="font-medium">Credit Card Details</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">{errors.cardNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Name on card"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm">{errors.cardName}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-sm">{errors.cardExpiry}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
                {errors.cardCvv && (
                  <p className="text-red-500 text-sm">{errors.cardCvv}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render confirmation and payment section
  const renderConfirmation = () => (
    <div className="space-y-6 mt-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-semibold text-lg mb-2">Application Summary</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Student Information</p>
              <p>
                {studentDetails.firstName} {studentDetails.lastName}
              </p>
              <p>
                {studentDetails.stdId} | {studentDetails.program}
              </p>
            </div>
            <div>
              <p className="font-medium">Exam Details</p>
              <p>Type: {examType && examType.split("-").join(" ")}</p>
              <p>
                Course: {courses.find((c) => c.id === selectedCourse)?.name}
              </p>
              <p>Exam: {exams.find((e) => e.id === selectedExam)?.name}</p>
            </div>
          </div>
          {examType === "re-correction" && (
            <div>
              <p className="font-medium">Justification</p>
              <p className="whitespace-pre-line">{justification}</p>
            </div>
          )}
          {examType === "repeat" && medicalReportName && (
            <div>
              <p className="font-medium">Medical Report</p>
              <p>{medicalReportName}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-md">
        <h4 className="font-semibold text-lg mb-2">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Fee:</span>
            <span>$50.00</span>
          </div>
          {examType === "repeat" && (
            <div className="flex justify-between">
              <span>Repeat Surcharge (50%):</span>
              <span>$25.00</span>
            </div>
          )}
          {examType === "re-correction" && (
            <div className="flex justify-between">
              <span>Re-Correction Discount (30%):</span>
              <span className="text-green-600">-$15.00</span>
            </div>
          )}
          {selectedCourse === "med101" && (
            <div className="flex justify-between">
              <span>Medical Course Fee:</span>
              <span>$25.00</span>
            </div>
          )}
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span>${calculateFees().toFixed(2)}</span>
          </div>
          <div className="pt-2">
            <p className="text-sm text-gray-500">
              Payment Method: {paymentMethod.split("-").join(" ")}
            </p>
          </div>
        </div>
      </div>

      {renderPaymentDetails()}

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms-agree"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 mt-1"
        />
        <label htmlFor="terms-agree" className="text-sm">
          I certify that all information provided is accurate. I understand that
          false information may result in cancellation of my exam registration.
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            exam regulations
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            terms of service
          </a>
          .
        </label>
      </div>
      {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
    </div>
  );

  // Render success modal
  const renderSuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
        <div className="text-5xl text-green-500 mb-4">✓</div>
        <h3 className="text-xl font-bold mb-2">
          Application Submitted Successfully!
        </h3>
        <div className="space-y-3 mb-6 text-left">
          <p>
            Reference Number:{" "}
            <span className="font-mono">
              EXM{Date.now().toString().slice(-6)}
            </span>
          </p>
          <p>
            Amount Paid:{" "}
            <span className="font-bold">${calculateFees().toFixed(2)}</span>
          </p>
          <p>
            Payment Method:{" "}
            <span className="capitalize">
              {paymentMethod.split("-").join(" ")}
            </span>
          </p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-20">
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Exam Application</h1>
          <p className="text-gray-600 mb-6">
            Complete your exam registration in 3 simple steps
          </p>

          {renderStudentInfo()}

          {/* Progress indicator */}
          <div className="relative mb-8">
            <div className="flex justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex flex-col items-center ${
                    step >= stepNumber ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      step >= stepNumber
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-100 border-gray-300"
                    } border-2`}
                  >
                    {stepNumber}
                  </div>
                  <div className="text-sm">
                    {stepNumber === 1 && "Exam Type"}
                    {stepNumber === 2 && "Exam Details"}
                    {stepNumber === 3 && "Payment"}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Exam Type Selection */}
          {step === 1 && (
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">1. Select Exam Type</h2>
              {renderExamTypeSelection()}
              <div className="flex justify-end mt-6">
                <button
                  className={`px-6 py-2 rounded-md ${
                    !examType
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={handleNext}
                  disabled={!examType}
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {/* Step 2: Exam Details */}
          {step === 2 && (
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">
                2. Provide Exam Details
              </h2>
              {renderExamDetails()}
              <div className="flex justify-between mt-6">
                <button
                  className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <button
                  className={`px-6 py-2 rounded-md ${
                    !selectedCourse ||
                    !selectedExam ||
                    (examType === "re-correction" &&
                      justification.length < 20) ||
                    (examType === "repeat" && errors.medicalReport)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={handleNext}
                  disabled={
                    !selectedCourse ||
                    !selectedExam ||
                    (examType === "re-correction" &&
                      justification.length < 20) ||
                    (examType === "repeat" && errors.medicalReport)
                  }
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {/* Step 3: Confirmation & Payment */}
          {step === 3 && (
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">3. Review & Payment</h2>
              {renderConfirmation()}
              <div className="flex justify-between mt-6">
                <button
                  className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <button
                  className={`px-6 py-2 rounded-md ${
                    !termsAgreed ||
                    (paymentMethod === "credit-card" &&
                      Object.keys(errors).some((k) => k.includes("card")))
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={handleSubmit}
                  disabled={
                    !termsAgreed ||
                    (paymentMethod === "credit-card" &&
                      Object.keys(errors).some((k) => k.includes("card")))
                  }
                >
                  Submit Application
                </button>
              </div>
            </section>
          )}

          {/* Success Modal */}
          {submissionSuccess && renderSuccessModal()}
        </div>
      </main>
    </div>
  );
};

export default Exams;
