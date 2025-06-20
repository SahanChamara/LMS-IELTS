
import { BookOpen } from 'lucide-react';

const OverviewTab = ({ course }) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Units Description
        </h2>
        <p className="text-gray-700">{course.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructor</h2>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <span className="text-indigo-800 font-medium text-lg">
              <BookOpen className="h-6 w-6 text-gray-600" />
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{course.instructor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
