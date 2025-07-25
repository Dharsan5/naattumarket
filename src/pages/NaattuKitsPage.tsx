import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function NaattuKitsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-olive-800 mb-6">
          {t('naattuKits')}
        </h1>
        <div className="glass-card p-8 text-center">
          <p className="text-olive-600">Naattu Kits page coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
}
