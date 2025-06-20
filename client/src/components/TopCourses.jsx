const topCourses = [
  { name: "React Mastery", views: 8392 },
  { name: "UX Design Basics", views: 6542 },
  { name: "Python for Data Science", views: 5023 },
];

const TopCourses = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Top Courses</h3>
      <ul className="space-y-2">
        {topCourses.map((course, index) => (
          <li key={index} className="flex justify-between text-sm">
            <span>{index + 1}. {course.name}</span>
            <span>{course.views} views</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCourses;
