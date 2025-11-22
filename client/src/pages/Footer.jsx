import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Github,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      className="relative dark:bg-gray-950/40 bg-white/40 py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 ">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Company Description */}
          <motion.div
            variants={childVariants}
            className="flex-1 min-w-[280px] max-w-sm"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Job Hunt
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Connecting talented professionals with their dream careers. Let's
              build your future together.
            </p>
          </motion.div>

          {/* Contact Grid */}
          <motion.div
            variants={childVariants}
            className="flex-1 min-w-[280px] max-w-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-20 sm:gap-12 gap-4">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                  Contact
                </h3>
                <div className="space-y-2">
                  <a
                    target="_blank"
                    href="mailto:gethiredeasy@gmail.com"
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <Mail size={14} className="mr-2 flex-shrink-0" />
                    <span>gethiredeasy@gmail.com</span>
                  </a>

                  <a
                    href="tel:+91 8840638243"
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <Phone size={14} className="mr-2 flex-shrink-0" />
                    <span>+91 XYZ1272727</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      icon: Facebook,
                      label: "Facebook",
                      link: "https://www.facebook.com/profile.php?id=61567878846355",
                    },
                    {
                      icon: Github,
                      label: "Github",
                      link: "https://github.com/Abhi7102004",
                    },
                    {
                      icon: Linkedin,
                      label: "LinkedIn",
                      link: "https://www.linkedin.com/in/abhishek-yadav-341245258/",
                    },
                  ].map((social, index) => (
                    <a
                      target="_blank"
                      key={index}
                      href={social?.link}
                      aria-label={social.label}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 
                               hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500/80 
                               transform transition-all duration-200 hover:scale-105"
                    >
                      <social.icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={childVariants}
          className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Job Hunt. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
