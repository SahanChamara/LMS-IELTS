import { useState } from 'react';
import { Link } from 'react-router-dom';

const IELTSLandingPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    console.log('Sign-up email:', email);
    setEmail('');
    setError('');
    window.location.href = '/register';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-purple-100 font-sans animate-fade-in">
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Left: Hero Text and CTA */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Ace Your IELTS with Our LMS
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-3">
            Master Reading, Writing, Listening, and Speaking with expert-led online courses tailored for your success.
          </p>
          <ul className="text-sm md:text-base text-gray-600 mb-4 space-y-1">
            <li>🚀 Personalized IELTS study plans</li>
            <li>📚 Real IELTS practice tests</li>
            <li>🎥 Live sessions with top instructors</li>
          </ul>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full sm:w-64 transition-all duration-300"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 hover:scale-105 transition-transform duration-200 text-sm"
              >
                Sign Up Now
              </button>
              <Link
                to="/login"
                className="bg-transparent border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 hover:scale-105 transition-transform duration-200 text-sm"
              >
                Login
              </Link>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {/* Testimonial */}
          <div className="mt-3 bg-white bg-opacity-80 rounded-lg p-3 text-sm italic text-gray-600 shadow-sm">
            "Scored 8.5 on IELTS with these amazing courses!" – Emma T.
          </div>
        </div>
        {/* Right: Hero Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/assets/ielts-hero-modern.jpg"
            alt="IELTS Study"
            className="max-w-full h-auto sm:max-w-xs md:max-w-sm rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-3 text-center">
        <div className="flex justify-center space-x-4 mb-1">
          <Link to="/about" className="text-xs sm:text-sm hover:text-indigo-300 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-xs sm:text-sm hover:text-indigo-300 transition-colors">
            Contact
          </Link>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-indigo-300 transition-colors">
            Twitter
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-indigo-300 transition-colors">
            Facebook
          </a>
        </div>
        <p className="text-xs">© 2025 IELTS LMS. All rights reserved.</p>
      </footer>

      {/* Tailwind Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default IELTSLandingPage;