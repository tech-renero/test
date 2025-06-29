const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  type: { // Multi-select, store as comma-separated string
    type: DataTypes.STRING,
    allowNull: false
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdByRole: { // Store role of the user who created
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'tasks'
});

module.exports = Task;