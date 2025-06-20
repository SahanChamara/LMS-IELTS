// CourseGrid.jsx
import CourseCard from './CourseCard';

const courseData = [
  {
    courseName: 'Step Into Fashion Modeling',
    description: 'Orci porta non pulvinar neque laoreet suspendisse. Nunc sed blandit libero volutpat.…',
    date: '20 Nov, 2017',
    curriculumCount: 3,
    studentCount: 3,
    rating: 4,
    reviews: 1,
    price: 32,
    isFree: false,
  },
  {
    courseName: 'Business English Essentials',
    description: 'Justo eget magna fermentum iaculis eu. Ut placerat orci nulla pellentesque dignissim…',
    date: '18 Nov, 2017',
    curriculumCount: 3,
    studentCount: 2,
    rating: 5,
    reviews: 1,
    price: 20,
    isFree: false,
  },
  {
    courseName: 'Programming with Python',
    description: 'Gravida in fermentum et sollicitudin ac orci phasellus. Integer malesuada nunc vel…',
    date: '18 Nov, 2017',
    curriculumCount: 3,
    studentCount: 14,
    rating: 4.5,
    reviews: 2,
    price: 0,
    isFree: true,
  },
  {
    courseName: 'Social Media Marketing Mastery',
    description: 'Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. A iaculis…',
    date: '09 Nov, 2017',
    curriculumCount: 3,
    studentCount: 4,
    rating: 5,
    reviews: 1,
    price: 40,
    isFree: false,
  },
  {
    courseName: 'Day Trading Strategies',
    description: 'Congue nisi vitae suscipit tellus mauris a diam maecenas sed. Sollicitudin tempor…',
    date: '02 Nov, 2017',
    curriculumCount: 8,
    studentCount: 1,
    rating: 4,
    reviews: 1,
    price: 40,
    isFree: false,
  },
  {
    courseName: 'English Grammar Mastery',
    description: 'Et netus et malesuada fames. Quis risus sed vulputate odio. Dignissim cras…',
    date: '02 Nov, 2017',
    curriculumCount: 2,
    studentCount: 2,
    rating: 5,
    reviews: 1,
    price: 25,
    isFree: false,
  },
];

const CourseGrid = () => {
  return (
    <section className="w-full bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Our Programs & Accreditation
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Viverra maecenas tempus facilisi pulvinar sapien. Fermentum egestas tellus
          consequat nisl vel pretium. Nunc eu hendrerit turpis. Fusce non lectus sem.
          In pellentesque nunc.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
