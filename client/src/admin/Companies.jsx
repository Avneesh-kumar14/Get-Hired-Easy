import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CompaniesTable from "./CompaniesTable";

const Companies = () => {
  const navigate = useNavigate();
  const [searchedText, setSearchedText] = useState("");

  return (
    <div className="transition-colors duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col  sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Companies
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage and monitor all your registered companies
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/companies/create")}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg shadow-sm transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Add Company</span>
            </motion.button>
          </div>
          <div className="relative mb-8 backdrop-blur-sm shadow-lg transition-all duration-300">
            <input
              type="text"
              placeholder="Search companies by name..."
              value={searchedText}
              onChange={(e) => setSearchedText(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/30 dark:bg-gray-950/30 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
          </div>

          <CompaniesTable searchedText={searchedText} />
        </motion.div>
      </div>
    </div>
  );
};

export default Companies;
