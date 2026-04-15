/**
 * ✅ Reusable Input Component with theme support
 * Supports text, email, password, number, textarea variants
 */

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  label,
  error,
  required = false,
  disabled = false,
  className = "",
  icon: Icon,
  ...props
}) {
  // ✅ Base input styles
  const baseStyles =
    "w-full px-4 py-2.5 bg-background dark:bg-dark/30 border border-secondary/30 dark:border-secondary/20 rounded-lg text-text dark:text-light placeholder-muted/50 dark:placeholder-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // ✅ Error state
  const errorStyles = error
    ? "border-red-500 dark:border-red-600 focus:ring-red-500/50"
    : "";

  const inputClassName = `${baseStyles} ${errorStyles} ${className}`;

  // ✅ Textarea specific
  if (type === "textarea") {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-text dark:text-light mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${inputClassName} resize-none`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }

  // ✅ Select specific
  if (type === "select") {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-text dark:text-light mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-3 text-primary pointer-events-none" />
          )}
          <select
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${inputClassName} ${Icon ? "pl-10" : ""}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }

  // ✅ Regular input types
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text dark:text-light mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${inputClassName} ${Icon ? "pl-10" : ""}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
