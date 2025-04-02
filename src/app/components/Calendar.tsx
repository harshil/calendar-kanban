'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { format, addDays, startOfWeek } from 'date-fns';
import { Event, EventsByDate } from '../types/event';
import { EventCard } from './EventCard';
import { EventDetail } from './EventDetail';
import { events as initialEvents } from '../data/events';

export const Calendar = () => {
  const [events, setEvents] = useState<EventsByDate>(initialEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const eventId = active.id as string;
    const targetDate = over.id as string;

    // Find the event in the current events
    let draggedEvent: Event | null = null;
    let sourceDate = '';
    Object.entries(events).forEach(([date, dateEvents]) => {
      const found = dateEvents.find(e => e.id === eventId);
      if (found) {
        draggedEvent = found;
        sourceDate = date;
      }
    });

    if (!draggedEvent) return;

    // Update events state
    setEvents(prev => {
      const newEvents = { ...prev };
      
      // Remove from source date
      newEvents[sourceDate] = newEvents[sourceDate].filter(e => e.id !== eventId);
      
      // Add to target date
      if (!newEvents[targetDate]) {
        newEvents[targetDate] = [];
      }
      if (draggedEvent) {
        newEvents[targetDate].push(draggedEvent);
      }
      
      return newEvents;
    });
  };

  const getVisibleDates = () => {
    if (isMobile) {
      return [selectedDate];
    }
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const handleDateChange = (days: number) => {
    setSelectedDate(prev => addDays(prev, days));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-f6f8ff to-eef1f9">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDateChange(isMobile ? -1 : -7)}
              className="p-2 rounded-full hover:bg-white/10"
            >
              ←
            </button>
            <span className="text-lg">
              {format(selectedDate, 'MMMM d, yyyy')}
            </span>
            <button
              onClick={() => handleDateChange(isMobile ? 1 : 7)}
              className="p-2 rounded-full hover:bg-white/10"
            >
              →
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {getVisibleDates().map(date => (
              <div
                key={date.toISOString()}
                className="bg-white rounded-lg p-4 min-h-[200px]"
                id={format(date, 'yyyy-MM-dd')}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {format(date, 'EEE, MMM d')}
                </h3>
                <div className="space-y-4">
                  {events[format(date, 'yyyy-MM-dd')]?.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DragOverlay>
            {selectedEvent && (
              <EventCard
                event={selectedEvent}
                onClick={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}; 