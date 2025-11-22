import React, { useState } from "react";
import OtpRequestPage from "./OtpRequestPage";
import OtpVerificationPage from "./OtpVerificationPage";
import ChangePasswordPage from "./ChangePassword";

const ForgotPasswordFlow = ({ open, onOpenChange }) => {
  const [step, setStep] = useState("otpRequest");
  const [formData, setFormData] = useState(null);

  const handleOtpSent = (data) => {
    setFormData(data);
    setStep("otpVerification");
  };

  const handleVerificationSuccess = () => {
    setStep("changePassword");
  };

  const handleBack = () => {
    setStep(step === "otpVerification" ? "otpRequest" : "otpVerification");
  };

  const handlePasswordChanged = () => {
    onOpenChange(false);
    setStep("otpRequest");
  };

  return (
    <>
      <OtpRequestPage
        open={open && step === "otpRequest"}
        onOpenChange={onOpenChange}
        onOtpSent={handleOtpSent}
        purpose="passwordReset"
      />
      <OtpVerificationPage
        open={open && step === "otpVerification"}
        onOpenChange={onOpenChange}
        onBack={handleBack}
        formData={formData}
        onVerificationSuccess={handleVerificationSuccess}
        purpose="passwordReset"
      />
      <ChangePasswordPage
        open={open && step === "changePassword"}
        onOpenChange={handlePasswordChanged}
        email={formData?.email}
      />
    </>
  );
};

export default ForgotPasswordFlow;