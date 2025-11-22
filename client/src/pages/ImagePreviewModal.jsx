import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, altText }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex justify-center top-48 bg-black/60"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: -50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-xl shadow-2xl w-[90%] sm:w-[450px] md:w-[500px] overflow-hidden"
        >
          <div className="absolute top-2 right-2 z-[110]">
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-gray-800/60 text-white hover:bg-gray-800/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative aspect-square w-full">
            <motion.img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-cover"
              layoutId="preview-image"
            />
          </div>
          
          <div className="p-4 bg-white/90 dark:bg-gray-800/90 absolute bottom-0 w-full">
            <p className="text-center text-gray-800 dark:text-gray-200 font-medium truncate">
              {altText}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImagePreviewModal;