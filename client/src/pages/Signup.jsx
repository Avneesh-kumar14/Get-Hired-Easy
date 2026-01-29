import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Briefcase, Upload, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { SIGNUP_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";

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

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "file" && formData[key] === null) {
          continue; // Skip null file
        }
        formDataToSend.append(key, formData[key]);
      }

      const response = await apiClient.post(SIGNUP_ROUTE, formDataToSend, {
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(addUser(response.data.user));
        if(response?.data?.user?.role === 'student') navigate("/");
        else navigate('/admin/companies');
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      className="flex flex-col items-center lg:mt-6 md:mt-16 sm:mt-12 mt-8 px-6 lg:px-8"
      initial="hidden"
      animate="visible"
    >
      <motion.div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign Up
        </h2>
      </motion.div>

      <motion.div className="mt-6 bg-white/30 dark:bg-gray-950/30 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="py-8 px-4 shadow-lg rounded-lg sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              icon={User}
              name="fullName"
              type="text"
              required
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              delay={0.1}
            />
            <InputField
              icon={Mail}
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              delay={0.2}
            />
            <InputField
              icon={Phone}
              name="phoneNumber"
              type="tel"
              required
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              delay={0.3}
            />
            <InputField
              icon={Lock}
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              delay={0.4}
            />

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
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
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all ease-in-out duration-150"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Profile Picture
              </Button>
              <input
                id="fileInput"
                name="file"
                accept="image/*"
                type="file"
                onChange={handleChange}
                className="hidden"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all ease-in-out duration-150"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing up...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </motion.div>
            <motion.div
              className="flex items-center justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="text-sm">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Log in
                </Link>
              </div>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;