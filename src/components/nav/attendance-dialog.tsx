'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Container } from "../ui/container";
import { useEffect, useState } from "react";
import { ButtonTooltip } from "../ui/button";
import { LucideClock, LucideSun, LucideCoffee, LucideMoon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { addAttendanceActivity } from "@/lib/actions/attendance";

export function AttendanceDialog() {
  const [open, setOpen] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<'present' | 'away' | 'offline'>('offline');
  const [activities, setActivities] = useState<Array<{ type: string; time: string }>>([]);
  const [error, setError] = useState<string>();
  const [location, setLocation] = useState<{ latitude: number; longitude: number; }>();


  useEffect(() => {
    (async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
      }
    })();
  }, [open]);

  const handleClockIn = async () => {

    setAttendanceStatus('present');
    setActivities(prev => [...prev, { type: 'Clocked In', time: new Date().toLocaleTimeString() }]);

    if (location) {
      const add = await addAttendanceActivity('clock_in', location);
    }
  };

  const handleBreak = () => {
    if (attendanceStatus === 'away') {
      setAttendanceStatus('present');
      setActivities(prev => [...prev, { type: 'Break Ended', time: new Date().toLocaleTimeString() }]);
    } else {
      setAttendanceStatus('away');
      setActivities(prev => [...prev, { type: 'Break Started', time: new Date().toLocaleTimeString() }]);
    }
  };

  const handleClockOut = () => {
    setAttendanceStatus('offline');
    setActivities(prev => [...prev, { type: 'Clocked Out', time: new Date().toLocaleTimeString() }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonTooltip title="Attendance" variant="outline" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <LucideClock className="h-5 w-5" />
          {attendanceStatus !== 'offline' && (
            <span className={cn(
              "absolute -top-1 -right-1 h-3 w-3 rounded-full animate-pulse",
              attendanceStatus === 'present' ? 'bg-green-500' : 'bg-yellow-500'
            )} />
          )}
        </ButtonTooltip>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-lg px-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LucideClock className="h-4 w-4 text-primary" />
            Attendance Tracker
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] px-4">
          <Container className="space-y-6">
            {/* Status Indicator */}
            <Card className="bg-gradient-to-br from-background to-muted/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Today&apos;s Status</CardTitle>
                  <Badge variant={attendanceStatus === 'present' ? 'success' : attendanceStatus === 'away' ? 'secondary' : 'destructive'}>
                    {attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total Hours</span>
                  <span>8h 24m</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              {attendanceStatus === 'offline'
                ? <button
                  onClick={handleClockIn}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl transition-all",
                    "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30",
                    "disabled:opacity-50 disabled:pointer-events-none"
                  )}
                >
                  <LucideSun className="h-8 w-8 text-emerald-500 mb-2" />
                  <span className="font-medium text-emerald-500">Clock In</span>
                  <span className="text-xs text-muted-foreground">Start your day</span>
                </button>
                : <>
                  <button
                    onClick={handleBreak}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-xl transition-all",
                      "disabled:opacity-50 disabled:pointer-events-none",
                      attendanceStatus === 'present'
                        ? "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
                        : "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30",
                    )}
                  >
                    <LucideCoffee className={cn(
                      "h-8 w-8 mb-2",
                      attendanceStatus === 'present'
                        ? "text-amber-500 "
                        : "text-emerald-500 "
                    )} />
                    <div className={cn(
                      "font-medium",
                      attendanceStatus === 'present'
                        ? "text-amber-500 "
                        : "text-emerald-500 ")}>{attendanceStatus === 'present' ? 'Take' : 'End'} Break</div>
                    <span className="text-xs text-muted-foreground">{attendanceStatus === 'present' ? 'Get back to' : 'Away from'} desk</span>
                  </button>

                  <button
                    onClick={handleClockOut}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-xl transition-all",
                      "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30",
                      "disabled:opacity-50 disabled:pointer-events-none"
                    )}
                  >
                    <LucideMoon className="h-8 w-8 text-rose-500 mb-2" />
                    <span className="font-medium text-rose-500">Clock Out</span>
                    <span className="text-xs text-muted-foreground">End your day</span>
                  </button>
                </>
              }
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Recent Activity</h3>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fade-in">
                    <span className="text-sm">{activity.type}</span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No activities recorded yet
                  </div>
                )}
              </div>
            </div>
          </Container>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}