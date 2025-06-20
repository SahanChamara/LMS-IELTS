import React from 'react';

const ProgramAdvantages = () => {
  return (
    <section className="w-full bg-gray-50 py-16 px-4 animate-slideIn">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Advantages Of Our Program
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Learn why students love our platform.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div>
            <p className="text-4xl font-bold text-indigo-600">99M</p>
            <p className="text-sm text-gray-500 mt-1">Learners worldwide</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-600">9/10</p>
            <p className="text-sm text-gray-500 mt-1">Student satisfaction</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-pink-600">95%</p>
            <p className="text-sm text-gray-500 mt-1">Completion rate</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-yellow-600">50K</p>
            <p className="text-sm text-gray-500 mt-1">Certified graduates</p>
          </div>
        </div>

        <button className="mt-10 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
          Explore More
        </button>
      </div>
    </section>
  );
};

export default ProgramAdvantages;
