import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setAllSearchedJobs, setSearchedQuery } from "@/store/slices/jobSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderSearch } from "lucide-react";
import JobCard from "./JobCard";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col gap-2 items-center justify-center mb-8 rounded-lg p-8">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FolderSearch className="w-12 h-12 text-slate-400" />
    </motion.div>
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="text-xl font-semibold dark:text-slate-200 text-slate-500 text-center"
    >
      {message}
    </motion.h3>
  </div>
);

const JobsGrid = ({ jobsList }) => {
  if (!Array.isArray(jobsList) || jobsList.length === 0) {
    return <EmptyState message="No jobs found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {jobsList.map((job, index) => (
        <motion.div
          key={job?._id || index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <JobCard job={job} />
        </motion.div>
      ))}
    </div>
  );
};

const BrowseJobs = () => {
  useGetAllJobs(); 
  const dispatch = useDispatch();
  const { allSearchedJobs: jobs = [] } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isMounted = useRef(false);

  const appliedJobs = jobs?.filter((job) =>
    job?.applications?.some(
      (application) => application?.applicant === user?._id
    )
  ) || [];

  const availableJobs = jobs?.filter(
    (job) =>
      !job?.applications?.some(
        (application) => application?.applicant === user?._id
      )
  ) || [];

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    return () => {
      dispatch(setSearchedQuery(""));
      dispatch(setAllSearchedJobs([]));
    };
  }, [dispatch]);

  return (
    <div className="w-full mx-auto my-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Searched Results ({jobs?.length || 0})
      </motion.h1>
      
      <Tabs defaultValue="available" className="w-full">
        <div className="mb-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md px-6 py-2 text-sm font-medium transition-all"
            >
              Available ({availableJobs?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-6 py-2 text-sm font-medium transition-all"
            >
              Applied ({appliedJobs?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="mt-0">
          {availableJobs?.length === 0 ? (
            <EmptyState message="No available jobs found" />
          ) : (
            <JobsGrid jobsList={availableJobs} />
          )}
        </TabsContent>

        <TabsContent value="applied" className="mt-0">
          {appliedJobs?.length === 0 ? (
            <EmptyState message="You haven't applied to any jobs yet" />
          ) : (
            <JobsGrid jobsList={appliedJobs} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowseJobs;