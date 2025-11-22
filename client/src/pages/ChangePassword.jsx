import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Check } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
// import { CHANGE_PASSWORD_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { CHANGE_PASSWORD_ROUTE } from "@/utils/constants";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const slideIn = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

const ChangePasswordPage = ({ open, onOpenChange, email }) => {
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.post(CHANGE_PASSWORD_ROUTE, {
        email,
        newPassword: passwords.password,
      });
      if (response.data.success) {
        toast.success("Password changed successfully!");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...fadeIn}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500"
            />
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Lock className="h-10 w-10 text-white" />
              </motion.div>
              <motion.h2
                {...slideIn}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Change Password
              </motion.h2>
              <motion.p
                {...slideIn}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Enter your new password below
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div {...slideIn} transition={{ delay: 0.5 }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={passwords.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                    placeholder="Enter new password"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </motion.div>

              <motion.div {...slideIn} transition={{ delay: 0.6 }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                    placeholder="Confirm new password"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </motion.div>

              <motion.button
                {...slideIn}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Change Password</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordPage;