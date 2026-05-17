export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Forbidden: Admins cannot apply.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
};
