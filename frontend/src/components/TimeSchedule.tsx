import type React from "react";
import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import { Button } from "./ui/button";
import { Label } from "./ui/label";

const TimeSchedule: React.FC = () => {
  const [businessHours, setBusinessHours] = useState(true);
  const [days, setDays] = useState([
    { name: "Mon", checked: true, start: "00:00", end: "00:00" },
    { name: "Tue", checked: false, start: "00:00", end: "00:00" },
    { name: "Wed", checked: true, start: "00:00", end: "00:00" },
    { name: "Thu", checked: false, start: "00:00", end: "00:00" },
    { name: "Fri", checked: false, start: "00:00", end: "00:00" },
    { name: "Sat", checked: false, start: "00:00", end: "00:00" },
    { name: "Sun", checked: false, start: "00:00", end: "00:00" },
  ]);

  const handleDayChange = (index: number, checked: boolean) => {
    const newDays = [...days];
    newDays[index].checked = checked;
    setDays(newDays);
  };

  const handleTimeChange = (index: number, start: string, end: string) => {
    const newDays = [...days];
    newDays[index].start = start;
    newDays[index].end = end;
    setDays(newDays);
  };

  useEffect(() => {
    if (businessHours) {
      const newDays = [...days];
      newDays.slice(0, 5).forEach((day) => {
        day.checked = true;
        day.start = "09:00";
        day.end = "18:00";
      });
      setDays(newDays);
    } else {
      const newDays = [...days];
      newDays.slice(0, 5).forEach((day) => {
        day.checked = false;
      });
      setDays(newDays);
    }
  }, [businessHours]);

  return (
    <div className="my-4 w-full">
      <div className="flex items-center justify-between mb-4">
        {/* <div className="flex items-center space-x-2"> */}
        <Label htmlFor="airplane-mode" className="flex flex-col">
          <span className="font-semibold">Business hours</span>
          <span className="text-xs font-normal">
            Quickly enable or disable business hours
          </span>
        </Label>
        <Switch
          id="airplane-mode"
          checked={businessHours}
          onCheckedChange={(check) => setBusinessHours(check)}
        />
        {/* </div> */}
      </div>
      {days.map((day, index) => (
        <div key={day.name} className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={day.name}
              checked={day.checked}
              onCheckedChange={(check) =>
                handleDayChange(index, check as boolean)
              }
            />
            <label
              htmlFor={day.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {day.name}
            </label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="time"
              disabled={!day.checked}
              value={day.start}
              onChange={(e) => handleTimeChange(index, e.target.value, day.end)}
              className="p-1 border rounded-full"
            />
            <span className="mx-1">-</span>
            <input
              type="time"
              disabled={!day.checked}
              value={day.end}
              onChange={(e) =>
                handleTimeChange(index, day.start, e.target.value)
              }
              className="p-1 w-max border rounded-full"
            />
          </div>
        </div>
      ))}
      <Button className="mt-2 w-full">Save</Button>
    </div>
  );
};

export default TimeSchedule;
