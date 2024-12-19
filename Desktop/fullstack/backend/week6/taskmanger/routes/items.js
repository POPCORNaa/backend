const express = require('express');
const { taskSchema } = require('../validators/taskValidator');
const Task = require('../models/Task');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

// Public Routes
router.get('/items', authenticate, async (req, res) => {
  const { title, dueDate } = req.query;
  const query = {};
  if (title) query.title = new RegExp(title, 'i');
  if (dueDate) query.dueDate = new Date(dueDate);

  const tasks = await Task.find(query);
  res.send(tasks);
});

// Admin Routes
router.post('/items', authenticate, authorize(['admin']), validateRequest(taskSchema), async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).send(task);
});

router.put('/items/:id', authenticate, authorize(['admin']), validateRequest(taskSchema), async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).send('Task not found');
  res.send(task);
});

router.delete('/items/:id', authenticate, authorize(['admin']), async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).send('Task not found');
  res.send(task);
});

module.exports = router;
