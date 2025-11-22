import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2 } from "lucide-react";
import moment from "moment";
import { DUMMY_PROFILE_URL } from "@/utils/constants";

const CompanyCard = ({ company, onDelete }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white/40 dark:bg-gray-950/40 dark:text-gray-300 rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 transition-colors duration-300"
    >
      <div className="flex items-center space-x-4">
        <img
          src={company?.logo || DUMMY_PROFILE_URL }
          alt={company?.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{company?.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{moment(company?.createdAt).format("MMMM D, YYYY")}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/admin/companies/${company?._id}/details`)}
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition duration-300"
        >
          <Eye size={20} />
        </button>
        <button
          onClick={() => navigate(`/admin/companies/${company?._id}`)}
          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition duration-300"
        >
          <Edit2 size={20} />
        </button>
        <button
          onClick={() => onDelete(company?._id)}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition duration-300"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
