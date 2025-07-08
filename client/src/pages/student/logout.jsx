import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import Card from "../../components/card";
import { useAppDispatch } from "../../redux/store-config/store";
import { logout } from "../../redux/features/authSlice";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(10);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);


  

  // Handle the logout process
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate logout API call
    sessionStorage.removeItem("lastPath");
    dispatch(logout());    
    setTimeout(() => {
      // Clear user session
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      sessionStorage.clear();
      
      // Redirect to login page
      navigate("/login");
    }, 1500);
  };

  // Countdown timer for automatic logout
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1500);
      return () => clearTimeout(timer);
    } else {
      handleLogout();
    }
  }, [countdown]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
     
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <div className="p-6 md:p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              
              <h2 className="mt-3 text-xl font-semibold text-gray-900">
                {isLoggingOut ? "Logging out..." : "Ready to leave?"}
              </h2>
              
              <p className="mt-2 text-sm text-gray-600">
                {isLoggingOut 
                  ? "Please wait while we securely log you out..."
                  : `You'll be automatically logged out in ${countdown} seconds.`}
              </p>
              
              <div className="mt-6">
                {!isLoggingOut && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout Now
                  </button>
                )}
                
                {!isLoggingOut && (
                  <button
                    onClick={() => navigate(-1)}
                    className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
                
                {isLoggingOut && (
                  <div className="flex justify-center">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </main>
      </div>
      
    
    </div>
  );
};

export default Logout;