import express from 'express';

const router = express.Router();

// Placeholder order routes
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Orders endpoint - to be implemented'
  });
});

export default router;
