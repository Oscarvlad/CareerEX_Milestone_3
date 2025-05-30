const { verifyToken } = require('../config/auth');
const User = require('../models/User');

// Custom error response function
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

// @desc    Protect routes - verify JWT
// @access  Private
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Get token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.user.id);
    if (!currentUser) {
      return errorResponse(res, 401, 'The user belonging to this token no longer exists');
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return errorResponse(res, 401, 'Not authorized to access this route');
  }
};

// @desc    Authorize roles
// @access  Private
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};

// @desc    Check ownership (for user-specific resources)
// @access  Private
exports.checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params[paramName]);
      
      if (!resource) {
        return errorResponse(res, 404, 'Resource not found');
      }

      // Check if user is owner or admin
      if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Not authorized to modify this resource');
      }

      next();
    } catch (err) {
      console.error('Ownership check error:', err.message);
      return errorResponse(res, 500, 'Server error');
    }
  };
};