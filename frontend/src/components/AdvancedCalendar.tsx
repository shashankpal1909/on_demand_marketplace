import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  addDays,
  addHours,
  parse,
  isWithinInterval,
} from "date-fns";
import type React from "react";
import { useState } from "react";

interface Event {
  date: string;
  time: string;
  endTime: string;
  title: string;
  category: string;
}

interface AdvancedCalendarProps {
  events: Event[];
  onDateSelect: (date: string) => void;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({
  events,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">(
    "monthly",
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(format(date, "yyyy-MM-dd"));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex justify-between items-center mb-4 px-4">
        <button
          onClick={prevMonth}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
        >
          &lt;
        </button>
        <span className="text-2xl font-bold">
          {format(currentMonth, dateFormat)}
        </span>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "eeee";
    const startDate = startOfWeek(startOfMonth(currentMonth));

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-lg">
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }
    return (
      <div className="grid grid-cols-7 mb-2 border-b dark:border-gray-700">
        {days}
      </div>
    );
  };

  const renderTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(
        <div
          key={i}
          className="flex items-center justify-center border-b dark:border-gray-700 h-12"
        >
          {i}:00
        </div>,
      );
    }
    return slots;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "yyyy-MM-dd");
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isCurrentDay = isToday(day);

        const dayEvents = events.filter(
          (event) => event.date === formattedDate,
        );

        days.push(
          <div
            key={day.toString()}
            className={`p-2 border h-40 flex flex-col justify-start items-start ${
              !isCurrentMonth ? "bg-gray-100 dark:bg-gray-800" : ""
            } ${isSelected ? "bg-blue-100 dark:bg-blue-800" : ""} ${
              isCurrentDay ? "border-red-500" : ""
            } transition duration-300`}
          >
            <button
              onClick={() => handleDateClick(cloneDay)}
              className="w-full h-full text-left"
            >
              <span className="text-lg">{format(day, "d")}</span>
            </button>
            <div className="flex flex-col space-y-1 mt-2 w-full">
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  className={`text-xs px-2 py-1 rounded ${
                    event.category === "Work"
                      ? "bg-yellow-200 dark:bg-yellow-700"
                      : event.category === "Clients"
                        ? "bg-blue-200 dark:bg-blue-700"
                        : "bg-purple-200 dark:bg-purple-700"
                  }`}
                >
                  {event.time} - {event.title}
                </div>
              ))}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderWeeklyView = () => {
    const startDate = startOfWeek(selectedDate || new Date());
    const endDate = endOfWeek(startDate);
    const days = [];
    let day = startDate;
    const formattedDays = [];

    while (day <= endDate) {
      formattedDays.push(format(day, "yyyy-MM-dd"));
      days.push(
        <div
          key={day.toString()}
          className="h-12 flex justify-center items-center border-b dark:border-gray-700"
        >
          <span className="text-lg font-semibold">{format(day, "eee d")}</span>
        </div>,
      );
      day = addDays(day, 1);
    }

    const slots = renderTimeSlots();
    const rows = [];

    slots.forEach((slot, index) => {
      const slotCells = [
        <div
          key={index}
          className="w-16 flex justify-center items-center border-r dark:border-gray-700"
        >
          {slot}
        </div>,
      ];
      formattedDays.forEach((date) => {
        const dayEvents = events.filter((event) => event.date === date);
        slotCells.push(
          <div
            key={date + index}
            className="flex flex-col border-r dark:border-gray-700 flex-1"
          >
            {dayEvents.map((event, idx) => {
              const eventStart = parseInt(event.time.split(":")[0]);
              const eventEnd = parseInt(event.endTime.split(":")[0]);
              if (eventStart <= index && eventEnd > index) {
                return (
                  <div
                    key={idx}
                    className={`text-xs px-2 py-1 rounded my-1 ${
                      event.category === "Work"
                        ? "bg-yellow-200 dark:bg-yellow-700"
                        : event.category === "Clients"
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "bg-purple-200 dark:bg-purple-700"
                    }`}
                  >
                    {event.time} - {event.endTime} - {event.title}
                  </div>
                );
              }
              return null;
            })}
          </div>,
        );
      });

      rows.push(
        <div key={index} className="flex">
          {slotCells}
        </div>,
      );
    });

    return (
      <div className="flex flex-col overflow-y-auto">
        <div className="flex">
          <div className="w-16"></div>
          {days}
        </div>
        {rows}
      </div>
    );
  };

  const renderDailyView = () => {
    const dayEvents = events.filter(
      (event) =>
        format(new Date(event.date), "yyyy-MM-dd") ===
        format(selectedDate || new Date(), "yyyy-MM-dd"),
    );
    const slots = renderTimeSlots();

    const rows = slots.map((slot, index) => (
      <div
        key={index}
        className="flex items-center justify-start border-b dark:border-gray-700 h-12 px-4"
      >
        {slot}
        <div className="flex flex-col ml-4">
          {dayEvents.map((event, idx) => {
            const eventStart = parseInt(event.time.split(":")[0]);
            const eventEnd = parseInt(event.endTime.split(":")[0]);
            if (eventStart <= index && eventEnd > index) {
              return (
                <div
                  key={idx}
                  className={`text-xs px-2 py-1 rounded my-1 ${
                    event.category === "Work"
                      ? "bg-yellow-200 dark:bg-yellow-700"
                      : event.category === "Clients"
                        ? "bg-blue-200 dark:bg-blue-700"
                        : "bg-purple-200 dark:bg-purple-700"
                  }`}
                >
                  {event.time} - {event.endTime} - {event.title}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    ));

    return <div className="flex flex-col overflow-y-auto">{rows}</div>;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full h-full p-4 bg-white dark:bg-gray-800 rounded shadow-md overflow-auto">
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-4 py-2 rounded ${viewMode === "monthly" ? "bg-gray-300 dark:bg-gray-600" : "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-2 rounded ${viewMode === "weekly" ? "bg-gray-300 dark:bg-gray-600" : "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 rounded ${viewMode === "daily" ? "bg-gray-300 dark:bg-gray-600" : "bg-gray-200 dark:bg-gray-700"} hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300`}
            >
              Daily
            </button>
          </div>
        </div>
        {viewMode === "monthly" && (
          <>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </>
        )}
        {viewMode === "weekly" && renderWeeklyView()}
        {viewMode === "daily" && renderDailyView()}
      </div>
    </div>
  );
};

export default AdvancedCalendar;
