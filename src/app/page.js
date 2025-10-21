"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import collabImage from "@/../public/LandingPage/Collab.png";
import blogImage from "@/../public/LandingPage/Blog.svg";
import Link from "next/link";
import { CodeIcon, StarIcon, MessageSquareIcon, PenIcon, UsersIcon, X } from "lucide-react";
import { LANDING_PAGE_TEXT } from "@/utils/text";
import { motion } from "framer-motion";

// === Animation Variants ===
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
opacity: 1,

    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: "easeInOut" },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.8, type: "spring", stiffness: 60 },
  },
};

const container = {
  hidden: {},
  visible: {
    opacity: 1, transition: { staggerChildren: 0.25 } },
};

// === Icons ===
const ICONS = {
  CodeIcon: <CodeIcon className="w-8 h-8 text-blue-500" />,
  StarIcon: <StarIcon className="w-8 h-8 text-blue-500" />,
  MessageSquareIcon: <MessageSquareIcon className="w-8 h-8 text-blue-500" />,
  PenIcon: <PenIcon className="w-8 h-8 text-blue-500" />,
  UsersIcon: <UsersIcon className="w-8 h-8 text-blue-500" />,
};

// === Page Component ===
export default function LandingPage() {
  return (
    <main className="bg-black text-white snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth scrollbar-hide">

      {/* === Hero Section === */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.6 }}
        className="snap-start h-screen flex flex-col items-center justify-center px-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-black to-black -z-10" />

        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl gap-10">
          <motion.div variants={slideLeft} className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-blue-400 tracking-tight leading-tight">
              {LANDING_PAGE_TEXT.HERO.TITLE}
            </h1>
            <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
              {LANDING_PAGE_TEXT.HERO.DESCRIPTION}
            </p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
                {LANDING_PAGE_TEXT.HERO.BUTTON_TEXT}
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={zoomIn} className="md:w-1/2 flex justify-center">
            <Image
              src={collabImage}
              alt={LANDING_PAGE_TEXT.IMAGE_ALT}
              width={500}
              height={400}
              priority
              className="rounded-lg w-[90%] sm:w-[80%] md:w-[500px] h-auto drop-shadow-lg"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* === Features Section === */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.6 }}
        className="snap-start h-screen flex flex-col justify-center items-center px-6"
      >
        <motion.h2 variants={fadeUp} className="text-4xl font-bold text-blue-400 mb-12 text-center">
          {LANDING_PAGE_TEXT.FEATURES_TITLE ?? "Core Features"}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl">
          {LANDING_PAGE_TEXT.FEATURES.map((feature) => (
            <motion.div
              key={feature.TITLE}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-b from-gray-900/40 to-gray-800/10 border border-gray-800 hover:border-blue-700/40 transition-all backdrop-blur-sm shadow-md hover:shadow-blue-900/20"
            >
              {ICONS[feature.ICON]}
              <h3 className="mt-4 text-xl font-semibold text-white">{feature.TITLE}</h3>
              <p className="mt-2 text-gray-400 text-base">{feature.DESCRIPTION}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* === How It Works Section === */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.6 }}
        className="snap-start h-screen flex flex-col justify-center px-6 bg-black/40"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-4xl font-bold text-blue-400 mb-24">
            {LANDING_PAGE_TEXT.HOW_IT_WORKS.TITLE}
          </motion.h2>

          <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ">
            {LANDING_PAGE_TEXT.HOW_IT_WORKS.STEPS.map((step, index) => (
              <motion.div
                key={index}
                variants={zoomIn}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-xl border border-gray-700 bg-black/40 backdrop-blur-md"
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-300">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* === Blogs Section === */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.6 }}
        className="snap-start h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-6 max-w-6xl mx-auto"
      >
        <motion.div variants={slideLeft} className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-blue-400 mb-6">
            {LANDING_PAGE_TEXT.BLOGS.TITLE}
          </h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {LANDING_PAGE_TEXT.BLOGS.DESCRIPTION}
          </p>
          <Link href="/blogs/community">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
              {LANDING_PAGE_TEXT.BLOGS.BUTTON_TEXT}
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={slideRight} className="md:w-1/2 flex justify-center">
          <Image
            src={blogImage}
            alt="Blog illustration"
            width={500}
            height={400}
            className="rounded-lg w-[90%] md:w-[500px] h-auto drop-shadow-lg"
          />
        </motion.div>
      </motion.section>

      {/* === Community Section === */}
      <motion.section
        variants={zoomIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.6 }}
        className="snap-start h-screen flex flex-col justify-center text-center px-6"
      >
        <h2 className="text-4xl font-bold text-blue-300 mb-6">
          {LANDING_PAGE_TEXT.COMMUNITY.TITLE}
        </h2>
        <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
          {LANDING_PAGE_TEXT.COMMUNITY.DESCRIPTION}
        </p>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
            {LANDING_PAGE_TEXT.COMMUNITY.BUTTON_TEXT}
          </Button>
        </Link>
      </motion.section>

      {/* === Footer === */}
      <footer className="snap-end h-[15vh] flex items-center justify-center text-gray-500 text-sm bg-black border-t border-gray-800">
        © {new Date().getFullYear()} ProjectBuddy — Built for collaboration.
      </footer>
    </main>
  );
}
