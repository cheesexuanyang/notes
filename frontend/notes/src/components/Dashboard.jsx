import { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import NoteCard from './NoteCard';
import CreateNote from './CreateNote';
import { Plus, Search, LogOut, StickyNote, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async (search = '') => {
    try {
      setLoading(true);
      const response = await notesAPI.getNotes({ search });
      setNotes(response.notes || []);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchNotes(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
    setShowCreateModal(false);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(notes.map(note => 
      note._id === updatedNote._id ? updatedNote : note
    ));
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(notes.filter(note => note._id !== noteId));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <StickyNote size={32} />
          <h1>NoteVault</h1>
        </div>
        
        <div className="header-center">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="header-right">
          <span className="user-name">Hi, {user?.name}</span>
          <button onClick={logout} className="btn-logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="notes-header">
          <h2>My Notes</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-create"
          >
            <Plus size={20} />
            New Note
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader className="spinner" size={40} />
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <StickyNote size={64} />
            <h3>No notes yet</h3>
            <p>Create your first note to get started</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus size={20} />
              Create Note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={handleNoteUpdated}
                onDelete={handleNoteDeleted}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateNote
          onClose={() => setShowCreateModal(false)}
          onCreate={handleNoteCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;