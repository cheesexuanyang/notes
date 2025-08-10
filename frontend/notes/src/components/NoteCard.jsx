import { useState } from 'react';
import { notesAPI } from '../services/api';
import { Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.updateNote(note._id, {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Note updated');
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(note._id);
        onDelete(note._id);
        toast.success('Note deleted');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setIsEditing(false);
  };

  return (
    <div className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            className="note-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
          />
          <textarea
            className="note-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content..."
            rows={6}
          />
          <input
            type="text"
            className="note-tags-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
          />
          <div className="note-actions">
            <button 
              onClick={handleSave} 
              className="btn-save"
              disabled={loading}
            >
              <Save size={16} />
              Save
            </button>
            <button 
              onClick={handleCancel} 
              className="btn-cancel"
              disabled={loading}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="note-title">{note.title}</h3>
          <p className="note-content">{note.content}</p>
          {note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="note-footer">
            <span className="note-date">
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
            <div className="note-actions">
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                <Edit2 size={16} />
              </button>
              <button onClick={handleDelete} className="btn-delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteCard;