import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Footer from "../../components/Footer";
import { useAppDispatch, useAppSelector } from "../../redux/store-config/store";
import { loginUserAPI } from "../../redux/features/authSlice";
import { getStudentDetailsAPI } from "../../redux/features/studentSlice";


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

  // Handle Form Submission
  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      // Login API
      const result = await dispatch(loginUserAPI(values)).unwrap();
      localStorage.setItem("user", result.data.user.id);
      localStorage.setItem("userRole", result.data.user.role);
      localStorage.setItem("userName", result.data.user.name);
      console.log("Login user Result ", result);

      console.log("after login authh state", isAuthenticated, data);
      
      if(result.data.user.role=="Student"){
        const userId = localStorage.getItem("user");
        dispatch(getStudentDetailsAPI(userId));
        console.log("hello")
      }
      if (result.success) {
        if (result.data.user.role === "Student") {
          navigate("/dashboard");
        } else if (result.data.user.role === "Instructor") {
          navigate("/dashboard/lecture");
        } else if (result.data.user.role === "SuperAdmin") {
          navigate("/dashboard/admin");
        }
      }
    } catch (error) {
      console.log(error);
      setErrors({ form: "Login failed. Please try again.", error });
    } finally {
      setSubmitting(false);
    }
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
        <div className="relative z-20 w-full max-w-md px-4">
          <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              IELTS PRO
            </h2>
            <p className="text-sm text-gray-300 mb-8 text-center">
              Access your learning journey
            </p>

            {/* Formik Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-xs mt-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-xs mt-2"
                    />
                  </div>

                  {errors.form && (
                    <div className="text-red-400 text-xs text-center">
                      {errors.form}
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400 shadow-lg text-base"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;