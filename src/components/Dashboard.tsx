"use client";

import { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import {
  Train,
  MapPin,
  Clock,
  Calendar,
  Download,
  Edit2,
  Eye,
  Trash2,
  Navigation,
} from "lucide-react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

const generateTicket = async (b: any, addNotification: any) => {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const width = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 60;

    // ----- DATA -----
    const pnr =
      b.pnr ?? `PNR${Date.now().toString().slice(-6)}`;
    const trainName = b.train ?? "Rajdhani Express";
    const trainNumber = b.trainNumber ?? "12345";
    // -------------------------
    // 📌 Correct station printing (city + station + code)
    // -------------------------

    // City fallback
    const fromCity = b.from ?? "Chennai";
    const toCity = b.to ?? "Delhi";

    // Station fallback (user choose → override)
    const fromStation = b.fromStation ?? "Chennai Central";
    const toStation = b.toStation ?? "New Delhi";

    const formatStation = (city: string, station: string) => {
      return `${station}`;
    };

    const from = formatStation(fromCity, fromStation);
    const to = formatStation(toCity, toStation);

    const date =
      b.date ?? new Date().toISOString().split("T")[0];
    const depTime = b.time ?? "08:30";
    const coach = b.coach ?? "B2";
    const platform = b.platform ?? "4";
    const passengers = b.passengers ?? 2;

    const seats = b.seats?.length
      ? b.seats.join(", ")
      : "B2-23, B2-24";
    const baseFare = b.amount ?? 2450;
    const gst = Math.round(baseFare * 0.05);
    const total = baseFare + gst;

    // ----- QR CODE (realistic IRCTC-style payload + better rendering) -----
    const qrX = width - 160;
    const qrY = 110;

    const qrData =
      `IRCTC_TICKET\n` +
      `PNR:${pnr}\n` +
      `Train:${trainNumber}\n` +
      `TrainName:${trainName}\n` +
      `From:${from}\n` +
      `To:${to}\n` +
      `Date:${date}\n` +
      `Coach:${coach}\n` +
      `Seats:${seats}\n` +
      `Verified:true`;

    const qrImg = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 8,
    });

    // ----- HEADER -----
    doc.setFillColor(25, 55, 120);
    doc.rect(0, 0, width, 80, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("INDIAN RAILWAYS - IRCTC E-TICKET", margin, 35);
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      margin,
      55,
    );
    doc.text(`PNR: ${pnr}`, width - 160, 55);

    doc.setDrawColor(180);
    doc.line(margin, 80, width - margin, 80);
    y = 110;

    // White box behind QR (clean look)
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX - 10, qrY - 10, 120, 120, "F");

    // Add QR image on top
    doc.addImage(qrImg, "PNG", qrX, qrY, 100, 100);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Scan to verify ticket", qrX + 50, qrY + 115, {
      align: "center",
    });

    // ----- JOURNEY DETAILS -----
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Journey Details", margin, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const journeyDetails = [
      ["Train", `${trainNumber} — ${trainName}`],
      ["From", from],
      ["To", to],
      ["Date of Journey", date],
      ["Departure Time", depTime],
      ["Coach", coach],
      ["Platform", platform],
      ["Status", "CONFIRMED"],
    ];

    journeyDetails.forEach(([key, val], i) => {
      const rowY = y + i * 20;
      doc.setFillColor(i % 2 === 0 ? 250 : 240);
      doc.rect(margin, rowY - 10, width - 220, 20, "F");
      doc.text(key, margin + 10, rowY + 4);
      doc.text(String(val), width - 260, rowY + 4, {
        align: "right",
      });
    });
    y += journeyDetails.length * 20 + 40;

    // -------------------------------------------------------
    // ✅ UPDATED PASSENGER DETAILS (EDIT NAME WILL SHOW HERE)
    // -------------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Passenger Information", margin, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    let passengerList: any[] = [];

    if (b.passengerDetails && b.passengerDetails.length > 0) {
      passengerList = b.passengerDetails.map(
        (p: any, idx: number) => ({
          no: idx + 1,
          name: p.name || "Not Provided",
          age: p.age || "-",
          gender: p.gender || "-",
          seat: b.seats?.[idx] || b.seats?.[0] || "-",
        }),
      );
    } else {
      passengerList = [
        {
          no: 1,
          name: "Passenger",
          age: "-",
          gender: "-",
          seat: seats,
        },
      ];
    }

    passengerList.forEach((p, i) => {
      const rowY = y + i * 22;

      doc.setFillColor(i % 2 === 0 ? 250 : 240);
      doc.rect(margin, rowY - 10, width - 2 * margin, 22, "F");

      doc.text(
        `${p.no}. ${p.name}  |  Age: ${p.age}  |  Gender: ${p.gender}`,
        margin + 10,
        rowY + 4,
      );

      doc.text(
        `Seat: ${p.seat}`,
        width - margin - 20,
        rowY + 4,
        { align: "right" },
      );
    });

    y += passengerList.length * 22 + 30;

    // ----- FARE DETAILS -----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Fare Details", margin, y);
    y += 20;

    const fareRows = [
      ["Base Fare", `₹${baseFare}`],
      ["GST (5%)", `₹${gst}`],
      ["Total Fare", `₹${total}`],
    ];

    fareRows.forEach(([key, val], i) => {
      const rowY = y + i * 20;
      doc.setFillColor(i % 2 === 0 ? 250 : 240);
      doc.rect(margin, rowY - 10, width - 2 * margin, 20, "F");
      doc.text(key, margin + 10, rowY + 4);

      doc.setFont(
        "helvetica",
        key === "Total Fare" ? "bold" : "normal",
      );
      doc.text(String(val), width - margin - 20, rowY + 4, {
        align: "right",
      });
    });

    y += fareRows.length * 20 + 40;

    // ----- FOOTER -----
    doc.setDrawColor(180);
    doc.line(margin, y, width - margin, y);
    y += 25;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "Please carry a valid government photo ID during travel.",
      margin,
      y,
    );
    y += 14;
    doc.text(
      "Helpline: 139 | Email: support@irctc2.0.com",
      margin,
      y,
    );
    y += 14;
    doc.text("IRCTC 2.0 — Smart Travel Platform", margin, y);

    doc.save(`IRCTC_Ticket_${pnr}.pdf`);

    toast.success("🎫 Ticket downloaded successfully!");

    addNotification({
      message: `Ticket downloaded successfully (PNR: ${pnr})`,
      read: false,
      type: "info",
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to generate ticket");
  }
};

