import React from 'react';

const HeroSection = ({ onGetStarted }) => {
  return (
    <section id="home">
      <main className="w-full">
        <div
          className="w-full h-[600px] bg-cover bg-center rounded-md"
          style={{
            backgroundImage: "url('/src/images/img1.jpg')",
          }}
        >
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-md">
            <div className="text-white p-6 bg-opacity-75 rounded-md">
              <h1 className="text-4xl font-semibold">
                The World's Best Online Education Institute
              </h1>
              <p className="mt-4 text-lg leading-relaxed">
                Join us to access world-class courses and programs designed to
                boost your career and skills. Flexible learning paths,
                expert instructors, and a supportive community ensure your success.
              </p>

              <div className="mt-4">
                <button
                  onClick={onGetStarted}
                  className="border border-indigo-700 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                >
                  Get Started
                </button>
                <button className="ml-4 border border-slate-500 bg-slate-600 text-white px-6 py-2 rounded-full hover:bg-slate-500 transition duration-300">
                  Learn More
                </button>
              </div>


              <div className="mt-4">
                <p className="text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-indigo-400 hover:underline">
                    Login
                  </a>
                </p>
              </div>
            </div>

          </div> 
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
