"use client"; // Enables client-side rendering for this component

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type LapTime = {
  time: number;
  name: string;
};

export default function StopWatch() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [lapName, setLapName] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
    setLapName("");
  };

  const handleLap = () => {
    if (isRunning && lapName.trim()) {
      setLapTimes((prevLapTimes) => [...prevLapTimes, { time, name: lapName }]);
      setLapName(""); // Clear the lap name after adding
    }
  };

  // Helper function to format time in mm:ss:ms
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-100"} p-6`}>
      <Card className={`w-full max-w-lg shadow-lg rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <CardHeader className="flex flex-col items-center justify-center p-4">
          <CardTitle className="text-6xl font-bold">Stopwatch</CardTitle>
          <CardDescription className="text-lg">
            Track your time and laps easily.
          </CardDescription>
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className={`mt-2 px-4 py-2 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-8 p-6">
          <div className="text-7xl font-bold tracking-wide">{formatTime(time)}</div>
          <div className="flex gap-4">
            <Button
              onClick={isRunning ? handleStop : handleStart}
              className={`px-8 py-3 text-lg font-medium rounded-lg shadow-md transition-colors duration-200 ${isRunning ? "bg-red-600 text-white hover:bg-gray-400" : "bg-green-500 text-white hover:bg-green-700"}`}
            >
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button onClick={handleReset} className="px-8 py-3 text-lg font-medium rounded-lg bg-gray-500 text-white shadow-md hover:bg-gray-700">
              Reset
            </Button>
            <Button onClick={handleLap} className="px-8 py-3 text-lg font-medium rounded-lg bg-blue-400 text-white shadow-md hover:bg-blue-700" disabled={!isRunning}>
              Lap
            </Button>
          </div>
          <input
            type="text"
            value={lapName}
            onChange={(e) => setLapName(e.target.value)}
            placeholder="Lap Name"
            className="mt-4 p-2 border rounded text-gray-500"
          />
          <div className="w-full max-w-md">
            <Card className="overflow-hidden rounded-lg shadow-inner">
              <CardHeader className="bg-gray-500 p-2">
                <CardTitle className="text-xl font-semibold">Lap Times</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-auto p-0">
                {lapTimes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Lap</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lapTimes.map((lap, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{lap.name || `Lap ${index + 1}`}</TableCell>
                          <TableCell className="text-right">{formatTime(lap.time)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 p-4">No lap times recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
