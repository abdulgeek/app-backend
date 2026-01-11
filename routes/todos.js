const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos',
      error: error.message
    });
  }
});

// GET single todo by ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo',
      error: error.message
    });
  }
});

// POST create new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    const todo = new Todo({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: completed || false
    });
    
    const savedTodo = await todo.save();
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: savedTodo
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo',
      error: error.message
    });
  }
});

// PUT update todo by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
      }
      todo.title = title.trim();
    }
    
    if (description !== undefined) {
      todo.description = description.trim();
    }
    
    if (completed !== undefined) {
      todo.completed = completed;
    }
    
    const updatedTodo = await todo.save();
    
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo',
      error: error.message
    });
  }
});

// DELETE todo by ID
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    await Todo.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo',
      error: error.message
    });
  }
});

// DELETE all completed todos
router.delete('/completed/all', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed todo(s) deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting completed todos',
      error: error.message
    });
  }
});

module.exports = router;