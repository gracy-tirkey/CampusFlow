import { getRandomColor } from "../utils/colorPalette";
import {
  getFileType,
  buildFileUrl,
  getFileName,
  downloadFile,
  isImage,
  isPDF,
} from "../utils/fileUtils";
import ExpandableText from "./ExpandableText";
import { FaDownload, FaFile, FaFilePdf, FaImage } from "react-icons/fa";

function NoteCard({ note, index = 0 }) {
  const backgroundColor = getRandomColor(index);
  const fileUrl = buildFileUrl(note.fileUrl);
  const fileType = getFileType(note.fileUrl);
  const fileName = getFileName(note.fileUrl);

  const handleDownload = () => {
    downloadFile(note.fileUrl, fileName);
  };

  return (
    <div
      className="p-4 rounded-lg hover:shadow-lg transition-all shadow-md flex flex-col justify-between border border-white/10 h-full"
      style={{ backgroundColor }}
    >
      {/* Note Title */}
      <div className="mb-2">
        <ExpandableText
          text={note.title}
          maxChars={80}
          preserveLineBreaks={false}
        />
      </div>

      {/* Note Metadata */}
      <div className="mb-3 space-y-1 text-sm">
        <p className="text-white/80">
          <span className="font-medium">Subject:</span> {note.subject}
        </p>
        <p className="text-white/80 text-xs">
          <span className="font-medium">By:</span>{" "}
          {note.uploadedBy?.name || note.uploadedBy}
        </p>
      </div>

      {/* Note Description */}
      {note.description && (
        <div className="mb-3 text-xs text-white/70">
          <ExpandableText
            text={note.description}
            maxChars={120}
            preserveLineBreaks={true}
          />
        </div>
      )}

      {/* Media Preview Section - Fixed Height */}
      <div className="mb-3 h-40 rounded-lg overflow-hidden border border-white/20 bg-black/20 flex items-center justify-center">
        {fileType === "image" && fileUrl ? (
          <img
            src={fileUrl}
            alt={note.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3e%3crect fill="%23333" width="100" height="100"/%3e%3ctext x="50" y="50" font-size="12" fill="%23999" text-anchor="middle" dy=".3em"%3eImage Error%3c/text%3e%3c/svg%3e';
            }}
          />
        ) : fileType === "pdf" && fileUrl ? (
          <div className="flex flex-col items-center justify-center text-white/60">
            <FaFilePdf size={48} />
            <p className="text-xs mt-2">PDF Document</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/60">
            <FaFile size={40} />
            <p className="text-xs mt-2">
              {fileType === "file" ? "File" : "No Preview"}
            </p>
          </div>
        )}
      </div>

      {/* File Type Badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-1 rounded-full">
          {fileType === "image" && <FaImage size={12} />}
          {fileType === "pdf" && <FaFilePdf size={12} />}
          {fileType === "file" && <FaFile size={12} />}
          {fileType.toUpperCase()}
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={handleDownload}
        className="bg-[#25d366] text-white px-4 py-2 rounded hover:bg-green-600 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full"
      >
        <FaDownload size={14} />
        Download
      </button>
    </div>
  );
}

export default NoteCard;
