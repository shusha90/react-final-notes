import React, {useState, useEffect } from 'react'
import './App.css'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NoteForm from './NoteForm.jsx';
import localforage from 'localforage';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    localforage.getItem('notes').then((storedNotes) => {
      if (storedNotes) {
        setNotes(storedNotes.filter((note) => !note.deleted));
        setArchivedNotes(storedNotes.filter((note) => note.deleted));
      }
    });
  }, []);

  useEffect(() => {
    localforage.setItem(
      'notes',
      notes.concat(archivedNotes.map((note) => ({ ...note, deleted: true })))
    );
  }, [notes, archivedNotes]);

  const addNote = () => {
    if (newNote.trim() !== '') {
      const newNoteObject = {
        title: noteTitle.trim() !== '' ? noteTitle : null,
        text: newNote,
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
        updatedDate: null,
        deleted: false,
      };

      setNotes([...notes, newNoteObject]);
      setNewNote('');
      setNoteTitle('');
    }
  };

  
  const deleteNote = (index,e) => {
    e.stopPropagation();
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your note?'
    );

    if (isConfirmed) {
      const deletedNote = notes[index];
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
      setArchivedNotes([...archivedNotes, { ...deletedNote, deleted: true }]);
    }
  };

  const undeleteNote = (index) => {
    const undeletedNote = archivedNotes[index];
    const updatedArchivedNotes = [...archivedNotes];
    updatedArchivedNotes.splice(index, 1);
    setArchivedNotes(updatedArchivedNotes);
    setNotes([...notes, { ...undeletedNote, deleted: false }]);
  };

  const openModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setShowModal(false);
  };

  const editNote = (editedNote) => {
    const updatedNotes = notes.map((note) =>
      note === selectedNote
        ? {
            ...note,
            title: editedNote.title.trim() !== '' ? editedNote.title : null,
            text: editedNote.text,
            updatedDate: new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }),
          }
        : note
    );

    setNotes(updatedNotes);
    closeModal();
  };


  return (
    <>
    <div className="app">
      <h1>Notebook</h1>

      <div className="note-form">
      <input
          type="text"
          placeholder="Type title here!"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <input
          placeholder="Type text here!"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      <div className="notes-grid">
        {notes.map((note, index) => (
          <div key={index} className="note" onClick={() => openModal(note)}>
            <p>title: {note.title}</p>
            <p>text: {note.text}</p>
            <p>date: {note.date}</p>
            {note.updatedDate && <p>Updated: {note.updatedDate}</p>}
            <button onClick={(e) => deleteNote(index,e)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="archive">
        <h2>Archived Notes</h2>
        {archivedNotes.map((note, index) => (
          <div key={index} className="note">
            <p>title: {note.title}</p>
            <p>text: {note.text}</p>
            <p>date: {note.date}</p>
            {note.updatedDate && <p>Updated: {note.updatedDate}</p>}
            <button onClick={() => undeleteNote(index)}>Undelete</button>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Popup modal: edit note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {selectedNote && (
            <div>
              <p>title: {selectedNote.title}</p>
              <p>text: {selectedNote.text}</p>
              <p>date: {selectedNote.date}</p>
            </div>
          )} */}
          <NoteForm
            note={selectedNote}
            onAddNote={addNote}
            onEditNote={editNote}
          />
          <Button variant="secondary" onClick={closeModal}>
            Happy end
          </Button>
          </Modal.Body>
          </Modal>
          
        



    </div>
 
      
    </>
  )
}


export default App
