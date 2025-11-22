import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ApplicationStatus = ({ isApplied, userApplication }) => {
  if (!isApplied) return null;

  const getStatusConfig = () => {
    if (!userApplication) {
      return {
        icon: Clock,
        title: "Application Submitted",
        description: "Your application has been submitted and is under review.",
        variant: "info",
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-900 dark:text-blue-100"
      };
    }

    switch (userApplication.status) {
      case "accepted":
        return {
          icon: CheckCircle2,
          title: "Application Accepted",
          description: "Congratulations! Your application has been accepted.",
          variant: "success",
          iconColor: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-900 dark:text-green-100"
        };
      case "rejected":
        return {
          icon: XCircle,
          title: "Application Not Accepted",
          description: "We regret to inform you that your application was not accepted at this time.",
          variant: "error",
          iconColor: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-900 dark:text-red-100"
        };
      default:
        return {
          icon: AlertCircle,
          title: "Application Under Review",
          description: "Our team is carefully reviewing your application.",
          variant: "warning",
          iconColor: "text-yellow-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-900 dark:text-yellow-100"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="mt-8 animate-fade-in">
      <Alert 
        className={`
          ${config.bgColor}
          border-2 
          ${config.borderColor}
          shadow-lg 
          transition-all 
          duration-300 
          hover:shadow-xl
        `}
      >
        <div className="flex items-start gap-4">
          <Icon className={`w-6 h-6 ${config.iconColor} mt-1`} />
          <div className="flex-1">
            <AlertTitle className={`text-lg font-semibold mb-1 ${config.textColor}`}>
              {config.title}
            </AlertTitle>
            <AlertDescription className={`${config.textColor} opacity-90`}>
              {config.description}
            </AlertDescription>
          </div>
        </div>
        
        {userApplication?.status === "accepted" && (
          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                Next steps and additional information will be sent to your email
              </span>
            </div>
          </div>
        )}
      </Alert>
    </div>
  );
};

export default ApplicationStatus;