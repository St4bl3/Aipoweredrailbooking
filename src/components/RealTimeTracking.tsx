"use client";

import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Train,
  Navigation,
  Wifi,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

export function RealTimeTracking() {
  const { trackingBooking } = useApp();

  // ❗ If opened without selecting a booking
  if (!trackingBooking) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl mb-3">No Train Selected</h2>
        <p className="text-muted-foreground">
          Please go to "My Trips" and click **Track** on a
          booking.
        </p>
      </div>
    );
  }

  // Dynamic data from booking
  const trainName = trackingBooking.train;
  const trainNo = trackingBooking.trainNumber;
  const pnr = trackingBooking.pnr;
  const from = trackingBooking.from;
  const to = trackingBooking.to;
  const depTime = trackingBooking.time;
  const platform = trackingBooking.platform;

  // Simple generated station list (until you replace with real data)
  const stations = [
    {
      name: from,
      time: depTime,
      status: "Departed",
      delay: 0,
      platform: platform,
    },
    {
      name: "Midway Station 1",
      time: "10:45",
      status: "Departed",
      delay: 0,
      platform: "3",
    },
    {
      name: "Midway Station 2",
      time: "13:20",
      status: "Current",
      delay: 14,
      platform: "2",
    },
    {
      name: "Midway Station 3",
      time: "16:10",
      status: "Upcoming",
      delay: null,
      platform: "1",
    },
    {
      name: to,
      time: "19:30",
      status: "Upcoming",
      delay: null,
      platform: "5",
    },
  ];

  const currentStation = 2;
  const progress =
    ((currentStation + 1) / stations.length) * 100;

  const handleShareLocation = () => {
    const basePnrLink = `https://irctc.live/track?pnr=${pnr}`;

    // Try to get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const { latitude, longitude } = position.coords;
          const linkWithLocation = `${basePnrLink}&lat=${latitude.toFixed(6)}&lng=${longitude.toFixed(6)}`;

          // Try clipboard API with fallback
          if (
            navigator.clipboard &&
            navigator.clipboard.writeText
          ) {
            navigator.clipboard
              .writeText(linkWithLocation)
              .then(
                () => {
                  toast.success(
                    "📍 Live tracking link with location copied!",
                  );
                },
                () => {
                  fallbackCopyTextToClipboard(linkWithLocation);
                },
              );
          } else {
            fallbackCopyTextToClipboard(linkWithLocation);
          }
        },
        // Error callback (denied or error)
        (error) => {
          console.log("Geolocation denied or error:", error);
          const fallbackLink = basePnrLink;

          // Try clipboard API with fallback
          if (
            navigator.clipboard &&
            navigator.clipboard.writeText
          ) {
            navigator.clipboard.writeText(fallbackLink).then(
              () => {
                toast.success(
                  "📍 Live tracking link copied! (Location access denied)",
                );
              },
              () => {
                fallbackCopyTextToClipboard(fallbackLink);
              },
            );
          } else {
            fallbackCopyTextToClipboard(fallbackLink);
          }
        },
      );
    } else {
      // Geolocation not supported
      const fallbackLink = basePnrLink;

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        navigator.clipboard.writeText(fallbackLink).then(
          () => {
            toast.success("📍 Live tracking link copied!");
          },
          () => {
            fallbackCopyTextToClipboard(fallbackLink);
          },
        );
      } else {
        fallbackCopyTextToClipboard(fallbackLink);
      }
    }
  };

  const handleSetReminder = () => {
    toast.success("⏰ Arrival reminder set!");

    // After 5 seconds, show the arrival notification
    setTimeout(() => {
      toast.success("🚆 Your train arrives in 30 minutes!");
    }, 5000);
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("📍 Live tracking link copied!");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      toast.error(
        "Unable to copy link. Please copy manually: " + text,
      );
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2>Live Train Tracking</h2>
            <Badge variant="outline" className="gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
              </div>
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {trainName} #{trainNo} • PNR: {pnr}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h4 className="mb-4">Train Location</h4>

              <div className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
                {/* Fake path (can later be replaced with real map) */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 80 60 Q 200 120, 350 180 T 600 260"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="8 4"
                    opacity="0.5"
                  />
                </svg>

                {/* Stations */}
                {stations.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`absolute w-4 h-4 rounded-full ${
                      idx < currentStation
                        ? "bg-green-500"
                        : idx === currentStation
                          ? "bg-blue-500 ring-4 ring-blue-200"
                          : "bg-gray-300"
                    }`}
                    style={{
                      left: `${100 + idx * 80}px`,
                      top: `${60 + idx * 40}px`,
                    }}
                  />
                ))}

                {/* Train Icon */}
                <motion.div
                  animate={{
                    x: [0, 8, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                  className="absolute"
                  style={{
                    left: `${100 + currentStation * 80}px`,
                    top: `${60 + currentStation * 40}px`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                    <Train className="h-6 w-6" />
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Speed: 82 km/h
                </span>
                <span className="text-muted-foreground">
                  Next: {stations[currentStation + 1]?.name}
                </span>
              </div>
            </Card>

            {/* Journey Progress */}
            <Card className="p-6">
              <h4 className="mb-4">Journey Progress</h4>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>
                  Station {currentStation + 1} of{" "}
                  {stations.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>

              <Progress value={progress} className="h-2 mb-4" />

              <div className="relative">
                {stations.map((station, idx) => (
                  <div
                    key={idx}
                    className={`relative flex gap-4 ${
                      idx !== stations.length - 1 ? "pb-8" : ""
                    }`}
                  >
                    {/* Icons */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        station.status === "Departed"
                          ? "bg-green-500 text-white"
                          : station.status === "Current"
                            ? "bg-blue-500 text-white ring-4 ring-blue-300"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {station.status === "Departed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : station.status === "Current" ? (
                        <Train className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </div>

                    {/* Text */}
                    <div>
                      <p>{station.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {station.time}
                      </p>
                      {station.platform && (
                        <p className="text-xs text-muted-foreground">
                          Platform {station.platform}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-amber-950">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <h5 className="mb-1">Delay Alert</h5>
                  <p className="text-sm">
                    Train running 14 minutes late
                    (auto-estimated)
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h5 className="mb-4">AI Delay Estimate</h5>
              <Progress value={64} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Based on current speed, route congestion &
                historical data
              </p>
            </Card>

            <Card className="p-6">
              <h5 className="mb-2">Your Coach Position</h5>
              <p className="text-sm">
                <strong>Coach:</strong> {trackingBooking.coach}
              </p>
              <p className="text-sm">
                <strong>Seat:</strong>{" "}
                {trackingBooking.seats?.[0]}
              </p>
              <p className="text-sm">
                <strong>Platform:</strong> {platform}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}