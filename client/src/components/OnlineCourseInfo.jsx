import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Are Online Courses Accredited?",
    answer:
      "Accreditation varies by provider. Some courses offer certification from accredited institutions, while others provide non-accredited personal development content.",
  },
  {
    question: "How Do I Enroll In An Online Course?",
    answer:
      "Enrollment typically involves creating an account on the platform, selecting a course, and completing payment or registration steps.",
  },
  {
    question: "How Much Do Online Courses Cost?",
    answer:
      "Costs range from free to several hundred dollars depending on the provider, course depth, and certification type.",
  },
  {
    question: "How Do I Choose The Right Online Course For Me?",
    answer:
      "Consider your goals, course reviews, instructor credentials, and whether the course offers certification or hands-on practice.",
  },
  {
    question: "What Is The Typical Duration Of An Online Course?",
    answer:
      "Courses can range from a few hours to several months. Many are self-paced, allowing you to complete them on your schedule.",
  },
  {
    question: "Are There Any Prerequisites For Online Courses?",
    answer:
      "Some courses require prior knowledge or experience, while many beginner courses are open to all with no prerequisites.",
  },
  {
    question: "What Kind Of Technical Support Is Available?",
    answer:
      "Most platforms offer support via email, chat, or help centers to assist with technical or course-related issues.",
  },
];

const OnlineCourseInfo = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="about" className="w-full px-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Live Classes with Complete Assistance
          </h2>
          <a
            href="#"
            className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Download Syllabus
          </a>
        </div>

        {/* Intro Text */}
        <div className="mb-8 text-gray-600 max-w-3xl">
          <h3 className="text-xl font-semibold mb-2">
            What Types Of Online Courses Are Available?
          </h3>
          <p>
            Accumsan sit amet nulla facilisi morbi tempus iaculis urna. Vivamus
            arcu felis bibendum ut tristique et egestas. Cras tincidunt
            lobortis feugiat vivamus at augue. Nibh nisl condimentum id
            venenatis a condimentum vitae sapien.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between w-full p-4 text-left text-gray-800 font-medium hover:bg-gray-50"
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {activeIndex === index && (
                <div className="p-4 border-t text-gray-600 bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnlineCourseInfo;
