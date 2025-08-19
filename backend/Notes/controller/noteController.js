const noteService = require('../services/noteservices');
const { validationResult } = require('express-validator'); // ADD THIS IMPORT

// Get all notes
const getNotes = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await noteService.getUserNotes(
      req.userId, 
      page, 
      limit, 
      search
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single note
const getNote = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.userId, req.params.id);
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create note
const createNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const note = await noteService.createNote(req.userId, req.body);
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(
      req.userId, 
      req.params.id, 
      req.body
    );
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.userId, req.params.id);
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};