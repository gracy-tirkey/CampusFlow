import { motion } from "framer-motion";
import clsx from "clsx";

// Category-based gradient backgrounds
const categoryGradients = {
  stats: "bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-cyan-500/10",
  notes: "bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-pink-500/10",
  doubts: "bg-gradient-to-br from-orange-500/10 via-red-600/5 to-pink-500/10",
  quizzes:
    "bg-gradient-to-br from-green-500/10 via-emerald-600/5 to-teal-500/10",
  career:
    "bg-gradient-to-br from-indigo-500/10 via-purple-600/5 to-blue-500/10",
  community:
    "bg-gradient-to-br from-rose-500/10 via-pink-600/5 to-purple-500/10",
  default:
    "bg-gradient-to-br from-slate-500/10 via-slate-600/5 to-slate-700/10",
};

const categoryIconStyles = {
  stats: "text-blue-500 bg-blue-500/15",
  notes: "text-purple-500 bg-purple-500/15",
  doubts: "text-orange-500 bg-orange-500/15",
  quizzes: "text-emerald-500 bg-emerald-500/15",
  career: "text-indigo-500 bg-indigo-500/15",
  community: "text-pink-500 bg-pink-500/15",
  default: "text-primary bg-primary/15",
};

export const ModernCard = ({
  children,
  className = "",
  glass = true,
  elevated = false,
  hoverScale = true,
  animation = true,
  delay = 0,
  onClick,
  category = "default",
}) => {
  const gradientClass =
    categoryGradients[category] || categoryGradients.default;

  const baseClasses = clsx(
    "rounded-3xl p-6 transition-all duration-300 relative overflow-hidden",
    glass && "backdrop-blur-md bg-background/80 shadow-lg",
    !glass && "bg-surface shadow-md",
    elevated && "shadow-xl",
    hoverScale && "hover:scale-105 hover:shadow-xl",
    gradientClass,
    className,
  );

  if (!animation) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={baseClasses}
      onClick={onClick}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const StatsCard = ({
  icon: Icon,
  title,
  value,
  unit = "",
  trend = null,
  category = "stats",
}) => (
  <ModernCard category={category} className="min-w-60">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm text-text-muted opacity-75 mb-2">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold text-primary">{value}</h3>
          {unit && <span className="text-sm text-text-muted">{unit}</span>}
        </div>
      </div>
      {Icon && (
        <div
          className={clsx(
            "p-3 rounded-2xl",
            categoryIconStyles[category] || categoryIconStyles.default,
          )}
        >
          <Icon className="text-xl" />
        </div>
      )}
    </div>
    {trend && (
      <div
        className={clsx(
          "text-xs font-semibold",
          trend > 0 ? "text-green-600" : "text-red-600",
        )}
      >
        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% this week
      </div>
    )}
  </ModernCard>
);

export const ActionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  buttonText = "View",
  category = "default",
}) => (
  <ModernCard
    onClick={onClick}
    category={category}
    className="cursor-pointer hover:bg-surface-secondary"
  >
    <div className="flex items-start gap-4">
      {Icon && (
        <div
          className={clsx(
            "p-4 rounded-2xl flex-shrink-0",
            categoryIconStyles[category] || categoryIconStyles.default,
          )}
        >
          <Icon className="text-2xl" />
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
        <p className="text-sm text-text-secondary mb-3">{description}</p>
        <button className="text-primary text-sm font-semibold hover:underline">
          {buttonText} →
        </button>
      </div>
    </div>
  </ModernCard>
);

export const WelcomeCard = ({ name, streak = 0, nextEvent = null }) => (
  <ModernCard
    elevated
    className="bg-gradient-to-br from-primary/30 to-secondary/20 mb-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-3xl font-bold text-dark mb-2">
          Welcome back, {name}! 👋
        </h2>
        <p className="text-muted">Keep up your learning momentum today</p>
      </div>
      {streak > 0 && (
        <div className="bg-orange-500/20 px-4 py-2 rounded-full flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-xs text-muted">Streak</p>
            <p className="font-bold text-primary">{streak} days</p>
          </div>
        </div>
      )}
    </div>
    {nextEvent && (
      <div className="mt-4 p-3 bg-white/10 rounded-xl border border-primary/20">
        <p className="text-xs text-muted mb-1">Next Event</p>
        <p className="font-semibold text-dark">{nextEvent}</p>
      </div>
    )}
  </ModernCard>
);

export default ModernCard;
