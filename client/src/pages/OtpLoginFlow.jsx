import React, { useState } from "react";
import OtpRequestPage from "./OtpRequestPage";
import OtpVerificationPage from "./OtpVerificationPage";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "@/store/slices/authSlice";

const OtpLoginFlow = ({ open, onOpenChange }) => {
  const [step, setStep] = useState("otpRequest");
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOtpSent = (data) => {
    setFormData(data);
    setStep("otpVerification");
  };

  const handleVerificationSuccess = (data) => {
    dispatch(addUser(data.user));
    onOpenChange(false);
    if (data.user.role === "student") navigate("/");
    else navigate("/admin/companies");
  };
  const handleBack = () => {
    setStep("otpRequest");
  };

  return (
    <>
      <OtpRequestPage
        open={open && step === "otpRequest"}
        onOpenChange={onOpenChange}
        onOtpSent={handleOtpSent}
        purpose="login"
      />
      <OtpVerificationPage
        open={open && step === "otpVerification"}
        onOpenChange={onOpenChange}
        onBack={handleBack}
        formData={formData}
        onVerificationSuccess={handleVerificationSuccess}
        purpose="login"
      />
    </>
  );
};

export default OtpLoginFlow;