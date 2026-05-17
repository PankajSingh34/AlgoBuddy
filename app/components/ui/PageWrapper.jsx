'use client'
import { motion } from 'framer-motion'

export function PageWrapper({ children }) {
  return (
    <motion.div
      id="main"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
