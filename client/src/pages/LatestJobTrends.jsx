import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, MapPin, Users } from "lucide-react";

const LatestJobTrends = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative overflow-hidden p-6 rounded-2xl bg-gray-100 dark:bg-gray-950/50 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Company and Location */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {job?.company?.name}
            </h1>
            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-2">{job?.location}</span>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <Badge className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full whitespace-nowrap group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors duration-300">
              {job?.jobType}
            </Badge>
          </div>
        </div>

        {/* Job Title and Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            {job?.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
            {job?.description}
          </p>
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
            <Users className="w-4 h-4 mr-2" />
            <span>{job?.position} Positions</span>
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/50 transition-colors duration-300">
            <IndianRupee className="w-4 h-4 mr-2" />
            <span>{job?.salary}</span>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default LatestJobTrends;
