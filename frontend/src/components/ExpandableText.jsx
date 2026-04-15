import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

/**
 * ExpandableText Component
 * Truncates text and provides expand/collapse functionality
 *
 * @param {string} text - The text to display
 * @param {number} maxChars - Maximum characters to show (default: 150)
 * @param {string} className - Additional CSS classes
 * @param {boolean} preserveLineBreaks - Whether to preserve newlines (default: true)
 */
export default function ExpandableText({
  text,
  maxChars = 150,
  className = "",
  preserveLineBreaks = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const textContent = text.trim();
  const needsExpand = textContent.length > maxChars;
  const displayText = isExpanded
    ? textContent
    : textContent.substring(0, maxChars);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Text content */}
      <div
        className={`
          ${preserveLineBreaks ? "whitespace-pre-wrap" : "line-clamp-3"}
          break-words text-sm leading-relaxed
        `}
      >
        {displayText}
        {!isExpanded && needsExpand && <span className="text-muted">...</span>}
      </div>

      {/* Expand/Collapse button */}
      {needsExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>
              <FaChevronUp size={12} />
              View Less
            </>
          ) : (
            <>
              <FaChevronDown size={12} />
              View More
            </>
          )}
        </button>
      )}
    </div>
  );
}
