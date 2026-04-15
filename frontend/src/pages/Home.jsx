import { motion, useScroll, useTransform } from "framer-motion";

import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBook,
  FaUsers,
  FaBrain,
  FaChartLine,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { ModernCard, ActionCard } from "../components/Card";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  const { user, loading } = useAuth();

  if (loading) return null;

  const features = [
    {
      icon: FaBook,
      title: "Smart Notes",
      description:
        "Upload, organize, and access your class notes anytime, anywhere",
    },
    {
      icon: FaBrain,
      title: "AI Study Guide",
      description: "Get personalized study roadmaps and exam preparation plans",
    },
    {
      icon: FaUsers,
      title: "Community",
      description: "Connect with mentors, alumni, and fellow students",
    },
    {
      icon: FaChartLine,
      title: "Progress Tracking",
      description: "Visualize your learning journey with detailed analytics",
    },
  ];

  const testimonials = [
    {
      name: "Priya Singh",
      role: "2nd Year CSE",
      text: "CampusFlow helped me organize my study material and track my progress. The AI suggestions are amazing!",
      avatar: "👩‍🎓",
    },
    {
      name: "Rahul Kumar",
      role: "Alumni - SDE at Google",
      text: "Great platform for connecting with juniors and helping them with guidance. Mentorship becomes so easy!",
      avatar: "👨‍💼",
    },
    {
      name: "Zara Patel",
      role: "1st Year SE",
      text: "The quiz feature and doubt boards are lifesavers. Got instant help from seniors!",
      avatar: "👩‍🎓",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div ref={ref} className="bg-background pt-0">
      {/* Navbar */}
      {user ? (
        <Navbar showLogo />
      ) : (
        <nav className="fixed top-0 w-full backdrop-blur-xl bg-glass border-b border-border z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* <img
                src="/images/logo-2.png"
                alt="CampusFlow Logo"
                className="h-8"
              /> */}
              <p className="sekuya-regular">cAMPUSFLOW</p>
              <span className="font-bold text-text-primary">CampusFlow</span>
            </div>

            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-primary font-semibold hover:text-primary-hover transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-text-primary rounded-full font-semibold hover:shadow-elevated transition-all hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Hero */}
      <motion.section
        style={{ opacity }}
        className="min-h-screen flex items-center justify-center px-6 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold text-text-primary mb-6"
          >
            Your Campus,
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Connected & Smarter
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-lg text-text-muted mb-8"
          >
            Notes. AI. Mentors. Growth. One platform to rule your academic life.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="flex gap-4 justify-center flex-wrap"
          >
            {!user ? (
              <>
                <Link
                  to="/register"
                  aria-label="Get Started"
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-text-primary rounded-full font-bold hover:scale-105 transition-all shadow-soft hover:shadow-elevated"
                >
                  Start Smart 🚀 <FaArrowRight />
                </Link>

                <button
                  onClick={() =>
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: "smooth",
                    })
                  }
                  className="px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-text-primary rounded-full transition-all"
                >
                  Explore
                </button>
              </>
            ) : (
              <Link
                to="/notes"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-text-primary rounded-full font-bold shadow-soft hover:shadow-elevated transition-all hover:scale-105"
              >
                Go to Dashboard <FaArrowRight />
              </Link>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-text-primary mb-4">
          Powerful Features Built for Students
        </h2>

        <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
          Everything you need to excel academically and grow your career.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={idx}
                viewport={{ once: true }}
              >
                <ModernCard className="text-center hover:scale-105 transition-all">
                  <div className="bg-primary/10 p-4 rounded-2xl mb-4 inline-block">
                    <Icon className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {feature.description}
                  </p>
                </ModernCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-text-primary mb-12">
          What Students Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={idx}
              viewport={{ once: true }}
            >
              <ModernCard className="hover:shadow-elevated transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{t.avatar}</span>
                  <div>
                    <h4 className="font-bold text-text-primary">{t.name}</h4>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>

                <p className="text-sm text-text-secondary italic">"{t.text}"</p>

                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-warning text-xs" />
                  ))}
                </div>
              </ModernCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      {!user && (
        <section className="py-20 text-center bg-background-secondary">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Start Your Smart Study Journey
          </h2>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary to-accent text-text-primary rounded-full font-bold hover:scale-105 transition-all shadow-soft hover:shadow-elevated"
          >
            Join Now <FaArrowRight />
          </Link>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
