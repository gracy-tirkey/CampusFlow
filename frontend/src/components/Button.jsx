/**
 * ✅ Reusable Button Component with theme support
 * Supports multiple variants, sizes, and states
 */

export default function Button({
  variant = "primary", // primary, secondary, outline, danger
  size = "md", // sm, md, lg
  children,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  // ✅ Base styles
  const baseStyles =
    "font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap";

  // ✅ Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // ✅ Color variants with dark mode support
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-dark hover:shadow-elevated dark:from-primary/80 dark:to-secondary/80 dark:hover:shadow-elevated focus:ring-primary/50",
    secondary:
      "bg-secondary text-dark hover:bg-secondary/90 dark:bg-secondary/20 dark:text-light dark:hover:bg-secondary/30 focus:ring-secondary/50",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary/80 dark:hover:bg-primary/20 focus:ring-primary/50",
    danger:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500/50",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
