// App.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigation } from './hooks/useStore';
import Home from './pages/Home';
import { useMemo } from 'react';
import AbiExplore from './pages/AbiExplore';

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%' }),
};

export default function App () {
  const { currentPage, direction } = useNavigation();

  const content = useMemo(() => {
    switch (currentPage) {
      case 'Home':
        return <Home />;

        case 'AbiExplore':
        return <AbiExplore />;
    
      default:
        return <Home />;
    }
  }, [currentPage]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
