import React from "react";

const plans = [
  {
    name: "Silver",
    price: 500,
    color: "border-gray-400",
  },
  {
    name: "Gold",
    price: 750,
    color: "border-yellow-500",
  },
  {
    name: "Platinum",
    price: 850,
    color: "border-indigo-600",
  },
];

const CourseOfferings = () => {
  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title and Description */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          View our course offerings
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Ante fermentum fringilla fermentum etiam tempor orci. Sem et tortor consequat id. Fermentum egestas tellus. Nunc eu hendrerit turpis. Fusce non lectus sem In pellentesque nunc.
        </p>

        {/* Toggle Switch (Visual Only) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border rounded-full overflow-hidden">
            <button className="px-6 py-2 bg-indigo-600 text-white font-medium">Monthly</button>
            <button className="px-6 py-2 text-gray-700 hover:bg-gray-100">Annual</button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border-2 ${plan.color} rounded-xl shadow-lg p-6 bg-white hover:scale-105 transition-transform duration-300`}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold text-indigo-600 mb-1">${plan.price}</p>
              <p className="text-gray-500 mb-4">Incl. All Taxes</p>

              {/* Features */}
              <ul className="text-left space-y-2 text-gray-700 mb-6">
                <li>✔ Lifetime course access</li>
                <li>✔ Access to library</li>
                <li>✔ Verified certificate upon completion</li>
                <li>✔ Real-time interaction</li>
                <li>✔ Structured Learning Paths</li>
              </ul>

              {/* Button */}
              <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseOfferings;
