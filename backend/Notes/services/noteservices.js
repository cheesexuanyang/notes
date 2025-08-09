const Note = require('../models/modelnote');

class NoteService {
  // Get all notes for a user with pagination
  async getUserNotes(userId, page = 1, limit = 10, search = '') {
    const query = { user: userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const notes = await Note.find(query)
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);
    
    const total = await Note.countDocuments(query);
    
    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getNoteById(userId, noteId) {
  const note = await Note.findOne({ 
    _id: noteId, 
    user: userId 
  });
  
  if (!note) {
    throw new Error('Note not found');
  }
  
  return note;
}
  
  // Create a new note
  async createNote(userId, noteData) {
    const note = await Note.create({
      user: userId,
      ...noteData
    });
    return note;
  }
  
  // Update a note
  async updateNote(userId, noteId, updates) {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      throw new Error('Note not found');
    }
    
    return note;
  }
  
  // Delete a note
  async deleteNote(userId, noteId) {
    const note = await Note.findOneAndDelete({
      _id: noteId,
      user: userId
    });
    
    if (!note) {
      throw new Error('Note not found');
    }
    
    return note;
  }
}



module.exports = new NoteService();