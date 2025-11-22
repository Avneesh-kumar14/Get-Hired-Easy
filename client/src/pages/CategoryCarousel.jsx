import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/store/slices/jobSlice";

const categories = [
  "Frontend ",
  "Backend ",
  "Data Science",
  "Graphic Designer",
  "FullStack ",
  "Testing ",
];

const CategoryCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nextCategory = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % categories.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevCategory = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + categories.length) % categories.length
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCategorySearch = (activeIndex) => {
    dispatch(setSearchedQuery(categories[activeIndex]));
    navigate("/browse");
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-[2px] bg-white dark:bg-gray-800 rounded-2xl z-10"></div>

        {/* Content */}
        <div className="relative z-20 flex items-center justify-between p-6">
          <motion.button
            aria-label="Previous Category"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            onClick={prevCategory}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.button
              onClick={() => handleCategorySearch(activeIndex)}
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 text-center px-4 py-2 rounded-lg transition-all "
            >
              <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                {categories[activeIndex]}
              </h3>
            </motion.button>
          </AnimatePresence>

          <motion.button
            aria-label="Next Category"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            onClick={nextCategory}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400"
          initial={{ width: "0%" }}
          animate={{
            width: `${((activeIndex + 1) / categories.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

export default CategoryCarousel;
