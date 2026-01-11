const Todo = require('../models/Todo');

// Create a new todo
const createTodo = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    });
  }
};

// Get all todos
const getAllTodos = async (req, res) => {
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
      message: 'Failed to fetch todos',
      error: error.message
    });
  }
};

// Get a single todo by ID
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

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
      message: 'Failed to fetch todo',
      error: error.message
    });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findById(id);

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
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message
    });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: todo
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
      message: 'Failed to delete todo',
      error: error.message
    });
  }
};

// Delete all todos
const deleteAllTodos = async (req, res) => {
  try {
    const result = await Todo.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All todos deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all todos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all todos',
      error: error.message
    });
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteAllTodos
};