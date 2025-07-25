import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold text-olive-800 mb-6">
            {t('login')}
          </h1>
          <p className="text-olive-600">Login page coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
}
