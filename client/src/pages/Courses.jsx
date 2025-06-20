import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { HashLink } from "react-router-hash-link";

const courseCategories = [
  "All",
  "Art & Illustration",
  "Digital Marketing",
  "Photography",
  "Information and Communication Technology",
  "Web Development",
  "Mobile Development",
  "Languages",
  "Business Management",
  "Human Resource Development",
  "Marketing",
  "Law",
  "Institute of Information Technology",
  "Bachelor of Business Studies",
  "Computer Science and Technology",
  "Software and Communication Technology",
  "Higher Technical Education",
  "Production and Logistics Technology",
  "Environmental Management",
  "Aquatic Technology",
  "Ocean Science",
  "Engineering and Technology",
  "Planning and Drawing",
  "Professional Skills"
];

const allCourses = Array.from({ length: 100 }, (_, i) => ({
  name: `Course Title ${i + 1}`,
  category: courseCategories[(i % (courseCategories.length - 1)) + 1],
  subCategory: "Professional Skills",
  description: `This is a brief description of Course Title ${i + 1}.`
}));

const AllCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredCourses = selectedCategory === "All"
    ? allCourses
    : allCourses.filter(
        course => course.category === selectedCategory || course.subCategory === selectedCategory
      );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <section  className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-10 text-center">
          Our Courses
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
          Viverra maecenas tempus facilisi pulvinar sapien. Fermentum egestas tellus consequat
          nisl vel pretium. Nunc eu hendrerit turpis. Fusce non lectus sem. In pellentesque nunc.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {courseCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-300
                ${selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {course.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">Category: {course.category}</p>
              <p className="text-sm text-gray-500 mb-4">Area: {course.subCategory}</p>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllCourses;