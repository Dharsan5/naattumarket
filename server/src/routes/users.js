import express from 'express';

const router = express.Router();

// Placeholder user routes
router.get('/profile', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User profile endpoint - to be implemented'
  });
});

export default router;
