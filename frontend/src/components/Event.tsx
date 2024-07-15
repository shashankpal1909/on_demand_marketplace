import type React from "react";
import { useDrag } from "react-dnd";

interface EventProps {
  id: string;
  title: string;
}

const Event: React.FC<EventProps> = ({ id, title }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 bg-blue-500 text-white rounded ${isDragging ? "opacity-50" : ""}`}
    >
      {title}
    </div>
  );
};

export default Event;
