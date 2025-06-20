import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../redux/store-config/store";
import {
  loginUserAPI,} from "../redux/features/authSlice";


const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, data, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  console.log("logging page auth data", data);
  

  const navigate = useNavigate();

  console.log("auth state", isAuthenticated, data);
  

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial Values for Formik
  const initialValues = {
    email: "",
    password: "",
  };

/*   useEffect(() => {
    //if alreadyautheitcated..redirect to dashboard
    if(isAuthenticated){
      navigate("/dashboard");
    }
  },[]); */

  // Handle Form Submission
  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      // Login API
      const result = await dispatch(loginUserAPI(values)).unwrap();
      localStorage.setItem("user", result.data.user.id)
      localStorage.setItem("userRole", result.data.user.role)
      localStorage.setItem("userName", result.data.user.name)
      console.log("Login user Result ", result);

      console.log("after login authh state", isAuthenticated, data);
      

        if (result.success) {
        if(result.data.user.role == "Student"){
          navigate("/dashboard");
        }else if(result.data.user.role == "Instructor"){
          navigate("/courses");
        }else if(result.data.user.role == "SuperAdmin"){
          navigate("/courses ");
        }
      }
    } catch (error) {
      console.log(error);
      
      setErrors({ form: "Login failed. Please try again.", error });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLectureNavigation = () => {
    navigate("/lecturepages/lecturedashboard");
  };

  const handleAdminNavigation = () => {
    navigate("/Admindashboard");
  };

  return (
    <div className="font-sans">
      <main className="relative min-h-screen flex items-center justify-center bg-neutral-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('src/images/G-img.jpg')` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

        {/* Login Card */}
        <div className="relative z-20 w-full lg:w-1/2 flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-95">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to University
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Login to access your account
            </p>

            {/* Formik Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {errors.form && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.form}
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-xs text-gray-400">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
              onClick={() => alert("Google login not implemented yet")}
            >
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Create one
                </a>
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;