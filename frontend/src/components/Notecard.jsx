function NoteCard({ note }) {
  return (
    <div className="bg-secondary p-5 rounded-lg hover:bg-secondary/80 transition-colors shadow-md hover:shadow-lg flex flex-col justify-between">
      
      {/* Note Title */}
      <h2 className="text-xl font-semibold mb-2 text-text">
        {note.title}
      </h2>

      {/* Note Metadata */}
      <div className="mb-3 space-y-1">
        <p className="text-text/80">
          <span className="font-medium">Subject:</span> {note.subject}
        </p>
        <p className="text-text/80">
          <span className="font-medium">Uploaded by:</span> {note.uploadedBy}
        </p>
      </div>

      {/* File Type Badge */}
      <span className="inline-block text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
        {note.fileType}
      </span>

      {/* Action Button */}
      <div className="mt-4">
        <button className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors shadow-sm hover:shadow-md">
          Download
        </button>
      </div>

    </div>
  );
}

export default NoteCard;