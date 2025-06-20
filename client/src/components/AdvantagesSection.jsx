import React from "react";

const AdvantagesSection = () => {
  return (
    <section className="w-full py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        {/* Left Side Image */}
        <div className="w-full lg:w-1/2">
          <img
            src="src/images/img2.jpg" // Place image in public/images/advantage.jpg
            alt="Program Advantage"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Advantages Of Our Program
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Etiam sodales fermentum vivamus etiam tempor orci. Sem et tortor consequat egestas tellus. Nunc eu hendrerit turpis. Fusce non lectus sem In pellentesque nunc.
          </p>

          {/* Progress Bars */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="font-semibold text-gray-700">Education: 80%</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="bg-indigo-600 h-3 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Motivation: 75%</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Coaching: 78%</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
          </div>

          {/* Button */}
          <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            Explore More
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
