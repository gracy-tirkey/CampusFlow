/**
 * File Utility Functions
 * Handles file type detection, URL building, and preview rendering
 */

/**
 * Detect file type from URL/filename
 * @param {string} fileUrl - File URL or filename
 * @returns {string} - 'image', 'pdf', or 'file'
 */
export const getFileType = (fileUrl) => {
  if (!fileUrl) return "file";

  const urlLower = fileUrl.toLowerCase();

  // Check for image extensions
  if (/\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(urlLower)) {
    return "image";
  }

  // Check for PDF
  if (/\.pdf$/i.test(urlLower)) {
    return "pdf";
  }

  return "file";
};

/**
 * Build complete file URL from relative path
 * @param {string} url - File URL (can be relative or absolute)
 * @returns {string} - Complete URL
 */
export const buildFileUrl = (url) => {
  if (!url) return "";

  // Already a complete URL
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // Relative path - build localhost URL for development
  return `http://localhost:6090/${url.replace(/^\/+/, "")}`;
};

/**
 * Get file name from URL
 * @param {string} fileUrl - File URL
 * @returns {string} - File name
 */
export const getFileName = (fileUrl) => {
  if (!fileUrl) return "download";

  try {
    const parts = fileUrl.split("/");
    const fileName = parts[parts.length - 1];
    return fileName || "download";
  } catch (e) {
    return "download";
  }
};

/**
 * Check if URL is an image
 * @param {string} fileUrl - File URL
 * @returns {boolean}
 */
export const isImage = (fileUrl) => getFileType(fileUrl) === "image";

/**
 * Check if URL is a PDF
 * @param {string} fileUrl - File URL
 * @returns {boolean}
 */
export const isPDF = (fileUrl) => getFileType(fileUrl) === "pdf";

/**
 * Trigger browser download
 * @param {string} fileUrl - File URL
 * @param {string} fileName - File name for download
 */
export const downloadFile = (fileUrl, fileName = "download") => {
  if (!fileUrl) return;

  try {
    const link = document.createElement("a");
    link.href = buildFileUrl(fileUrl);
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
  }
};
