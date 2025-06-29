const { sequelize } = require('../config/db');
const Task = require('./task');
const { models: { User } } = require('../config/db');

// Define associations
User.hasMany(Task, { foreignKey: 'createdById' });
Task.belongsTo(User, { foreignKey: 'createdById' });

module.exports = { User, Task, sequelize };