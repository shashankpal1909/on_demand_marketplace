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
} from "date-fns";
import type React from "react";
import { useState } from "react";

interface AvailabilityCalendarProps {
  availableDates: string[];
  onDateSelect: (date: string) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availableDates,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-4 py-2 bg-gray-200 rounded">
          Prev
        </button>
        <span className="text-2xl font-bold">
          {format(currentMonth, dateFormat)}
        </span>
        <button onClick={nextMonth} className="px-4 py-2 bg-gray-200 rounded">
          Next
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
          {format(addMonths(startDate, i), dateFormat)}
        </div>,
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
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
        const isAvailable = availableDates.includes(formattedDate);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isCurrentDay = isToday(day);

        days.push(
          <div
            key={day.toString()}
            className={`p-4 border h-20 flex items-center justify-center ${!isCurrentMonth ? "bg-gray-100" : ""} ${isAvailable ? "bg-green-200" : ""} ${isSelected ? "bg-blue-300" : ""} ${isCurrentDay ? "border-red-500" : ""}`}
          >
            <button
              onClick={() => handleDateClick(cloneDay)}
              className="w-full h-full"
              disabled={!isAvailable}
            >
              <span className="text-lg">{format(day, "d")}</span>
            </button>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>,
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-screen-lg p-4 bg-white rounded shadow-md">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
