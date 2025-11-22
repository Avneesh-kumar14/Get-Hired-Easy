import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  IndianRupee,
  Loader2,
  Clock,
  Globe,
  CheckCircle2,
  Calendar as CalendarIcon,
  Trophy,
  Timer,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "@/lib/apiClient";
import moment from "moment";
import { toast } from "sonner";
import { setSingleJob } from "@/store/slices/jobSlice";
import {
  APPLY_JOB_ROUTE,
  DUMMY_PROFILE_URL,
  GET_SINGLE_JOB_ROUTE,
  WITHDRAW_JOB_ROUTE,
} from "@/utils/constants";
import ApplicationStatus from "./ApplicationStatus";

const JobDescription = () => {
  const { jobId } = useParams();
  const { user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const userApplication =
    singleJob?.applications?.find(
      (application) => application?.applicant === user?._id
    ) || null;
  const dispatch = useDispatch();

  useEffect(() => {
    const getSingleJob = async () => {
      try {
        const response = await apiClient.get(
          `${GET_SINGLE_JOB_ROUTE}/${jobId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setSingleJob(response.data.job));
          setIsApplied(
            response.data.job.applications?.some(
              (id) => id?.applicant === user?._id
            )
          );
        }
      } catch (error) {
        toast.error("Error fetching job details");
      }
    };
    if (jobId) {
      getSingleJob();
    }
  }, [jobId, dispatch, user?._id]);
  const handleLocationClick = (location) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };
  const handleApply = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        `${APPLY_JOB_ROUTE}/${singleJob._id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setIsApplied(true);
        const updatedJobDescription = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedJobDescription));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        `${WITHDRAW_JOB_ROUTE}/${singleJob._id}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response)
      if (response.data.success) {
        setIsApplied(false);
        const updatedApplications = singleJob.applications.filter(
          (app) => app.applicant !== user?._id
        );
        const updatedJobDescription = {
          ...singleJob,
          applications: updatedApplications,
        };
        dispatch(setSingleJob(updatedJobDescription));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!singleJob) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const daysUntilExpiry = moment(singleJob.expiryDate).diff(moment(), "days");
  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Company Header Card */}
        <Card className="mb-8 overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={singleJob.company?.logo || DUMMY_PROFILE_URL}
                  alt={singleJob.company?.name || "Company Logo"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl text-center md:text-left font-bold text-gray-900 dark:text-white">
                  {singleJob.company?.name || "Company Name"}
                </h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  {singleJob.company?.website && (
                    <a
                      href={singleJob.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:underline dark:text-gray-400 dark:hover:text-violet-400"
                    >
                      <Globe className="w-4 h-4 mr-1 text-violet-500 " />
                      Website
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      singleJob.location
                    )}`}
                    target="_blank"
                    className="flex line-clamp-1 items-center text-sm text-gray-600 hover:underline dark:text-gray-400 dark:hover:text-violet-400"
                  >
                    <MapPin className="w-4 h-4 mr-1 text-violet-500" />
                    View Location
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Job Details Card */}
        <Card className="overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
          <CardHeader className="space-y-6 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    {singleJob.title}
                  </CardTitle>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge
                      variant="secondary"
                      className="text-violet-600 px-4 py-2 dark:text-violet-400"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {singleJob.position} Openings
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-pink-600 px-4 py-2 dark:text-pink-400"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {singleJob.jobType}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-green-600 px-4 py-2 dark:text-green-400"
                    >
                      <IndianRupee className="w-3 h-3 mr-1" />₹
                      {singleJob.salary.toLocaleString()}/year
                    </Badge>
                    {daysUntilExpiry > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-orange-600 px-4 py-2 dark:text-orange-400"
                      >
                        <Timer className="w-3 h-3 mr-1" />
                        {daysUntilExpiry} days left
                      </Badge>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <Button
                  onClick={isApplied ? handleWithdraw : handleApply}
                  disabled={isLoading}
                  className={`${
                    isApplied
                      ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                      : "bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
                  } text-white font-semibold py-6 px-8 rounded-full transition-all duration-300 text-lg min-w-[180px]`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {isApplied ? "Withdrawing..." : "Applying..."}
                    </div>
                  ) : (
                    <>{isApplied ? "Withdraw Application" : "Apply Now"}</>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-0">
            <Separator className="my-3" />

            {/* Key Information Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <MapPin className="w-10 h-10 text-violet-500 p-2 bg-violet-100 dark:bg-violet-900 rounded-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {singleJob.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <Trophy className="w-10 h-10 text-violet-500 p-2 bg-violet-100 dark:bg-violet-900 rounded-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Experience Required
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {singleJob.experienceLevel}+ years
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <CalendarIcon className="w-10 h-10 text-violet-500 p-2 bg-violet-100 dark:bg-violet-900 rounded-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Apply Before
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {moment(singleJob.expiryDate).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <Calendar className="w-10 h-10 text-violet-500 p-2 bg-violet-100 dark:bg-violet-900 rounded-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posted Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {moment(singleJob.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <DollarSign className="w-10 h-10 text-violet-500 p-2 bg-violet-100 dark:bg-violet-900 rounded-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Annual Package
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ₹{singleJob.salary.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Job Description Section */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Job Description
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {singleJob.description}
                  </p>
                </div>
              </div>

              {/* Requirements Section */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Requirements
                </h2>
                <div className="flex md:gap-3 gap-4 items-center flex-wrap">
                  {singleJob.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
                      <span className="text-gray-600 hover:text-white hover:bg-violet-500 px-[6px] py-[2px] rounded-lg hover:dark:bg-violet-700 dark:text-gray-300">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Application Status */}
              <ApplicationStatus
                isApplied={isApplied}
                userApplication={userApplication}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobDescription;
