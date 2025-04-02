'use client';

import React from 'react';
import { Event } from '../types/event';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`relative bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition-all duration-200 ${
        isDragging ? 'invisible' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{event.time}</p>
        </div>
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
    </motion.div>
  );
}; 