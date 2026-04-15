/**
 * ✅ Reusable Badge Component with theme support
 */

export default function Badge({
  children,
  variant = "primary", // primary, secondary, success, warning, danger
  size = "md", // sm, md, lg
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap transition-colors duration-200";

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantStyles = {
    primary:
      "bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary/90",
    secondary:
      "bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary/90",
    success:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
