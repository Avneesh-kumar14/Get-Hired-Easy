import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Github,
  Linkedin,
  User,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import { DUMMY_PROFILE_URL } from "@/utils/constants";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { useNavigate } from "react-router-dom";
import ImagePreviewModal from "./ImagePreviewModal";

const ProfileCard = ({ setOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  // console.log(user)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(document.getElementById("profile-card"));
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      id="profile-card"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <Card className="w-full mx-auto bg-white/30 dark:bg-gray-950/30 shadow-lg transition-all duration-500 hover:shadow-blue-200 dark:hover:shadow-blue-900 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <Avatar
              onClick={() => setIsImagePreviewOpen(true)}
              className="h-40 w-40 border-4 border-blue-500 dark:border-blue-400 shadow-xl"
            >
              <AvatarImage
                src={user.profile?.profilePicture || DUMMY_PROFILE_URL}
                alt={user.fullName}
              />
            </Avatar>
            <div className="text-center md:text-left flex-grow">
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {user?.fullName} (
                {user?.gender?.charAt(0).toUpperCase() +
                  user?.gender?.slice(1).toLowerCase()}
                )
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {user?.profile?.bio || "Add your information"}
              </motion.p>

              <div className="flex cursor-pointer flex-wrap gap-4 justify-center md:justify-start">
                <SocialLink
                  href={user?.social?.github}
                  icon={Github}
                  label="GitHub"
                />
                <SocialLink
                  href={user?.social?.linkedin}
                  icon={Linkedin}
                  label="LinkedIn"
                />
              </div>
            </div>
            <div className="ml-auto">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-400 hover:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-500 transition-all duration-300"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <InfoItem icon={Mail} label="Email" value={user?.email} />
              <InfoItem icon={Phone} label="Phone" value={user?.phoneNumber} />
            </div>
            {user?.profile?.skills?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {user?.profile?.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full transition-all duration-300 hover:shadow-md text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          {user?.profile?.resume && (
            <div className="mt-8 flex justify-center">
              <a
                href={user?.profile?.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full md:w-auto bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 rounded-full px-6 py-3 text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
              >
                <FileText className="mr-2 h-5 w-5" />
                {user?.profile?.resumeOriginalName || "View Resume"}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={user.profile?.profilePicture || DUMMY_PROFILE_URL}
        altText={user.fullName}
      />
    </motion.div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-gray-800 p-4 rounded-lg shadow-md">
    <Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
    <div>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {label}
      </span>
      <p className="text-gray-600 dark:text-gray-400">{value}</p>
    </div>
  </div>
);
const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
  >
    <Icon className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-300" />
    <span className="font-medium">{label}</span>
  </a>
);

const AppliedJobsTable = () => {
  const [expandedJob, setExpandedJob] = useState(null);
  useGetAppliedJobs();
  const { allAppliedJobs } = useSelector((store) => store.job);
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "rejected":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "pending":
      default:
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return (
          <CheckCircle className="h-5 w-5 mr-2 inline-block text-green-600 dark:text-green-400" />
        );
      case "rejected":
        return (
          <XCircle className="h-5 w-5 mr-2 inline-block text-red-600 dark:text-red-400" />
        );
      case "pending":
      default:
        return (
          <Clock className="h-5 w-5 mr-2 inline-block text-yellow-600 dark:text-yellow-400" />
        );
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const expandedRowVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { type: "spring", stiffness: 100, damping: 30 },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { type: "spring", stiffness: 100, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <Card className="mt-12 bg-white/30 dark:bg-gray-950/25 shadow-lg transition-all duration-300 hover:shadow-blue-200 dark:hover:shadow-blue-900 rounded-2xl overflow-hidden">
      <CardHeader>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Applied Jobs
        </h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Job Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {allAppliedJobs?.map((appliedJob, index) => (
                <React.Fragment key={index}>
                  <motion.tr
                    onClick={() =>
                      setExpandedJob(expandedJob === index ? null : index)
                    }
                    className="hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800/50 transition-colors duration-200"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(appliedJob.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {appliedJob?.job?.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {appliedJob?.job?.company?.name || "Unknown Company"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.span
                        className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                          appliedJob.status
                        )}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        {getStatusIcon(appliedJob.status)}
                        {appliedJob.status || "Pending"}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <motion.button
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ rotate: expandedJob === index ? 180 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 30,
                          }}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.div>
                      </motion.button>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedJob === index && (
                      <motion.tr
                        variants={expandedRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <td colSpan="5" className="px-6 py-4">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <motion.p
                              className="font-semibold"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              Description:
                            </motion.p>
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {appliedJob.job?.description ||
                                "No description available."}
                            </motion.p>
                            <motion.p
                              className="mt-2 font-semibold"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              Location:
                            </motion.p>
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              {appliedJob.job?.location || "Not specified"}
                            </motion.p>
                            <motion.p
                              className="mt-2 font-semibold"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              Website:
                            </motion.p>
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              {appliedJob.job?.company?.website ||
                                "Not available"}
                            </motion.p>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  if (!user) {
    return <div>Do Login...</div>;
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="w-full mx-auto my-12 space-y-12 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <ProfileCard setOpen={setOpen} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <AppliedJobsTable />
      </motion.div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </motion.div>
  );
};

export default Dashboard;
