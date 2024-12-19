const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().iso().required(),
  completed: Joi.boolean().default(false),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
});

module.exports = { taskSchema };
