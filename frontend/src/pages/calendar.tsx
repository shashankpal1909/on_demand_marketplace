import { PopoverClose } from "@radix-ui/react-popover";
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
} from "date-fns";
import React, { useState } from "react";
import { IconLeft, IconRight } from "react-day-picker";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

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

import { cn } from "@/lib/utils";

export default function Calendar() {
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

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    for (let z = 0; z < 6; z++) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "yyyy-MM-dd");
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isCurrentDay = isToday(day);

        days.push(
          <Popover>
            <PopoverTrigger asChild>
              <div
                key={day.toString()}
                className={cn(
                  "flex justify-center items-center p-2 border cursor-pointer",
                  // isCurrentDay && "text-red-500",
                  !isCurrentMonth && "bg-muted",
                  !isCurrentMonth && "cursor-not-allowed",
                )}
              >
                <span
                  onClick={() => handleDateClick(cloneDay)}
                  className={cn(
                    "text-sm font-bold p-1 rounded-full",
                    isCurrentDay && "bg-orange-400",
                    isSelected && "border border-indigo-400",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex  justify-between items-center gap-2">
              <Label className="text-sm font-semibold">Add New Event</Label>
              <PopoverClose>
                <Button>Save</Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>,
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
      <div className="flex flex-grow flex-col">
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
        {/* <div className="grid grid-flow-row h-full w-full">
          <div className="grid grid-rows-5 grid-flow-row">
            <div className="grid grid-cols-7 grid-flow-col">
              {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => {
                return (
                  <div key={day} className="p-4 text-center border">
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="grid  grid-cols-7 grid-flow-col">
              {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => {
                return (
                  <div key={day} className="p-4 text-center border">
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="grid  grid-cols-7 grid-flow-col">
              {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => {
                return (
                  <div key={day} className="p-4 text-center border">
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 grid-flow-col">
              {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => {
                return (
                  <div key={day} className="p-4 text-center border">
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="grid  grid-cols-7 grid-flow-col">
              {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => {
                return (
                  <div key={day} className="p-4 text-center border">
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
