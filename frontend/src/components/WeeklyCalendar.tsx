// src/components/WeeklyCalendar.tsx
import type React from "react";

interface Event {
  id: number;
  title: string;
  start: string; // Time in 'HH:MM' format
  end: string; // Time in 'HH:MM' format
  day: number; // 0-6 (Sun-Sat)
}

const hours = Array.from(
  { length: 24 },
  (_, i) => `${i < 10 ? "0" + i : i}:00`,
);
const events: Event[] = [
  { id: 1, title: "Meeting", start: "10:00", end: "11:00", day: 1 },
  { id: 2, title: "Lunch", start: "12:00", end: "13:00", day: 2 },
  { id: 3, title: "Conference", start: "14:00", end: "16:00", day: 3 },
];

const getTimeOffset = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const WeeklyCalendar: React.FC = () => {
  return (
    <div className="w-full h-screen p-4">
      <div className="grid grid-cols-8 gap-2">
        {/* Time Column */}
        <div className="col-span-1">
          {hours.map((hour) => (
            <div key={hour} className="h-24 border-b border-gray-300 relative">
              <span className="absolute top-0 left-0 text-xs">{hour}</span>
            </div>
          ))}
        </div>
        {/* Day Columns */}
        {Array.from({ length: 7 }).map((_, day) => (
          <div
            key={day}
            className="col-span-1 border-l border-gray-300 relative"
          >
            {hours.map((hour, index) => (
              <div
                key={index}
                className="h-24 border-b border-gray-300 relative"
              ></div>
            ))}
            {events
              .filter((event) => event.day === day)
              .map((event) => {
                const topOffset = getTimeOffset(event.start);
                const bottomOffset = getTimeOffset(event.end);
                const height = bottomOffset - topOffset;

                return (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 bg-blue-500 text-white p-2 rounded-md shadow-lg"
                    style={{
                      top: `${(topOffset / 60) * 6}rem`, // Each hour slot is 6rem high
                      height: `${(height / 60) * 6}rem`,
                    }}
                  >
                    {event.title}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
