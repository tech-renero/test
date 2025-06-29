const express = require('express');
const { sequelize } = require('./config/db');
const signupRoutes = require('./users/signup');
const loginRoutes = require('./users/login');
const { authenticate, authorize } = require('./middleware/middleware');
const cors = require('cors');
const path = require('path');
const { Task } = require('./models'); // Use models/index.js for associations

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', signupRoutes);
app.use('/', loginRoutes);

// Protected route for creating a task
app.post('/api/tasks', authenticate, authorize('add', 'Task'), async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;
    const createdById = req.user.id;
    const createdByRole = req.user.role;

    // Validate required fields
    if (!title || !type || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, type, startDate, and endDate are required' });
    }

    // Ensure type is an array and valid
    const allowedTypes = ['a-task', 'b-task', 'c-task', 'd-task', 'e-task'];
    let typeArray = Array.isArray(type) ? type : [type];
    typeArray = typeArray.filter(t => allowedTypes.includes(t));
    if (typeArray.length === 0) {
      return res.status(400).json({ message: 'Invalid task type(s)' });
    }

    const task = await Task.create({
      title,
      description,
      type: typeArray.join(','), // Store as comma-separated string
      createdById,
      createdByRole,
      startDate,
      endDate
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tasks (Admin can view)
app.get('/api/tasks', authenticate, authorize('view', 'Task'), async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a task by ID (Admin can delete)
app.delete('/api/tasks/:id', authenticate, authorize('delete', 'Task'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const deleted = await Task.destroy({ where: { id: taskId } });
    if (deleted) {
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware (uncomment for debugging)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server error', error: err.message });
// });

// Start server and sync database
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;