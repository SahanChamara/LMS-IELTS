import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LecSidebar from "./lecsidebar";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto mt-6">
          <div className="text-red-600 font-medium">
            Something went wrong: {this.state.error?.message || "Unknown error"}
          </div>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Lsettings = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Fetch instructor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) {
          setError("No authentication token found. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        
        const response = await axios.get("{{baseUrl}}auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setProfile({ 
          name: response.data.name || "", 
          email: response.data.email || "",
          ...(response.data.avatar && { avatar: response.data.avatar })
        });
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch profile");
        setTimeout(() => {
          if (err.response?.status === 401) {
            navigate("/login");
          }
        }, 2000);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await axios.put(
        "{{baseUrl}}auth/profile",
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile(prev => ({ ...prev, ...response.data }));
      setSuccess("Profile updated successfully!");
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || err.message || "Failed to update profile");
      setSuccess(null);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      setError("New passwords don't match");
      return;
    }
    
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      await axios.put(
        "{{baseUrl}}auth/change-password",
        { 
          currentPassword: password.current,
          newPassword: password.new 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess("Password changed successfully!");
      setError(null);
      setPassword({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.response?.data?.message || err.message || "Failed to change password");
      setSuccess(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-50">
        <LecSidebar onLogout={handleLogout} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
              <p className="text-gray-600 mt-2">Manage your profile and security settings</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "profile" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "password" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                  Password
                </button>
              </nav>
            </div>
            
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your personal details.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Ensure your account is using a strong password.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Current password
                        </label>
                        <div className="mt-1">
                          <input
                            id="current-password"
                            name="current"
                            type="password"
                            autoComplete="current-password"
                            value={password.current}
                            onChange={handlePasswordChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          New password
                        </label>
                        <div className="mt-1">
                          <input
                            id="new-password"
                            name="new"
                            type="password"
                            value={password.new}
                            onChange={handlePasswordChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirm new password
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirm-password"
                            name="confirm"
                            type="password"
                            value={password.confirm}
                            onChange={handlePasswordChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Lsettings;