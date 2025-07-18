
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-w-16 aspect-h-10 bg-gray-200 dark:bg-brand-dark rounded-lg flex items-center justify-center text-gray-500">
        No Image Available
      </div>
    );
  }
  
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = page % images.length >= 0 ? page % images.length : (page % images.length) + images.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  const selectImage = (newIndex: number) => {
      const currentImageIndex = page % images.length >= 0 ? page % images.length : (page % images.length) + images.length;
      const newDirection = newIndex > currentImageIndex ? 1 : -1;
      setPage([newIndex, newDirection]);
  }

  return (
    <div className="w-full select-none">
      <div className="relative aspect-w-16 aspect-h-10 bg-gray-100 dark:bg-brand-dark rounded-lg overflow-hidden shadow-lg">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full object-contain"
          />
        </AnimatePresence>
        <button
          onClick={() => paginate(-1)}
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 z-10 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-10 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 pb-2 -mx-4 px-4 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-dark focus:ring-brand-gold ${
                  imageIndex === index ? 'border-brand-gold' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-20 h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
