'use client';

import React from 'react';
import { Event } from '../types/event';
import { motion, AnimatePresence } from 'framer-motion';

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

export const EventDetail = ({ event, onClose }: EventDetailProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-64">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <p className="text-lg text-gray-500 mt-2">{event.time}</p>
            <p className="text-gray-600 mt-4">{event.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 