// Dark color palette for cards
export const darkColors = [
  "#3B1F24", // deep muted red
  "#3B2A1F", // dark burnt peach
  "#3B3A1F", // olive yellow
  "#1F3B2A", // forest green
  "#1F2F3B", // deep blue
  "#2A1F3B", // dark violet
  "#3B1F2E", // wine pink
  "#2E1F3B", // plum purple
  "#1F3B35", // deep teal green
  "#2F3B1F", // moss green
  "#3B1F36", // dark magenta
  "#1F3B3A", // teal blue
  "#2A2F3B", // slate blue
  "#3B2F1F", // brown orange
  "#3B3B1F", // muted mustard
];
/**
 * Get a random color from the palette
 * If index is provided, ensures different color from adjacent cards
 * @param {number} [index] - Optional index to ensure variety between adjacent cards
 * @returns {string} - Hex color code
 */
export const getRandomColor = (index) => {
  if (index === undefined) {
    return darkColors[Math.floor(Math.random() * darkColors.length)];
  }

  // Get current color based on index
  const currentIndex = index % darkColors.length;
  return darkColors[currentIndex];
};

/**
 * Get a different color for adjacent item
 * Ensures the next card has a visibly different color
 * @param {number} index - Current index
 * @returns {string} - Hex color code
 */
export const getAlternateColor = (index) => {
  const length = darkColors.length;
  // Skip at least 5 colors to ensure visible difference
  const offset = Math.floor(length / 3) + (index % Math.floor(length / 3));
  const colorIndex = (index + offset) % length;
  return darkColors[colorIndex];
};
