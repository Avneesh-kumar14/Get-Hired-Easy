import React from "react";
import { motion } from "framer-motion";
import LatestJobTrends from "./LatestJobTrends";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FolderSearch } from "lucide-react";

const LatestJob = () => {
  useGetAllJobs();
  const navigate = useNavigate();
  const { jobs } = useSelector((store) => store.job);
  if (!jobs)
    return (
      <div className="flex flex-col gap-2 items-center justify-center mb-8 rounded-lg">
        <FolderSearch className="w-8 h-8 text-slate-400" />
        <h3 className="text-xl font-semibold dark:text-slate-200 text-slate-500">
          No Jobs Found
        </h3>
      </div>
    );
  return (
    <div className="mt-20 mb-10 mx-auto w-full">
      <h1 className="text-4xl font-bold dark:text-white">
        <span className="text-purple-500 dark:text-purple-400">Latest</span> &{" "}
        <span className="text-purple-500 dark:text-purple-400">Top </span>Job
        Openings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 my-5">
        {jobs.slice(0, 6).map((job, index) => (
          <motion.div
            onClick={() => navigate(`/description/${job._id}`)}
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <LatestJobTrends job={job} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LatestJob;
