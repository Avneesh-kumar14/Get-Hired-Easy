import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Briefcase, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { LOGIN_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import OtpFlow from "./OtpLoginFlow";
import ForgotPasswordFlow from "./ForgotPasswordFlow";

const InputField = ({ icon: Icon, delay, ...props }) => (
  <motion.div
    className="relative mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
    <input
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all ease-in-out duration-150"
      {...props}
    />
  </motion.div>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [open, setOpen] = useState(false);
  const [openForgetPassword, setOpenForgetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }
    if (!formData.role) {
      toast.error("Please select your role (Student or Recruiter)");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiClient.post(LOGIN_ROUTE, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response?.data?.success) {
        dispatch(addUser(response.data.user));
        if (!response.data.user.isProfileComplete) {
          setShowProfileSetup(true);
        } else {
          if (response?.data?.user?.role === "student") navigate("/");
          else navigate("/admin/companies");
        }
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center mt-6 px-6 lg:px-8"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Login
          </h2>
        </motion.div>

        <motion.div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="py-8 px-4 shadow-lg bg-white/30 dark:bg-gray-950/30 rounded-lg sm:rounded-lg sm:px-10 ">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <InputField
                icon={Mail}
                name="email"
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                delay={0.1}
              />
              <InputField
                icon={Lock}
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                delay={0.2}
              />

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  id="role"
                  name="role"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all ease-in-out duration-150"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={!formData.email || !formData.password || !formData.role || isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/30 dark:bg-gray-950/30 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  type="button"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 dark:text-white bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-400 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all ease-in-out duration-150"
                  onClick={() => setOpen(true)}
                >
                  Login with OTP
                </Button>
              </motion.div>

              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div
                  onClick={() => setOpenForgetPassword(true)}
                  className="text-sm cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot your password?
                </div>
                <div className="text-sm">
                  <Link
                    to="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Sign up
                  </Link>
                </div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
      {open && <OtpFlow open={open} onOpenChange={setOpen} />}
      {openForgetPassword && (
        <ForgotPasswordFlow
          open={openForgetPassword}
          onOpenChange={setOpenForgetPassword}
        />
      )}
    </>
  );
};

export default Login;
