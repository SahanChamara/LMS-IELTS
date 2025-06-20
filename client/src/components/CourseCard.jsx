// CourseCard.jsx
const CourseCard = ({
  courseName,
  description,
  date,
  curriculumCount,
  studentCount,
  rating,
  reviews,
  price,
  isFree,
}) => {
  return (
    <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-2">{date}</p>
        <h3 className="text-xl font-semibold text-gray-800">{courseName}</h3>
        <p className="mt-2 text-gray-600">{description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>{curriculumCount} Curriculum</span>
          <span>{studentCount} Students</span>
        </div>

        <div className="mt-2 text-yellow-500 font-medium">
          ⭐ {rating} ({reviews} Review{reviews > 1 ? 's' : ''})
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">
          {isFree ? 'Free' : `$${price}`}
        </span>
        <button className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition">
          {isFree ? 'Login' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
