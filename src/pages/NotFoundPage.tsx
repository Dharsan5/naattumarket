import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="glass-card p-8">
          <h1 className="text-6xl font-bold text-olive-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-olive-700 mb-4">Page Not Found</h2>
          <p className="text-olive-600 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <motion.button
              className="glass-btn-primary flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
