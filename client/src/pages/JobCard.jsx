import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase, IndianRupee, MapPin, Users } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DUMMY_PROFILE_URL } from "@/utils/constants";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatDateDifference = (createdAt) => {
    if (!createdAt) return "";
    const now = moment();
    const jobCreatedAt = moment(createdAt);
    const months = now.diff(jobCreatedAt, "months");
    jobCreatedAt.add(months, "months");
    const days = now.diff(jobCreatedAt, "days");
    return `${months > 0 ? `${months} Month${months > 1 ? "s" : ""} ` : ""}${
      days >= 0 ? `${days} Day${days > 1 ? "s" : ""} ` : ""
    }Ago`;
  };
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(prev => !prev);
  };

  return (
    <div className="relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-950/40 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {formatDateDifference(job?.createdAt)}
          </p>
          <Button
            onClick={handleBookmarkToggle}
            variant="outline"
            className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full ${
              isBookmarked 
                ? "bg-pink-500 dark:bg-pink-700" 
                : "dark:bg-gray-800 bg-gray-200"
            } hover:bg-gray-400 dark:hover:bg-gray-700`}
            size="icon"
          >
            <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${
              isBookmarked ? "text-white" : ""
            }`} />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-200 dark:border-gray-600">
            <AvatarImage src={job?.company?.logo || DUMMY_PROFILE_URL} />
          </Avatar>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {job?.company?.name}
            </h1>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{job?.location}</span>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            {job?.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-1 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
            {job?.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-4 sm:mb-6">
          <div className="flex items-center px-2 sm:px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">
              {job?.position} Positions
            </span>
          </div>
          <div className="flex items-center px-2 sm:px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/50 transition-colors duration-300">
            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">{job?.jobType}</span>
          </div>
          <div className="flex items-center px-2 sm:px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/50 transition-colors duration-300">
            <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">{job?.salary}</span>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
          <Button
            onClick={() => navigate(`/description/${job?._id}`)}
            variant="outline"
            className="text-sm h-9 sm:h-10 text-gray-800 dark:text-white border-gray-800 dark:border-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-1 xs:flex-none"
          >
            View Details
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-xl sm:rounded-2xl transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default JobCard;