import React, { useState, useEffect } from 'react';

const NoteForm = ({ note, onAddNote, onEditNote }) => {
  const [noteText, setNoteText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  useEffect(() => {
    if (note) {
      setNoteTitle(note.title || '');
      setNoteText(note.text || '');
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note) {
      onEditNote({
        title: noteTitle,
        text: noteText,
      });
    } else {
      onAddNote({
        title: noteTitle,
        text: noteText,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type title here!"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <input
        placeholder="Type text here!"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <button type="submit">{note ? 'Save Changes' : 'Add Note'}</button>
    </form>
  );
};

export default NoteForm;