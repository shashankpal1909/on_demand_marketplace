import type React from "react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Event from "./Event";

interface CalendarProps {
  days: number[];
}

interface DroppedEvent {
  id: string;
  day: number;
}

const Calendar: React.FC<CalendarProps> = ({ days }) => {
  const [events, setEvents] = useState<DroppedEvent[]>([]);

  const handleDrop = (id: string, day: number) => {
    setEvents((prevEvents) => [...prevEvents, { id, day }]);
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day) => (
        <Day key={day} day={day} onDrop={handleDrop}>
          {events
            .filter((event) => event.day === day)
            .map((event) => (
              <Event key={event.id} id={event.id} title={`Event ${event.id}`} />
            ))}
        </Day>
      ))}
    </div>
  );
};

interface DayProps {
  day: number;
  onDrop: (id: string, day: number) => void;
}

const Day: React.FC<PropsWithChildren<DayProps>> = ({
  day,
  onDrop,
  children,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "event",
    drop: (item: { id: string }) => {
      onDrop(item.id, day);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 border ${isOver ? "bg-green-100" : "bg-white"}`}
    >
      <div className="text-center font-bold">{day}</div>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Calendar</h1>
        <Calendar days={[1, 2, 3, 4, 5, 6, 7]} />
        <div className="flex mt-4">
          <Event id="1" title="Event 1" />
          <Event id="2" title="Event 2" />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
