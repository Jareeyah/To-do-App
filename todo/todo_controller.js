const express = require('express');
const path = require("path");
const fs = require("fs");
const todoList = require("../db/todo");

const createTodo = async (req, res) => {
  try{
      const {description, dueDate} = req.body;

    if (!description || !dueDate) {
        return res.status(400).json({ error: "Description and due date are required fields." });
          };
      const userId = req.user._id;
      const todo = new todoList({
        description,
        dueDate,
        isComplete: false,
        userId: userId,
      });
    await todo.save();
    res.status(201).json(todo);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  };
}

const updateTodo = async (req, res) => {
  try{
    const id = req.params.id;
    const {description, date, isComplete} = req.body;
    const todo = await todoList.findByIdAndUpdate(id, {
      description,
      dueDate: date,
    });
     res.redirect("/todo.hbs");
  }
  catch(err){
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  };

};

const deleteTodo = async (req, res) => {
   try {
      const id = req.params.id;
      await todoList.findByIdAndDelete(id);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
};

