import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@chakra-ui/react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { HANDLE_DELETE_ACCOUNT_ROUTE } from '@/utils/constants';
import { deleteUser } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = ({ isOpen, onOpenChange }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {user}=useSelector(store=>store.auth)
  const handleDelete = async () => {
    if (confirmText !== user.fullName) return;
    setIsLoading(true);
    try {
        const response=await apiClient.delete(HANDLE_DELETE_ACCOUNT_ROUTE,{withCredentials:true});
        if(response.data.success){
            dispatch(deleteUser());
            navigate("/home");
            toast.success(response.data.message);
        }
        onOpenChange(false);
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally{
        setIsLoading(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6"
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
          >
            <Button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
              </motion.div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Delete Account
              </h2>
              
              <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900/50">
                <AlertDescription className="text-sm text-gray-600 dark:text-gray-300">
                  This action cannot be undone. Your account and all associated data will be permanently deleted.
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left mb-2">
                  Type "{user?.fullName}" to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-700"
                  placeholder="delete my account"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white 
                         dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md
                         hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={confirmText !== user?.fullName || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                         dark:bg-red-700 rounded-md hover:bg-red-700 
                         dark:hover:bg-red-800 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-red-500 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Deleting...
                  </div>
                ) : (
                  'Delete Account'
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccount;