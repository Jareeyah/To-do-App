const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    description: {
      type: String,
      
    },
    dueDate:{
      type: Date,
      default: Date.now,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  });

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo ;