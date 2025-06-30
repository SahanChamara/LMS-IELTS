import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landingImage1 from '../images/landing-img1.jpg';
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
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-blue-300 via-blue-600 to-blue-950 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="text-white text-xl font-bold">IELTS Pro</div>
        <nav className="hidden md:flex space-x-8 text-white text-sm">
          <button onClick={() => handleNavigation('/about')} className="hover:text-blue-300 transition-colors">About Us</button>
          <button onClick={() => handleNavigation('/courses')} className="hover:text-blue-300 transition-colors">Courses</button>
          <button onClick={() => handleNavigation('/contact')} className="hover:text-blue-300 transition-colors">Contact</button>
        </nav>
        <button onClick={() => handleNavigation('/login')} className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-blue-200 hover:text-black transition-colors text-sm font-medium">
          Log In
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-between px-8 h-[calc(100vh-120px)]">
        {/* Left Side - Single Image */}
        <div className="flex-1 flex items-center justify-center">
            <div className="max-w-xl w-full h-[420px] bg-gray-300 rounded-xl overflow-hidden shadow-2xl">
                <img
                    src={landingImage1}
                    alt="Student studying"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
        <div className="flex-1 text-right pr-12">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            IELTS Pro
            <br />
            <span className="text-4xl font-normal text-blue-300">
              Simplest Path to Learning
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 max-w-lg ml-auto">
            Master IELTS with expert guidance and comprehensive practice materials. 
            Your journey to success starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-end gap-4 mb-8">
            <button 
              onClick={() => handleNavigation('/demo')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-200 hover:text-black transition-colors font-medium shadow-lg"
            >
              Join With Us
            </button>
            <button 
              onClick={() => handleNavigation('/courses')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-slate-800 transition-colors font-medium"
            >
              About Us
            </button>
          </div>

          
        </div>
      </main>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse"></div>
    </div>
  );
};

export default IELTSLandingPage;