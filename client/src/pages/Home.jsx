import React from "react";
import { motion, useInView } from "framer-motion";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJob from "./LatestJob";
import Footer from "./Footer";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const AnimatedSection = ({ component: Component, delay }) => {
  const ref = React.useRef();
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, ease: "easeOut", delay: delay }}
    >
      <Component />
    </motion.div>
  );
};

const Home = () => {
  return (
    <div>
      <AnimatedSection component={HeroSection} delay={0.1} />
      <AnimatedSection component={CategoryCarousel} delay={0.1} />
      <AnimatedSection component={LatestJob} delay={0.1} />
      <Footer/>
    </div>
  );
};

export default Home;
