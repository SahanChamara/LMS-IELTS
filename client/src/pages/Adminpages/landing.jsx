import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landingImage1 from '../../images/landing-img1.jpg';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const IELTSLandingPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    console.log('Sign-up email:', email);
    setEmail('');
    setError('');
    alert('Thank you for signing up!');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-blue-200 via-blue-600 to-blue-950 relative flex flex-col">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-between px-8 h-[calc(100vh-128px-80px)] flex-1">
        {/* Left Side - Single Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-xl w-full h-[300px] bg-gray-300 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={landingImage1}
              alt="Student studying"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 text-right pr-8">
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            LMS Pro
            <br />
            <span className="text-3xl font-normal text-blue-300">
              Simplest Path to Learning
            </span>
          </h1>
          
          <p className="text-gray-300 text-base mb-6 max-w-md ml-auto">
            Master IELTS with expert guidance and practice materials. Start your journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-end gap-4">
            <button 
              onClick={() => handleNavigation('/demo')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-200 hover:text-black transition-colors font-medium shadow-lg"
              aria-label="Join With Us"
            >
              Join With Us
            </button>
            <button 
              onClick={() => handleNavigation('/login')} 
              className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-slate-800 transition-colors font-medium"
              aria-label="Log In"
            >
              Log In
            </button>
          </div>          
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-blue-950 text-white py-4 px-6" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Explore</h3>
              <ul className="space-y-0.5">
                <li>
                  <button 
                    onClick={() => handleNavigation('/about')} 
                    className="text-gray-300 hover:text-blue-300 transition-colors text-[10px]"
                    aria-label="About Us"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/courses')} 
                    className="text-gray-300 hover:text-blue-300 transition-colors text-[10px]"
                    aria-label="Courses"
                  >
                    Courses
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/contact')} 
                    className="text-gray-300 hover:text-blue-300 transition-colors text-[10px]"
                    aria-label="Contact"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Resources</h3>
              <ul className="space-y-0.5">
                <li>
                  <button 
                    onClick={() => handleNavigation('/blog')} 
                    className="text-gray-300 hover:text-blue-300 transition-colors text-[10px]"
                    aria-label="Blog"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/faqs')} 
                    className="text-gray-300 hover:text-blue-300 transition-colors text-[10px]"
                    aria-label="FAQs"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/privacy')} 
                    className="text-gray-300 hover:text-blue-300 transition-colors text-[10px]"
                    aria-label="Privacy Policy"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Follow Us</h3>
              <ul className="flex space-x-3">
                <li>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-blue-300 transition-colors"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-blue-300 transition-colors"
                    aria-label="Follow us on LinkedIn"
                  >
                    <Linkedin className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-blue-300 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-2 max-w-[160px]">
              <h3 className="text-sm font-semibold text-white">Stay Updated</h3>
              <p className="text-gray-300 text-[10px]">
                Get IELTS tips and updates.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-1.5 bg-transparent border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10px]"
                  aria-label="Email for newsletter"
                />
                {error && (
                  <p className="text-red-400 text-[10px]">{error}</p>
                )}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-200 hover:text-black transition-colors font-medium"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 pt-4 border-t border-white/20 text-center">
            <p className="text-gray-300 text-[10px]">
              © {new Date().getFullYear()} LMS Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse"></div>
    </div>
  );
};

export default IELTSLandingPage;