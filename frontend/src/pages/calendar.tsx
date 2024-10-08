import { PopoverClose } from "@radix-ui/react-popover";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type React from "react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import TimeSchedule from "@/components/TimeSchedule";

import { cn } from "@/lib/utils";

interface Event {
  id: string;
  date: string;
  title: string;
}

interface CellProps {
  date: string;
  moveItem: (id: string, from: string, to: string) => void;
}

const Cell: React.FC<PropsWithChildren<CellProps>> = ({
  date,
  moveItem,
  children,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "ITEM",
    drop: (event: Event) => {
      moveItem(event.id, event.date, date);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="flex flex-grow w-full h-full"
      // className={`flex flex-grow w-full h-full ${isOver ? "bg-blue-200" : ""}`}
    >
      {children}
    </div>
  );
};

interface DraggableItemProps {
  event: Event;
}

const DraggableEvent: React.FC<DraggableItemProps> = ({ event }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: event,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={cn(
        "text-xs bg-primary p-1 w-full text-center rounded-full",
        isDragging && "opacity-50",
      )}
    >
      {event.title}
    </div>
  );
};
z.object({
  days: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});
export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">(
    "monthly",
  );
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Meeting",
      date: "2024-07-12",
    },
  ]);

  const [timeScheduleDialogOpen, setTimeScheduleDialogOpen] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // onDateSelect(format(date, "yyyy-MM-dd"));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const moveEvent = function (id: string, from: string, to: string): void {
    console.log(`move event ${id}: ${from} to ${to}`);
    if (from !== to) {
      setEvents((prev) => {
        const eventIndex = prev.findIndex((event) => event.id === id);
        const newEvents = [...prev];
        const arr = newEvents.splice(eventIndex, 1);
        newEvents.push({ id, title: arr[0].title, date: to });
        return newEvents;
      });
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    // let formattedDate = "";

    for (let z = 0; z < 6; z++) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isCurrentDay = isToday(day);

        const currentDayEvents = events.filter(
          (event) => event.date === formattedDate,
        );

        days.push(
          <Cell date={formattedDate} moveItem={moveEvent}>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  key={day.toString()}
                  className={cn(
                    "flex flex-grow flex-col gap-1 justify-start items-center p-2 border cursor-pointer",
                    // isCurrentDay && "text-red-500",
                  )}
                >
                  <span
                    onClick={() => handleDateClick(cloneDay)}
                    className={cn(
                      "text-sm font-bold p-1 rounded-full",
                      !isCurrentMonth && "text-muted-foreground",

                      isCurrentDay && "bg-orange-400",
                      isSelected && "border border-indigo-400",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {currentDayEvents.length > 0 &&
                    currentDayEvents.map((event) => (
                      <DraggableEvent event={event} />
                    ))}
                </div>
              </PopoverTrigger>
              <PopoverContent className="flex justify-between items-center gap-2">
                <Label className="text-sm font-semibold">Add New Event</Label>
                <PopoverClose>
                  <Button
                    onClick={() => {
                      setEvents((prev) => [
                        ...prev,
                        {
                          id: String(Date.now()),
                          title: "New Event",
                          date: formattedDate,
                        },
                      ]);
                    }}
                  >
                    Save
                  </Button>
                </PopoverClose>
              </PopoverContent>
            </Popover>
          </Cell>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 grid-flow-col">
          {days}
        </div>,
      );
      days = [];
    }
    return (
      <div className="grid grid-flow-row h-full w-full">
        <div className="grid grid-rows-6 grid-flow-row">{rows}</div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let i = 0; i <= 23; i++) {
      timeSlots.push(
        <div className="p-4 w-full border">
          <Label className="flex justify-center w-full text-center">
            {i}:00
          </Label>
        </div>,
      );
    }
    return <div className="grid grid-rows-12 grid-flow-row">{timeSlots}</div>;
  };

  return (
    <div className="flex p-4 gap-4 flex-grow flex-col container">
      <div className="flex justify-center items-center">
        <div className="flex flex-col w-full space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Availability Calendar
          </h2>
          <Label className="text-muted-foreground">
            Schedule availability for your services
          </Label>
        </div>
      </div>
      <Separator />
      <div className={"flex items-center gap-2"}>
        <Label>Reoccurring Availability: </Label>
        <TimeSchedule
          open={timeScheduleDialogOpen}
          onOpenChange={setTimeScheduleDialogOpen}
        />
      </div>
      <div className="flex gap-2 w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDate(new Date());
            }}
            variant={"outline"}
          >
            Today
          </Button>
          <Button onClick={prevMonth} variant={"outline"} size={"icon"}>
            <FaAngleLeft />
          </Button>
          <Button onClick={nextMonth} variant={"outline"} size={"icon"}>
            <FaAngleRight />
          </Button>
          <span className="text-xl font-bold">
            <Badge className="text-sm font-bold" variant="outline">
              {format(currentMonth, "MMMM yyyy")}
            </Badge>
          </span>
        </div>
        <div>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">daily</SelectItem>
              <SelectItem value="weekly">weekly</SelectItem>
              <SelectItem value="monthly">monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-grow flex-col flex-nowrap">
          <div className="grid grid-cols-7 grid-flow-col">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
              return (
                <div
                  key={day}
                  className="flex justify-center items-center p-4 text-center border"
                >
                  <Label className="text-sm font-semibold">
                    {day.toUpperCase()}
                  </Label>
                </div>
              );
            })}
          </div>
          {renderCells()}

          {/* <div className="grid grid-cols-8 grid-flow-col">
          {["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
            return (
              <div
                key={day}
                className="flex justify-center items-center p-4 text-center border"
              >
                <Label className="text-sm font-semibold">
                  {day.toUpperCase()}
                </Label>
              </div>
            );
          })}
        </div> */}
          {/* <div className="grid grid-flow-col grid-cols-8">
          {["", "1", "2", "3", "4", "5", "6", "7"].map((day) => {
            return (
              <div
                key={day}
                className="flex justify-center items-center p-4 text-center border"
              >
                <Label className="text-sm font-semibold">
                  {day.toUpperCase()}
                </Label>
              </div>
            );
          })}
        </div>
        <div className="grid grid-flow-col grid-cols-8">
          {renderTimeSlots()}
        </div> */}
        </div>
      </DndProvider>
    </div>
  );
}
