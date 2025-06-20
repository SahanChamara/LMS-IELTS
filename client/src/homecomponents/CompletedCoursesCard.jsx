import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import { Link } from "react-router-dom";


const courses = [
  {
    id: 'BUS301',
    title: 'Strategic Management',
    details: ['📅 Dec 2023'],
    description: 'Understand market forces and develop competitive strategies..',
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
    <div className="bg-white bordershadow-sm p-2 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Top: Title */}
            <h3 className="text-md font-semibold text-gray-800 mb-2">{course.title}</h3>
            
            {/* Middle: Course Image */}
            <div className="my-3 flex justify-center h-40 overflow-hidden rounded-md">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            
            {/* Details */}
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {course.details.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            
            {/* Bottom: ID and Description with See Details button */}
            <div className="mt-auto space-y-2">
              <p className="text-xs font-mono text-gray-500">ID: {course.id}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              <div className="flex justify-end">
                <Link
                  to={`/course/${course.id}`}
                  state={{ course: course }}
                  className="text-sm px-3 py-1 bg-black text-white  rounded-md shadow-sm hover:bg-gray-600 hover:text-white transition duration-300 ease-in-out"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCoursesCard;