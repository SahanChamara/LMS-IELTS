import React from 'react';

const categories = [
  {
    icon: "🎨",
    title: "Art & Illustration",
    courses: 2,
    color: "indigo",
  },
  {
    icon: "📈",
    title: "Digital Marketing",
    courses: 2,
    color: "green",
  },
  {
    icon: "🎨",
    title: "Graphic Design",
    courses: 1,
    color: "pink",
  },
  {
    icon: "📷",
    title: "Photography",
    courses: 3,
    color: "yellow",
  },
  
];

const colorMap = {
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    button: "bg-indigo-600 hover:bg-indigo-700",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    button: "bg-green-600 hover:bg-green-700",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    button: "bg-yellow-600 hover:bg-yellow-700",
  },
 
};

const TopCourseCategories = () => {
  return (
    <section className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center animate-slideIn">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Explore Top Course Categories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Discover trending subjects and find your passion.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((item, i) => {
            const styles = colorMap[item.color] || colorMap.indigo;

            return (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <div className="mb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${styles.bg} ${styles.text}`}
                  >
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-500 mt-1 mb-4">
                  {item.courses} courses
                </p>
                <button
                  className={`text-sm text-white px-4 py-2 rounded-md ${styles.button}`}
                >
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopCourseCategories;
