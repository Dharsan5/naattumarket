import express from 'express';

const router = express.Router();

// Placeholder supplier routes
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Suppliers endpoint - to be implemented'
  });
});

export default router;
