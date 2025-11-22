import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { deleteUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logout = ({ open, onOpenChange }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [isLoading,setIsLoading]=useState(false)
  const handleLogout = async () => {
    setIsLoading(false)
    try {
      const response = await apiClient.delete(LOGOUT_ROUTE, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(deleteUser());
        navigate('/home')
        toast.success(response.data.message);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      setIsLoading(true)
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <LogOut className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Are you sure you want to logout?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You will be logged out of your account and redirected to the home page.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Logout;