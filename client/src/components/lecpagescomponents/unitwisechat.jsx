import React from 'react';

const DiscussionCards = () => {
  const units = [
    { id: 1, title: 'python' },
    { id: 2, title: 'Unit 2' },
    { id: 3, title: 'Unit 3' },
    { id: 4, title: 'Unit 4' },
    { id: 5, title: 'Unit 5' },
    { id: 6, title: 'Unit 6' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="flex items-center justify-center bg-white border rounded-lg shadow-md h-24 w-full"
          >
            <h3 className="text-lg text-gray-700 font-semibold">{unit.title}</h3>
            <div className="ml-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Get Discussion
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionCards;