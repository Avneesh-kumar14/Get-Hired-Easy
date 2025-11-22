import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { apiClient } from "@/lib/apiClient";
import { VERIFICATION_OTP_ROUTE, REQUEST_OTP_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "@/store/slices/authSlice";

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

const OtpVerificationPage = ({
  open,
  onOpenChange,
  onBack,
  formData,
  onVerificationSuccess,
  purpose,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timer, isTimerActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post(
        VERIFICATION_OTP_ROUTE,
        {
          email: formData?.email,
          otp: otp,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        if (purpose === "login") {
          onVerificationSuccess(response.data)
        } else if (purpose === "passwordReset") {
          onVerificationSuccess(response.data);
        }
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await apiClient.post(
        REQUEST_OTP_ROUTE,
        { ...formData, purpose },
        { withCredentials: true }
      );
      if (response.data.success) {
        setTimer(30);
        setIsTimerActive(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsResending(false);
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
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"
            />
            <button
              onClick={onBack}
              className="absolute left-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
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
                <CheckCircle className="h-10 w-10 text-white" />
              </motion.div>
              <motion.h2
                {...slideIn}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Verify OTP
              </motion.h2>
              <motion.p
                {...slideIn}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Enter the 6-digit code sent to {formData?.email}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                {...slideIn}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="sm:w-12 sm:h-12 w-8 h-8 mr-1 text-2xl rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                      />
                      <InputOTPSlot
                        index={1}
                        className="sm:w-12 sm:h-12 w-8 h-8 mr-1 text-2xl rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                      />
                      <InputOTPSlot
                        index={2}
                        className="sm:w-12 sm:h-12 w-8 h-8 mr-1 text-2xl rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-2xl text-gray-400">
                      -
                    </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="sm:w-12 sm:h-12 w-8 h-8 mr-1 text-2xl rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                      />
                      <InputOTPSlot
                        index={4}
                        className="sm:w-12 sm:h-12 w-8 h-8 mr-1 text-2xl rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                      />
                      <InputOTPSlot
                        index={5}
                        className="sm:w-12 sm:h-12 w-8 h-8 text-2xl rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <motion.button
                  {...slideIn}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md"
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
                    <span>Verify OTP</span>
                  )}
                </motion.button>

                <motion.div
                  {...slideIn}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  {isTimerActive ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Resend OTP in {timer} seconds
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OtpVerificationPage;
