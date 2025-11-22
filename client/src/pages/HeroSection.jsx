import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/store/slices/jobSlice";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, Award, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const handleSearch = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const features = [
    { icon: <Briefcase size={24} />, text: "10,000+ Job Listings" },
    { icon: <Award size={24} />, text: "Top Companies" },
    { icon: <TrendingUp size={24} />, text: "Career Growth" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-8 py-20 px-6"
    >
      <motion.div className="text-center">
        <span className="relative inline-block mb-6">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-sm opacity-90 rounded-full"></span>
          <span className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base md:text-lg font-bold px-8 py-3 rounded-full inline-block shadow-lg transition-transform duration-300 transform">
            Discover Your Career Path
          </span>
        </span>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          <span className="dark:text-white text-gray-700 [text-shadow:_0_3px_6px_rgba(0,0,0,0.2),_0_0_10px_rgb(217,70,239)]">
            Find Your{" "}
          </span>
          <span className="dark:text-white text-gray-700 [text-shadow:_0_3px_6px_rgba(0,0,0,0.2),_0_0_10px_rgb(217,70,239)]">
            Dream Job{" "}
          </span>
          <span className="dark:text-white text-gray-700 [text-shadow:_0_3px_6px_rgba(0,0,0,0.2),_0_0_10px_rgb(217,70,239)]">
            Today
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto [text-shadow:_1px_1px_1px_rgb(0_0_0_/_10%)]">
          Connect with top employers and unlock exciting opportunities that
          match your skills and aspirations.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden">
            <input
              type="text"
              spellCheck="false"
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-transparent px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-700 transition-all duration-300 bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-300 text-lg"
              placeholder="Search for job titles, companies, or keywords..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Search size={18} />
              <span className="font-semibold ml-2 sm:ml-3 lg:ml-4 text-sm sm:text-base lg:text-lg sm:block hidden">
                Search
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-6 mt-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg transition-all duration-300">
              <span className="text-purple-600 dark:text-purple-400 mr-2">
                {feature.icon}
              </span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {feature.text}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-16 text-center">
  {/* Heading text styling with improved contrast */}
  <p className="relative inline-block text-gray-700 dark:text-gray-200 mb-6 text-lg md:text-xl font-semibold tracking-wide">
    {/* Background highlight with smoother opacity */}
    <span className="absolute inset-0 bg-gray-200 dark:bg-gray-700 blur-sm opacity-20 rounded-md"></span>
    <span className="relative">Trusted by leading companies worldwide</span>
  </p>

  <div className="flex flex-wrap justify-center gap-8">
    {["Google", "Amazon", "Microsoft", "Apple", "Facebook"].map(
      (company, index) => (
        <motion.span
          key={index}
          whileHover={{ scale: 1.08, color: "#9333ea" }}
          className="relative inline-block text-gray-500 dark:text-gray-400 font-semibold text-lg md:text-xl transition-all duration-300"
        >
          <span className="absolute inset-0 bg-gray-300 dark:bg-gray-800 blur-sm opacity-20 rounded-md"></span>
          <span className="relative">{company}</span>
        </motion.span>
      )
    )}
  </div>
</motion.div>

    </motion.div>
  );
};

export default HeroSection;
