import React from "react";
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const courses = [
  {
    id: 'BUS301',
    title: 'Strategic Management',
    details: ['📅 Dec 2023'],
    description: 'Understand market forces and develop competitive strategies.',
    image: img1
  },
  {
    id: 'BUS205',
    title: 'Business Ethics',
    details: ['📅 Mar 2024'],
    description: 'Explore ethical decision-making in corporate environments.',
    image: img2
  },
  {
    id: 'MKT310',
    title: 'Marketing Analytics',
    details: ['📅 May 2024'],
    description: 'Use data to drive marketing decisions and measure impact.',
    image: img3
  },
];

const CompletedCoursesCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Units</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            className="bg-white/10 backdrop-blur-lg border-2 border-gray-300/50 rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow duration-300"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Top: Title */}
            <h3 className="text-md font-semibold text-gray-800 mb-3">{course.title}</h3>
            
            {/* Middle: Course Image */}
            <div className="my-3 flex justify-center h-40 overflow-hidden rounded-md">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Details */}
            <div className="text-sm text-gray-600 space-y-2 mb-3">
              {course.details.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            
            {/* Bottom: ID and Description with See Details button */}
            <div className="mt-auto space-y-3">
              <p className="text-xs font-mono text-gray-500">ID: {course.id}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              <div className="flex justify-end">
                <Link
                  to={`/unit/${course.id}`}
                  state={{ course: course }}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCoursesCard;