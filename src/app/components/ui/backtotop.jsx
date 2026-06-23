"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState('down'); // 'up' or 'down'

  useEffect(() => {
    const check = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      const totalScrollable = scrollHeight - clientHeight;
      
      // If the page is not scrollable at all, hide the button
      if (totalScrollable <= 100) {
        setVisible(false);
        return;
      }
      
      setVisible(true);
      
      // Determine direction based on scroll position
      if (scrollY <= 300) {
        setDirection('down');
      } else {
        setDirection('up');
      }
    };

    check();
    window.addEventListener('scroll', check);
    window.addEventListener('resize', check);

    // MutationObserver to detect dynamic content height changes
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      observer.disconnect();
    };
  }, []);

  const handleScroll = () => {
    if (direction === 'up') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={handleScroll}
          aria-label={direction === 'up' ? "Back to top" : "Scroll to bottom"}
          style={{ position: 'fixed', bottom: '96px', right: '20px' }}
          className="z-[9999] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#a435f0] text-white shadow-lg flex items-center justify-center hover:bg-[#8f2cd6] group"
        >
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-800">
            {direction === 'up' ? "Back to top" : "Scroll to bottom"}
          </div>
          {direction === 'up' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-y-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;