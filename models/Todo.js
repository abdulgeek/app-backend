const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

todoSchema.index({ createdAt: -1 });

todoSchema.methods.toJSON = function() {
  const todo = this.toObject();
  return {
    id: todo._id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt
  };
};

todoSchema.statics.findByCompleted = function(completed) {
  return this.find({ completed }).sort({ createdAt: -1 });
};

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;