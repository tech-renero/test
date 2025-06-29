const { models: { User }, sequelize } = require('../config/db');
const Task = require('./task');
User.hasMany(Task, { foreignKey: 'createdById' });
Task.belongsTo(User, { foreignKey: 'createdById' });
module.exports = { User, Task, sequelize };