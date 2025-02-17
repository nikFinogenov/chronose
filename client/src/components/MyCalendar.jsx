// src/components/MyCalendar.jsx
import { Calendar } from '@event-calendar/react';
import '@event-calendar/core/index.css';

const MyCalendar = () => {
  const events = [
    { id: 1, title: 'Meeting', start: '2025-02-20T10:00:00' },
    { id: 2, title: 'Conference', start: '2025-02-22T09:00:00', end: '2025-02-22T17:00:00' },
  ];

  return (
    <div style={{ height: '600px' }}>
      <Calendar 
        events={events}
        view="dayGridMonth"
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default MyCalendar;
