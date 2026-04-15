import { motion } from "framer-motion";
import {
  FaBook,
  FaFire,
  FaCheckCircle,
  FaCalendarAlt,
  FaBrain,
} from "react-icons/fa";
import { ModernCard, StatsCard, ActionCard, WelcomeCard } from "./Card";

export default function HeroDashboard() {
  // Mock data - replace with real data from API
  const userData = {
    name: "John",
    streak: 7,
    nextEvent: "Quiz - Data Structures (Tomorrow 2 PM)",
  };

  const stats = [
    {
      icon: FaBook,
      title: "Notes Created",
      value: 24,
      unit: "notes",
      trend: 12,
    },
    {
      icon: FaFire,
      title: "Study Streak",
      value: 7,
      unit: "days",
      trend: 50,
    },
    {
      icon: FaCheckCircle,
      title: "Tasks Completed",
      value: 18,
      unit: "this week",
      trend: 25,
    },
    {
      icon: FaBrain,
      title: "Topics Learned",
      value: 12,
      unit: "mastered",
      trend: 8,
    },
  ];

  const pendingTasks = [
    {
      icon: FaCalendarAlt,
      title: "DSA Quiz",
      description: "Complete the Data Structures quiz",
      deadline: "Tomorrow",
    },
    {
      icon: FaBook,
      title: "Chapter 5 Notes",
      description: "Upload notes for Chapter 5",
      deadline: "In 3 days",
    },
    {
      icon: FaCheckCircle,
      title: "Assignment Submission",
      description: "Submit final project report",
      deadline: "In 5 days",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <WelcomeCard
        name={userData.name}
        streak={userData.streak}
        nextEvent={userData.nextEvent}
      />

      {/* Stats Grid */}
      <div>
        <h3 className="text-lg font-bold text-dark mb-4">Your Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatsCard
              key={idx}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              trend={stat.trend}
              category={
                stat.title.includes("Notes")
                  ? "notes"
                  : stat.title.includes("Streak")
                    ? "community"
                    : stat.title.includes("Tasks")
                      ? "career"
                      : "stats"
              }
            />
          ))}
        </div>
      </div>

      {/* AI Recommendation & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Recommendation Card */}
        <ModernCard
          elevated
          className="md:col-span-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <h4 className="font-bold text-dark">AI Suggestion</h4>
            </div>
            <p className="text-sm text-muted mb-4">
              You've been strong on DSA. Time to focus on System Design!
            </p>
          </div>
          <button className="w-full bg-gradient-to-r from-primary to-secondary text-dark font-semibold py-2 rounded-lg hover:shadow-elevated transition-all">
            Start Learning
          </button>
        </ModernCard>

        {/* Quick Actions */}
        <ActionCard
          icon={FaBook}
          title="Upload Notes"
          description="Share your class notes"
          buttonText="Upload"
          category="notes"
        />
        <ActionCard
          icon={FaBrain}
          title="AI Study Guide"
          description="Get personalized study plan"
          buttonText="Generate"
          category="career"
        />
      </div>

      {/* Pending Tasks */}
      <div>
        <h3 className="text-lg font-bold text-dark mb-4">Pending Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingTasks.map((task, idx) => (
            <ModernCard
              key={idx}
              delay={idx * 0.1}
              className="hover:border-primary/50 border border-secondary/30"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-primary/20 p-3 rounded-xl flex-shrink-0">
                  <task.icon className="text-primary text-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark">{task.title}</h4>
                  <p className="text-xs text-muted">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-secondary/30">
                <span className="text-xs text-muted font-medium">
                  {task.deadline}
                </span>
                <button className="text-primary text-xs font-semibold hover:underline">
                  View →
                </button>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
