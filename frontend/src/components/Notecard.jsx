function NoteCard({ note }) {

  return (
    <div className="bg-secondary p-5 rounded-lg hover:bg-secondary/80 transition-colors shadow-md hover:shadow-lg">

      <h2 className="text-xl font-semibold mb-2 text-text">
        {note.title}
      </h2>

      <p className="text-text/80 mb-1">
        Subject: {note.subject}
      </p>

      <p className="text-text/80 mb-3">
        Uploaded by: {note.uploadedBy}
      </p>

      <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
        {note.fileType}
      </span>

      <div className="mt-4">

        <button className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors">
          Download
        </button>

      </div>

    </div>
  );
}

export default NoteCard;