export function Dashboard({ setCurrentPage }: DashboardProps) {
  const {
    bookings,
    updateBooking,
    deleteBooking,
    setTrackingBooking,
    addNotification,
  } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] =
    useState<any>(null);
  const [editingPassengerIndex, setEditingPassengerIndex] =
    useState<number>(0);
  const [editedName, setEditedName] = useState("");
  const [editedAge, setEditedAge] = useState("");
  const [editedGender, setEditedGender] = useState("");

  // Full edit modal state
  const [showFullEditModal, setShowFullEditModal] =
    useState(false);
  const [fullEditBooking, setFullEditBooking] =
    useState<any>(null);

  // Full edit fields
  const [editedTrainName, setEditedTrainName] = useState("");
  const [editedTrainNumber, setEditedTrainNumber] =
    useState("");
  const [editedPNR, setEditedPNR] = useState("");
  const [editedCoach, setEditedCoach] = useState("");
  const [editedPlatform, setEditedPlatform] = useState("");
  const [editedFrom, setEditedFrom] = useState("");
  const [editedTo, setEditedTo] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedSeat, setEditedSeat] = useState("");

  const handleDownloadTicket = (booking: any) => {
    generateTicket(booking, addNotification);
  };

  const handleTrackTrain = (booking: any) => {
    setTrackingBooking(booking);
    setCurrentPage("tracking");
  };

  const handleEditPassenger = (
    booking: any,
    passengerIndex: number,
  ) => {
    setEditingBooking(booking);
    setEditingPassengerIndex(passengerIndex);

    // If passengerDetails exist, load them
    if (
      booking.passengerDetails &&
      booking.passengerDetails[passengerIndex]
    ) {
      const passenger =
        booking.passengerDetails[passengerIndex];
      setEditedName(passenger.name || "");
      setEditedAge(String(passenger.age || ""));
      setEditedGender(passenger.gender || "");
    } else {
      setEditedName("");
      setEditedAge("");
      setEditedGender("");
    }

    setShowEditModal(true);
  };

  const handleSavePassenger = () => {
    if (!editingBooking) return;

    if (!editedName.trim()) {
      toast.error("Please enter passenger name");
      return;
    }

    // Create or update passengerDetails array
    const updatedPassengerDetails = [
      ...(editingBooking.passengerDetails || []),
    ];

    // Ensure array has enough elements
    while (
      updatedPassengerDetails.length <= editingPassengerIndex
    ) {
      updatedPassengerDetails.push({
        name: "",
        age: "",
        gender: "",
      });
    }

    // Update the specific passenger
    updatedPassengerDetails[editingPassengerIndex] = {
      name: editedName.trim(),
      age: editedAge.trim(),
      gender: editedGender.trim(),
    };

    // Update the booking
    updateBooking(editingBooking.id, {
      ...editingBooking,
      passengerDetails: updatedPassengerDetails,
    });

    toast.success("✅ Passenger details updated!");
    setShowEditModal(false);
    setEditingBooking(null);
  };

  const handleEditFullTicket = (booking: any) => {
    setFullEditBooking(booking);
    setShowFullEditModal(true);

    // load values
    const firstPassenger = booking.passengerDetails?.[0] || {};
    setEditedName(firstPassenger.name || "");
    setEditedAge(String(firstPassenger.age || ""));
    setEditedGender(firstPassenger.gender || "");

    setEditedTrainName(booking.train || "");
    setEditedTrainNumber(booking.trainNumber || "");
    setEditedPNR(booking.pnr || "");
    setEditedCoach(booking.coach || "");
    setEditedPlatform(booking.platform || "");
    setEditedFrom(booking.fromStation || booking.from || "");
    setEditedTo(booking.toStation || booking.to || "");
    setEditedDate(booking.date || "");
    setEditedTime(booking.time || "");
    setEditedSeat(booking.seats?.[0] || "");
  };

  const handleSaveFullEdit = () => {
    if (!fullEditBooking) return;

    // Basic validation
    if (!editedName.trim()) {
      toast.error("Please enter passenger name");
      return;
    }

    const updatedBooking = {
      ...fullEditBooking,
      train: editedTrainName,
      trainNumber: editedTrainNumber,
      pnr: editedPNR,
      coach: editedCoach,
      platform: editedPlatform,
      fromStation: editedFrom,
      toStation: editedTo,
      date: editedDate,
      time: editedTime,
      seats: editedSeat ? [editedSeat] : fullEditBooking.seats,
      passengerDetails: [
        {
          name: editedName.trim(),
          age: editedAge.trim(),
          gender: editedGender.trim(),
        },
        // keep additional passengers if originally present beyond index 0
        ...(fullEditBooking.passengerDetails?.slice(1) || []),
      ],
    };

    updateBooking(fullEditBooking.id, updatedBooking);

    toast.success("Ticket updated successfully!");
    setShowFullEditModal(false);
    setFullEditBooking(null);
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (
      confirm("Are you sure you want to cancel this booking?")
    ) {
      deleteBooking(bookingId);
      toast.success("Booking cancelled successfully");
      addNotification({
        message: "Booking cancelled",
        read: false,
        type: "info",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2">My Trips</h2>
          <p className="text-muted-foreground">
            View and manage your train bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Train className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your journey by booking a train ticket
            </p>
            <Button
              onClick={() => setCurrentPage("home")}
              className="gradient-primary text-white"
            >
              Book a Train
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg gradient-primary text-white flex items-center justify-center">
                          <Train className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="mb-1">
                            {booking.train}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            #{booking.trainNumber} • PNR:{" "}
                            {booking.pnr}
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "Confirmed"
                              ? "default"
                              : "secondary"
                          }
                          className="ml-auto"
                        >
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Route
                            </p>
                            <p className="text-sm">
                              {booking.from} → {booking.to}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Journey Date
                            </p>
                            <p className="text-sm">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Booked On
                            </p>
                            <p className="text-sm">
                              {booking.bookingDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Seats
                          </p>
                          <p>{booking.seats?.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Coach
                          </p>
                          <p>{booking.coach}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Platform
                          </p>
                          <p>{booking.platform}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Amount Paid
                          </p>
                          <p>₹{booking.amount}</p>
                        </div>
                      </div>

                      {/* Passenger Details */}
                      {booking.passengerDetails &&
                        booking.passengerDetails.length > 0 && (
                          <>
                            <Separator className="my-4" />
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Passengers
                              </p>
                              <div className="space-y-2">
                                {booking.passengerDetails.map(
                                  (
                                    passenger: any,
                                    idx: number,
                                  ) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                                    >
                                      <span>
                                        {idx + 1}.{" "}
                                        {passenger.name ||
                                          "Passenger"}{" "}
                                        {passenger.age &&
                                          `(Age: ${passenger.age})`}{" "}
                                        {passenger.gender &&
                                          `- ${passenger.gender}`}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            handleEditPassenger(
                                              booking,
                                              idx,
                                            )
                                          }
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </>
                        )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownloadTicket(booking)
                        }
                        className="flex-1 lg:flex-none"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleTrackTrain(booking)
                        }
                        className="flex-1 lg:flex-none"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Track
                      </Button>

                      {/* NEW — Edit Full Ticket */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEditFullTicket(booking)
                        }
                        className="flex-1 lg:flex-none text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Ticket
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteBooking(booking.id)
                        }
                        className="flex-1 lg:flex-none text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Passenger Modal */}
      <Dialog
        open={showEditModal}
        onOpenChange={setShowEditModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Passenger Details</DialogTitle>
            <DialogDescription>
              Update passenger information for seat{" "}
              {editingBooking?.seats?.[editingPassengerIndex]}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">
                Passenger Name *
              </Label>
              <Input
                placeholder="Enter full name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Age</Label>
              <Input
                placeholder="Enter age"
                value={editedAge}
                onChange={(e) => setEditedAge(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">
                Gender
              </Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={editedGender}
                onChange={(e) =>
                  setEditedGender(e.target.value)
                }
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSavePassenger}
                className="flex-1 gradient-primary text-white"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FULL TICKET EDIT MODAL */}
      <Dialog
        open={showFullEditModal}
        onOpenChange={setShowFullEditModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Full Ticket</DialogTitle>
            <DialogDescription>
              Modify all details to make the ticket usable for
              another person.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {/* Passenger */}
            <Label>Passenger Name *</Label>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />

            <Label>Age</Label>
            <Input
              value={editedAge}
              onChange={(e) => setEditedAge(e.target.value)}
            />

            <Label>Gender</Label>
            <select
              className="w-full h-10 border rounded px-3"
              value={editedGender}
              onChange={(e) => setEditedGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <Label>Seat</Label>
            <Input
              value={editedSeat}
              onChange={(e) => setEditedSeat(e.target.value)}
            />

            <Separator className="my-3" />

            {/* Train Details */}
            <Label>Train Name</Label>
            <Input
              value={editedTrainName}
              onChange={(e) =>
                setEditedTrainName(e.target.value)
              }
            />

            <Label>Train Number</Label>
            <Input
              value={editedTrainNumber}
              onChange={(e) =>
                setEditedTrainNumber(e.target.value)
              }
            />

            <Label>PNR</Label>
            <Input
              value={editedPNR}
              onChange={(e) => setEditedPNR(e.target.value)}
            />

            <Label>Coach</Label>
            <Input
              value={editedCoach}
              onChange={(e) => setEditedCoach(e.target.value)}
            />

            <Label>Platform</Label>
            <Input
              value={editedPlatform}
              onChange={(e) =>
                setEditedPlatform(e.target.value)
              }
            />

            <Label>From Station</Label>
            <Input
              value={editedFrom}
              onChange={(e) => setEditedFrom(e.target.value)}
            />

            <Label>To Station</Label>
            <Input
              value={editedTo}
              onChange={(e) => setEditedTo(e.target.value)}
            />

            <Label>Journey Date</Label>
            <Input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
            />

            <Label>Departure Time</Label>
            <Input
              type="time"
              value={editedTime}
              onChange={(e) => setEditedTime(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <Button
                className="flex-1 gradient-primary text-white"
                onClick={handleSaveFullEdit}
              >
                Save Changes
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFullEditModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}