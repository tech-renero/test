const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (action, resource) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: No user role found' });
    }
    const { role } = req.user;

    const permissions = {
      'Super-admin': {
        add: [],
        update: [],
        delete: ['User', 'Task'],
        view: ['User', 'Task']
      },
      'Admin': {
        add: ['User', 'Task'],
        update: ['User', 'Task'],
        delete: ['User', 'Task'],
        view: ['User', 'Task']
      },
      'Manager': {
        add: ['Task'],
        update: [],
        delete: ['Task'],
        view: ['User']
      }
    };

    if (permissions[role] && permissions[role][action]?.includes(resource)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  };
};

module.exports = { authenticate, authorize };