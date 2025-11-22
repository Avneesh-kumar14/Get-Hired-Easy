import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Send,
  Paperclip,
  Info,
  Clock,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  X,
  AlertTriangle,
  User,
  BellRing,
  FileWarning,
  CreditCard,
  File,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { POST_ISSUE_ROUTE } from "@/utils/constants";
import { useSelector } from "react-redux";

const MAX_FILES = 5;

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const ReportIssue = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [formData, setFormData] = useState({
    issueType: "",
    priority: "medium",
    title: "",
    description: "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    attachments: [],
  });

  const issueTypes = [
    { value: "technical", label: "Technical Issue", icon: AlertTriangle },
    { value: "account", label: "Account Problem", icon: User },
    { value: "application", label: "Job Application Issue", icon: FileText },
    { value: "posting", label: "Job Posting Problem", icon: FileWarning },
    { value: "payment", label: "Payment Issue", icon: CreditCard },
    { value: "other", label: "Other", icon: HelpCircle },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "text-green-500" },
    { value: "medium", label: "Medium", color: "text-yellow-500" },
    { value: "high", label: "High", color: "text-red-500" },
  ];

  // ... (keeping existing handlers)
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = formData.attachments.length + files.length;

    if (totalFiles <= MAX_FILES) {
      toast.success(
        `You have uploaded ${totalFiles}. You can only upload up to ${
          MAX_FILES - totalFiles
        } files more.`
      );
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key !== "attachments") {
        formDataToSend.append(key, formData[key]);
      }
    }
    if (formData?.attachments.length > 0) {
      formData.attachments.forEach((file) => {
        formDataToSend.append("attachments", file);
      });
    }
    try {
      const response = await apiClient.post(POST_ISSUE_ROUTE, formDataToSend, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowSuccess(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FileWarning className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      className="w-full mx-auto my-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full mx-auto space-y-8">
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Report an Issue
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We're here to help! Please provide details about the issue you're
            experiencing.
          </p>
        </motion.div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-green-50 dark:bg-green-900/50 border-green-500">
              <BellRing className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Your report has been successfully submitted. We'll get back to
                you soon!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Card className="dark:bg-gray-950/40 bg-white/50 duration-300">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants}
                >
                  <div className="space-y-2">
                    <Label>Issue Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("issueType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Priority</Label>
                    <RadioGroup
                      defaultValue={formData.priority}
                      onValueChange={(value) =>
                        handleInputChange("priority", value)
                      }
                      className="flex flex-wrap gap-6"
                    >
                      {priorityLevels.map((level) => (
                        <div
                          key={level.value}
                          className="flex items-center gap-3 rounded-lg hover:bg-gray-300 hover:dark:bg-gray-700 p-2"
                        >
                          <RadioGroupItem
                            value={level.value}
                            id={level.value}
                          />
                          <Label
                            htmlFor={level.value}
                            className={`${level.color} font-medium cursor-pointer`}
                          >
                            {level.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label>Issue Title</Label>
                  <Input
                    value={formData.title}
                    placeholder="Brief title of the issue"
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="transition-shadow duration-300 hover:shadow-md"
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    placeholder="Please provide detailed information about the issue"
                    rows={4}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="transition-shadow duration-300 hover:shadow-md"
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants}
                >
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        placeholder="your@email.com"
                        className="pl-10 transition-shadow duration-300 hover:shadow-md"
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        placeholder="Your phone number"
                        className="pl-10 transition-shadow duration-300 hover:shadow-md"
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <Label>Attachments (Optional)</Label>
                    <span className="text-sm dark:text-gray-100 text-gray-900">
                      {formData.attachments.length}/{MAX_FILES} files
                    </span>
                  </div>
                  <motion.div
                    className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 transition-colors duration-300 hover:border-blue-500 dark:hover:border-blue-400"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Paperclip className="h-12 w-12 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                            <span>Upload files</span>
                            <input
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleFileChange}
                              accept=".pdf,.png,.jpg,.jpeg"
                              disabled={
                                formData.attachments.length >= MAX_FILES
                              }
                            />
                          </label>
                          <span className="text-gray-500">
                            or drag and drop
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, PDF up to 10MB each (max {MAX_FILES} files)
                        </p>
                      </div>
                    </div>

                    {formData.attachments.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {formData.attachments.map((file, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                {getFileIcon(file.name)}
                                <span className="text-sm text-gray-700 dark:text-gray-200">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex justify-end pt-6"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="mr-2 h-4 w-4" />
                          Submit Report
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="dark:bg-gray-950/40 bg-white/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    value: "item-1",
                    trigger: "How long does it take to get a response?",
                    content:
                      "We typically respond to all issues within 24 hours. High-priority issues are handled more quickly, usually within 4 hours.",
                  },
                  {
                    value: "item-2",
                    trigger: "What information should I include?",
                    content:
                      "Please include as much detail as possible: steps to reproduce the issue, any error messages you see, and screenshots if applicable.",
                  },
                  {
                    value: "item-3",
                    trigger: "Can I track my report status?",
                    content:
                      "Yes! Once you submit a report, you'll receive a tracking number via email. You can use this to check the status on our support portal.",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.value}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <AccordionItem value={item.value}>
                      <AccordionTrigger>{item.trigger}</AccordionTrigger>
                      <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <motion.footer
          className="text-center text-sm text-gray-500 dark:text-gray-400"
          variants={itemVariants}
        >
          <p>
            By submitting this form, you agree to our{" "}
            <motion.a
              href="#"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Terms of Service
            </motion.a>{" "}
            and{" "}
            <motion.a
              href="#"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Privacy Policy
            </motion.a>
          </p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default ReportIssue;
