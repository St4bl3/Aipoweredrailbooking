import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Train,
  Clock,
  IndianRupee,
  Zap,
  Award,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Wallet,
  Bell,
  Share2,
  AlertTriangle,
  Download,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import confetti from "canvas-confetti";

interface BookingFlowProps {
  setCurrentPage: (page: string) => void;
}

interface Train {
  id: number;
  number: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  available: number;
  tags: string[];
}

interface Seat {
  id: string;
  type: string;
  occupied: boolean;
  bay?: number;
}

// Seeded random function for consistent occupied seats
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate realistic Indian train berth layouts based on class
const generateSeatLayout = (
  travelClass: string,
  numBays: number = 4,
): Seat[] => {
  const seats: Seat[] = [];
  let seedCounter = 12345; // Fixed seed for consistent occupied seats

  // Sleeper & 3AC: 8 berths per bay (LB, MB, UB x2 + SL, SU x2)
  if (
    travelClass.includes("Sleeper") ||
    travelClass.includes("3")
  ) {
    for (let bay = 1; bay <= numBays; bay++) {
      const baseNum = (bay - 1) * 8;
      // Inside bay - 2 stacks (A & B) with Lower, Middle, Upper
      seats.push(
        {
          id: `${baseNum + 1}`,
          type: "LB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 2}`,
          type: "MB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 3}`,
          type: "UB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 4}`,
          type: "LB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 5}`,
          type: "MB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 6}`,
          type: "UB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        // Side berths
        {
          id: `${baseNum + 7}`,
          type: "SL",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 8}`,
          type: "SU",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
      );
    }
  }
  // 2AC: 6 berths per bay (no middle berth)
  else if (travelClass.includes("2")) {
    for (let bay = 1; bay <= numBays; bay++) {
      const baseNum = (bay - 1) * 6;
      seats.push(
        {
          id: `${baseNum + 1}`,
          type: "LB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 2}`,
          type: "UB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 3}`,
          type: "LB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 4}`,
          type: "UB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 5}`,
          type: "SL",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 6}`,
          type: "SU",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
      );
    }
  }
  // 1AC: Cabin-based (2 & 4 berth cabins)
  else if (travelClass.includes("1")) {
    let seatNum = 1;
    // Create 2-berth coupes
    for (let cabin = 1; cabin <= 3; cabin++) {
      seats.push(
        {
          id: `C${cabin}-1`,
          type: `Cabin ${cabin} - Berth 1`,
          occupied: seededRandom(seedCounter++) > 0.7,
          bay: cabin,
        },
        {
          id: `C${cabin}-2`,
          type: `Cabin ${cabin} - Berth 2`,
          occupied: seededRandom(seedCounter++) > 0.7,
          bay: cabin,
        },
      );
    }
    // Create 4-berth cabins
    for (let cabin = 4; cabin <= 6; cabin++) {
      seats.push(
        {
          id: `C${cabin}-1`,
          type: `Cabin ${cabin} - Berth 1`,
          occupied: seededRandom(seedCounter++) > 0.7,
          bay: cabin,
        },
        {
          id: `C${cabin}-2`,
          type: `Cabin ${cabin} - Berth 2`,
          occupied: seededRandom(seedCounter++) > 0.7,
          bay: cabin,
        },
        {
          id: `C${cabin}-3`,
          type: `Cabin ${cabin} - Berth 3`,
          occupied: seededRandom(seedCounter++) > 0.7,
          bay: cabin,
        },
        {
          id: `C${cabin}-4`,
          type: `Cabin ${cabin} - Berth 4`,
          occupied: seededRandom(seedCounter++) > 0.7,
          bay: cabin,
        },
      );
    }
  }
  // Default/All Classes: Mixed layout
  else {
    for (let bay = 1; bay <= numBays; bay++) {
      const baseNum = (bay - 1) * 8;
      seats.push(
        {
          id: `${baseNum + 1}`,
          type: "LB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 2}`,
          type: "MB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 3}`,
          type: "UB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 4}`,
          type: "LB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 5}`,
          type: "MB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 6}`,
          type: "UB",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 7}`,
          type: "SL",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
        {
          id: `${baseNum + 8}`,
          type: "SU",
          occupied: seededRandom(seedCounter++) > 0.7,
          bay,
        },
      );
    }
  }

  return seats;
};

export function BookingFlow({
  setCurrentPage,
}: BookingFlowProps) {
  const { searchParams, addBooking, addNotification } =
    useApp();
  const [step, setStep] = useState(1);
  const [selectedTrain, setSelectedTrain] =
    useState<Train | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(
    [],
  );
  const [upiId, setUpiId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "upi" | "card" | "wallet"
  >("upi");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [passengerDetails, setPassengerDetails] = useState<
    Array<{ name: string; age: string; gender: string }>
  >(
    Array(searchParams.passengers)
      .fill(null)
      .map(() => ({
        name: "",
        age: "",
        gender: "",
      })),
  );
  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);
  const [bookingId, setBookingId] = useState("");

  const trains: Train[] = [
    {
      id: 1,
      number: "12345",
      name: "Rajdhani Express",
      departure: "06:00",
      arrival: "14:30",
      duration: "8h 30m",
      price: 2450,
      available: 42,
      tags: ["Fastest", "Most Comfortable"],
    },
    {
      id: 2,
      number: "12346",
      name: "Shatabdi Express",
      departure: "08:15",
      arrival: "17:00",
      duration: "8h 45m",
      price: 1890,
      available: 156,
      tags: ["Cheapest"],
    },
    {
      id: 3,
      number: "12347",
      name: "Duronto Express",
      departure: "10:30",
      arrival: "18:45",
      duration: "8h 15m",
      price: 2250,
      available: 23,
      tags: ["Fastest"],
    },
  ];

  const seatLayout: Seat[] = generateSeatLayout(
    searchParams.travelClass,
    4,
  );

  const progressValue = (step / 3) * 100;

  const handleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(
        selectedSeats.filter((s) => s !== seatId),
      );
    } else {
      if (selectedSeats.length < searchParams.passengers) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        toast.error(
          `You can only select ${searchParams.passengers} seat${searchParams.passengers > 1 ? "s" : ""} for ${searchParams.passengers} passenger${searchParams.passengers > 1 ? "s" : ""}`,
        );
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedTrain) {
        toast.error("Please select a train to continue");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedSeats.length !== searchParams.passengers) {
        toast.error(
          `Please select exactly ${searchParams.passengers} seat${searchParams.passengers > 1 ? "s" : ""} for ${searchParams.passengers} passenger${searchParams.passengers > 1 ? "s" : ""}`,
        );
        return;
      }
      setStep(3);
    }
  };

  const validateUpiId = (upi: string): boolean => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upi);
  };

  const handlePayment = () => {
    // Validate payment details
    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        toast.error("Please enter your UPI ID");
        return;
      }
      if (!validateUpiId(upiId)) {
        toast.error(
          "Please enter a valid UPI ID (e.g., name@upi)",
        );
        return;
      }
    }

    // Validate passenger details
    const allDetailsFilled = passengerDetails.every(
      (p) => p.name.trim() !== "",
    );
    if (!allDetailsFilled) {
      toast.error("Please enter all passenger names");
      return;
    }

    // Generate booking
    const newBookingId = `PNR${Date.now().toString().slice(-8)}`;
    setBookingId(newBookingId);

    const totalAmount = selectedTrain
      ? selectedTrain.price * searchParams.passengers
      : 0;

    const newBooking = {
      id: Date.now().toString(),
      pnr: newBookingId,
      train: selectedTrain!.name,
      trainNumber: selectedTrain!.number,
      // NEW — SAVE REAL STATIONS
      from:
        searchParams.fromStation ||
        searchParams.from ||
        "New Delhi",
      to:
        searchParams.toStation ||
        searchParams.to ||
        "Mumbai Central",

      // ALSO SAVE CITY SEPARATELY (needed for future)
      fromCity: searchParams.from || "",
      toCity: searchParams.to || "",

      // SAVE STATION EXPLICITLY
      fromStation: searchParams.fromStation || "",
      toStation: searchParams.toStation || "",

      date: searchParams.date,
      time: selectedTrain!.departure,
      seats: selectedSeats,
      passengers: searchParams.passengers,
      status: "Confirmed",
      platform: `Platform ${Math.floor(Math.random() * 10) + 1}`,
      coach: `A${Math.floor(Math.random() * 5) + 1}`,
      amount: totalAmount,
      bookingDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      passengerDetails: passengerDetails,
    };

    addBooking(newBooking);
    addNotification({
      message: `Booking confirmed! PNR: ${newBookingId} for ${selectedTrain!.name}`,
      read: false,
      type: "success",
    });

    // Show success animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    toast.success("Payment successful! 🎉");
    setBookingConfirmed(true);
  };

  const handleDownloadTicket = () => {
    if (!selectedTrain) return;

    const doc = new jsPDF();
    const baseAmount =
      selectedTrain.price * searchParams.passengers;
    const tax = Math.round(baseAmount * 0.05);
    const total = baseAmount + tax;

    // Draw border
    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    // IRCTC Logo area (top banner)
    doc.setFillColor(0, 51, 153);
    doc.rect(10, 10, 190, 25, "F");

    // Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("IRCTC 2.0", 105, 23, { align: "center" });
    doc.setFontSize(10);
    doc.text("SMART TRAVEL PLATFORM", 105, 30, {
      align: "center",
    });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Ticket title
    doc.setFontSize(18);
    doc.text("E-TICKET / RESERVATION SLIP", 105, 45, {
      align: "center",
    });

    // PNR section (highlighted)
    doc.setFillColor(240, 248, 255);
    doc.rect(15, 52, 180, 15, "F");
    doc.setFontSize(14);
    doc.text("PNR NUMBER:", 20, 61);
    doc.setFontSize(16);
    doc.text(bookingId, 70, 61);
    doc.setFontSize(10);
    doc.text(
      `Booking Date: ${new Date().toLocaleDateString("en-IN")}`,
      150,
      61,
    );

    // Journey Details Box
    doc.setFontSize(12);
    doc.text("JOURNEY DETAILS", 20, 77);
    doc.setLineWidth(0.5);
    doc.line(15, 79, 195, 79);

    doc.setFontSize(10);
    doc.text("Train Number:", 20, 88);
    doc.text(selectedTrain.number, 60, 88);

    doc.text("Train Name:", 120, 88);
    doc.text(selectedTrain.name, 155, 88);

    doc.text("From:", 20, 98);
    doc.setFontSize(11);
    doc.text(searchParams.from || "New Delhi", 60, 98);

    doc.setFontSize(10);
    doc.text("To:", 120, 98);
    doc.setFontSize(11);
    doc.text(searchParams.to || "Mumbai Central", 155, 98);

    doc.setFontSize(10);
    doc.text("Date of Journey:", 20, 108);
    doc.text(
      new Date(searchParams.date).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      60,
      108,
    );

    doc.text("Departure Time:", 120, 108);
    doc.text(selectedTrain.departure, 165, 108);

    doc.text("Class:", 20, 118);
    doc.text(searchParams.travelClass, 60, 118);

    doc.text("Duration:", 120, 118);
    doc.text(selectedTrain.duration, 165, 118);

    // Passenger Details Box
    doc.setFontSize(12);
    doc.text("PASSENGER DETAILS", 20, 133);
    doc.line(15, 135, 195, 135);

    // Table headers
    doc.setFontSize(10);
    doc.text("S.No", 20, 143);
    doc.text("Passenger Name", 35, 143);
    doc.text("Age", 95, 143);
    doc.text("Gender", 115, 143);
    doc.text("Seat/Berth", 145, 143);
    doc.text("Status", 175, 143);
    doc.line(15, 145, 195, 145);

    // Passenger rows
    passengerDetails.forEach((passenger, idx) => {
      const yPos = 153 + idx * 8;
      doc.text(`${idx + 1}`, 20, yPos);
      doc.text(
        passenger.name || `Passenger ${idx + 1}`,
        35,
        yPos,
      );
      doc.text(passenger.age || "-", 95, yPos);
      doc.text(passenger.gender || "-", 115, yPos);
      doc.text(selectedSeats[idx], 145, yPos);
      doc.text("CNF", 175, yPos);
    });

    const fareYStart = 153 + passengerDetails.length * 8 + 10;

    // Fare Details Box
    doc.setFontSize(12);
    doc.text("FARE DETAILS", 20, fareYStart);
    doc.line(15, fareYStart + 2, 195, fareYStart + 2);

    doc.setFontSize(10);
    doc.text("Base Fare:", 20, fareYStart + 12);
    doc.text(`₹ ${baseAmount}`, 80, fareYStart + 12);

    doc.text("GST (5%):", 20, fareYStart + 20);
    doc.text(`₹ ${tax}`, 80, fareYStart + 20);

    doc.line(15, fareYStart + 23, 100, fareYStart + 23);
    doc.setFontSize(12);
    doc.text("TOTAL FARE:", 20, fareYStart + 31);
    doc.text(`₹ ${total}`, 80, fareYStart + 31);

    // QR Code area
    doc.setFillColor(245, 245, 245);
    doc.rect(120, fareYStart + 8, 70, 35, "F");
    doc.setFontSize(9);
    doc.text("QR CODE", 155, fareYStart + 14, {
      align: "center",
    });
    doc.setFontSize(8);
    doc.text("Scan for verification", 155, fareYStart + 19, {
      align: "center",
    });

    // Draw QR code placeholder pattern
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (Math.random() > 0.5) {
          doc.rect(
            125 + i * 4,
            fareYStart + 22 + j * 2.5,
            3,
            2.5,
            "F",
          );
        }
      }
    }
    doc.text(bookingId, 155, fareYStart + 40, {
      align: "center",
    });

    // Important Instructions
    const instructYStart = fareYStart + 50;
    doc.setFontSize(11);
    doc.text("IMPORTANT INSTRUCTIONS:", 20, instructYStart);
    doc.setFontSize(9);
    doc.text(
      "• Carry a valid photo ID proof during journey (Aadhaar, Passport, Driving License, etc.)",
      20,
      instructYStart + 7,
    );
    doc.text(
      "• Arrive at the station at least 20 minutes before departure",
      20,
      instructYStart + 13,
    );
    doc.text(
      "• This is an electronic ticket. No need to carry a physical printout",
      20,
      instructYStart + 19,
    );
    doc.text(
      "• For any queries or support, contact: support@irctc2.0.com | Helpline: 139",
      20,
      instructYStart + 25,
    );

    // Footer
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 270, 190, 17, "F");
    doc.setFontSize(8);
    doc.text(
      "Generated by IRCTC 2.0 Smart Travel Platform",
      105,
      278,
      { align: "center" },
    );
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      105,
      283,
      { align: "center" },
    );

    doc.save(`IRCTC_Ticket_${bookingId}.pdf`);
    toast.success("🎫 Ticket downloaded successfully!");
  };

  const handleSetReminder = () => {
    addNotification({
      message: `Arrival reminder set for ${selectedTrain?.name} - 30 mins before arrival`,
      read: false,
      type: "info",
    });
    toast.success(
      "⏰ Arrival reminder set for 30 mins before arrival!",
    );
  };

  const handleShareLocation = () => {
    setShowShareModal(true);
  };

  const handleCopyShareLink = () => {
    const shareLink = `https://irctc2.0/share/live/${bookingId}`;

    // Try clipboard API with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareLink).then(
        () => {
          toast.success(
            "📍 Location link copied to clipboard!",
          );
          addNotification({
            message: "Live location shared with family",
            read: false,
            type: "success",
          });
        },
        (err) => {
          // Fallback to manual copy
          console.warn(
            "Clipboard API failed, using fallback",
            err,
          );
          fallbackCopyText(shareLink);
          toast.success("📍 Location link ready to copy!");
          addNotification({
            message: "Live location shared with family",
            read: false,
            type: "success",
          });
        },
      );
    } else {
      // Fallback for browsers without clipboard API
      fallbackCopyText(shareLink);
      toast.success("📍 Location link ready to copy!");
      addNotification({
        message: "Live location shared with family",
        read: false,
        type: "success",
      });
    }
  };

  // Fallback copy method
  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  const handleReportIssue = () => {
    setShowIssueModal(true);
  };

  const handleSubmitIssue = () => {
    if (!issueDescription.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    addNotification({
      message: `Issue reported: "${issueDescription.substring(0, 50)}..." - Support team will contact you soon`,
      read: false,
      type: "warning",
    });
    toast.success(
      "🚨 Issue reported successfully! Support team will assist you shortly.",
    );
    setShowIssueModal(false);
    setIssueDescription("");
  };

  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() =>
                step === 1
                  ? setCurrentPage("home")
                  : setStep(step - 1)
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {step} of 3
            </span>
          </div>

          <Progress value={progressValue} className="h-2" />

          <div className="flex justify-between mt-2 text-sm">
            <span
              className={
                step >= 1
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              Select Train
            </span>
            <span
              className={
                step >= 2
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              Choose Seats
            </span>
            <span
              className={
                step >= 3
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              Payment
            </span>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Train Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h4 className="mb-2">
                      {searchParams.from || "New Delhi"} →{" "}
                      {searchParams.to || "Mumbai Central"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {searchParams.date} •{" "}
                      {searchParams.travelClass} •{" "}
                      {searchParams.passengers} Passenger
                      {searchParams.passengers > 1 ? "s" : ""}
                    </p>
                  </div>
                  {searchParams.tatkalEnabled && (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 border-0">
                      <Zap className="mr-1 h-3 w-3" />
                      Tatkal Booking
                    </Badge>
                  )}
                </div>
              </Card>

              <div className="space-y-4">
                {trains.map((train) => (
                  <Card
                    key={train.id}
                    onClick={() => setSelectedTrain(train)}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTrain?.id === train.id
                        ? "border-2 border-[#003399] bg-blue-50/50 dark:bg-blue-950/30"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg gradient-primary text-white flex items-center justify-center">
                          <Train className="h-6 w-6" />
                        </div>
                        <div>
                          <h5>{train.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            #{train.number}
                          </p>
                          <div className="flex gap-2 mt-1">
                            {train.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Departure
                          </p>
                          <p>{train.departure}</p>
                        </div>
                        <div className="text-center">
                          <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                          <p className="text-sm">
                            {train.duration}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Arrival
                          </p>
                          <p>{train.arrival}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Per Person
                        </p>
                        <p className="text-2xl">
                          ₹{train.price}
                        </p>
                        <Badge
                          variant={
                            train.available > 50
                              ? "default"
                              : "destructive"
                          }
                          className="mt-1"
                        >
                          {train.available} seats left
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNext}
                  disabled={!selectedTrain}
                  className="gradient-primary text-white border-0"
                >
                  Continue{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Seat Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-6 mb-6">
                <h4 className="mb-4">Choose Your Seats</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Select {searchParams.passengers} seat
                  {searchParams.passengers > 1
                    ? "s"
                    : ""} for {searchParams.passengers}{" "}
                  passenger
                  {searchParams.passengers > 1 ? "s" : ""}
                  {selectedSeats.length > 0 && (
                    <span className="ml-2 text-foreground">
                      ({selectedSeats.length}/
                      {searchParams.passengers} selected)
                    </span>
                  )}
                </p>

                {/* Realistic Indian Train Berth Layout */}
                {searchParams.travelClass.includes("1") ? (
                  // 1AC Cabin Layout
                  <div className="space-y-6 mb-6">
                    <h5 className="text-sm font-semibold text-muted-foreground">
                      Private Cabins
                    </h5>
                    {Array.from(
                      new Set(seatLayout.map((s) => s.bay)),
                    ).map((cabinNum) => {
                      const cabinSeats = seatLayout.filter(
                        (s) => s.bay === cabinNum,
                      );
                      const is2Berth = cabinSeats.length === 2;
                      return (
                        <div
                          key={cabinNum}
                          className="border-2 border-dashed border-border rounded-lg p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-semibold text-sm">
                              Cabin {cabinNum} (
                              {is2Berth
                                ? "2-Berth Coupe"
                                : "4-Berth Cabin"}
                              )
                            </h6>
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              1AC Premium
                            </Badge>
                          </div>
                          <div
                            className={`grid ${is2Berth ? "grid-cols-2" : "grid-cols-4"} gap-3`}
                          >
                            {cabinSeats.map((seat) => {
                              const isOccupied = seat.occupied;
                              const isSelected =
                                selectedSeats.includes(seat.id);
                              return (
                                <div
                                  key={seat.id}
                                  style={{
                                    backgroundColor: isOccupied
                                      ? "rgb(254, 202, 202)" // light red
                                      : isSelected
                                        ? "rgb(191, 219, 254)" // light blue
                                        : "rgb(220, 252, 231)", // light green
                                    opacity: isOccupied
                                      ? 0.6
                                      : 1,
                                    cursor: isOccupied
                                      ? "not-allowed"
                                      : "pointer",
                                  }}
                                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all min-h-[80px] hover:shadow-md hover:scale-105 ${
                                    isOccupied
                                      ? "border-red-400 dark:border-red-600"
                                      : isSelected
                                        ? "border-blue-600 dark:border-blue-400"
                                        : "border-green-500 dark:border-green-400"
                                  }`}
                                  onClick={() =>
                                    !seat.occupied &&
                                    handleSeatSelection(seat.id)
                                  }
                                >
                                  <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                    {seat.id}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {seat.type}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Sleeper / 2AC / 3AC Bay Layout
                  <div className="space-y-8 mb-6">
                    {Array.from(
                      new Set(seatLayout.map((s) => s.bay)),
                    ).map((bayNum) => {
                      const baySeats = seatLayout.filter(
                        (s) => s.bay === bayNum,
                      );
                      const mainBerths = baySeats.filter(
                        (s) =>
                          s.type === "LB" ||
                          s.type === "MB" ||
                          s.type === "UB",
                      );
                      const sideBerths = baySeats.filter(
                        (s) =>
                          s.type === "SL" || s.type === "SU",
                      );

                      return (
                        <div
                          key={bayNum}
                          className="border-2 border-border rounded-xl p-4 bg-white dark:from-slate-900 dark:to-blue-950/30"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="font-semibold">
                              Bay {bayNum}
                            </h6>
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {searchParams.travelClass}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-12 gap-3">
                            {/* LEFT SIDE: Main Berths (Inside Bay) */}
                            <div className="col-span-8 border-r-2 border-dashed border-muted-foreground/30 pr-3">
                              <p className="text-xs text-muted-foreground mb-2 font-semibold">
                                INSIDE BAY (Main Berths)
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                {/* Stack A */}
                                <div className="space-y-2">
                                  <p className="text-xs text-center text-muted-foreground mb-1">
                                    Stack A
                                  </p>
                                  {mainBerths
                                    .slice(
                                      0,
                                      searchParams.travelClass.includes(
                                        "2",
                                      )
                                        ? 2
                                        : 3,
                                    )
                                    .map((seat) => {
                                      const isOccupied =
                                        seat.occupied;
                                      const isSelected =
                                        selectedSeats.includes(
                                          seat.id,
                                        );
                                      return (
                                        <div
                                          key={seat.id}
                                          style={{
                                            backgroundColor:
                                              isOccupied
                                                ? "rgb(254, 202, 202)"
                                                : isSelected
                                                  ? "rgb(191, 219, 254)"
                                                  : "rgb(220, 252, 231)",
                                            opacity: isOccupied
                                              ? 0.6
                                              : 1,
                                            cursor: isOccupied
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          className={`p-3 border-2 rounded-lg flex items-center justify-between transition-all hover:shadow-md hover:scale-105 ${
                                            isOccupied
                                              ? "border-red-400 dark:border-red-600"
                                              : isSelected
                                                ? "border-blue-600 dark:border-blue-400"
                                                : "border-green-500 dark:border-green-400"
                                          }`}
                                          onClick={() =>
                                            !seat.occupied &&
                                            handleSeatSelection(
                                              seat.id,
                                            )
                                          }
                                        >
                                          <div>
                                            <p className="font-bold text-black">
                                              {seat.id}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                              {seat.type}
                                            </p>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-[10px] border-gray-400 dark:border-gray-500 text-black"
                                          >
                                            {seat.type}
                                          </Badge>
                                        </div>
                                      );
                                    })}
                                </div>

                                {/* Stack B */}
                                <div className="space-y-2">
                                  <p className="text-xs text-center text-muted-foreground mb-1">
                                    Stack B
                                  </p>
                                  {mainBerths
                                    .slice(
                                      searchParams.travelClass.includes(
                                        "2",
                                      )
                                        ? 2
                                        : 3,
                                    )
                                    .map((seat) => {
                                      const isOccupied =
                                        seat.occupied;
                                      const isSelected =
                                        selectedSeats.includes(
                                          seat.id,
                                        );
                                      return (
                                        <div
                                          key={seat.id}
                                          style={{
                                            backgroundColor:
                                              isOccupied
                                                ? "rgb(254, 202, 202)"
                                                : isSelected
                                                  ? "rgb(191, 219, 254)"
                                                  : "rgb(220, 252, 231)",
                                            opacity: isOccupied
                                              ? 0.6
                                              : 1,
                                            cursor: isOccupied
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          className={`p-3 border-2 rounded-lg flex items-center justify-between transition-all hover:shadow-md hover:scale-105 ${
                                            isOccupied
                                              ? "border-red-400 dark:border-red-600"
                                              : isSelected
                                                ? "border-blue-600 dark:border-blue-400"
                                                : "border-green-500 dark:border-green-400"
                                          }`}
                                          onClick={() =>
                                            !seat.occupied &&
                                            handleSeatSelection(
                                              seat.id,
                                            )
                                          }
                                        >
                                          <div>
                                            <p className="font-bold text-black">
                                              {seat.id}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                              {seat.type}
                                            </p>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-[10px] border-gray-400 dark:border-gray-500 text-black"
                                          >
                                            {seat.type}
                                          </Badge>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT SIDE: Side Berths */}
                            <div className="col-span-4">
                              <p className="text-xs text-muted-foreground mb-2 font-semibold">
                                SIDE BERTHS
                              </p>
                              <div className="space-y-3">
                                {sideBerths.map((seat) => {
                                  const isOccupied =
                                    seat.occupied;
                                  const isSelected =
                                    selectedSeats.includes(
                                      seat.id,
                                    );
                                  return (
                                    <div
                                      key={seat.id}
                                      style={{
                                        backgroundColor:
                                          isOccupied
                                            ? "rgb(254, 202, 202)"
                                            : isSelected
                                              ? "rgb(191, 219, 254)"
                                              : "rgb(220, 252, 231)",
                                        opacity: isOccupied
                                          ? 0.6
                                          : 1,
                                        cursor: isOccupied
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                      className={`p-3 border-2 rounded-lg flex items-center justify-between transition-all hover:shadow-md hover:scale-105 ${
                                        isOccupied
                                          ? "border-red-400 dark:border-red-600"
                                          : isSelected
                                            ? "border-blue-600 dark:border-blue-400"
                                            : "border-green-500 dark:border-green-400"
                                      }`}
                                      onClick={() =>
                                        !seat.occupied &&
                                        handleSeatSelection(
                                          seat.id,
                                        )
                                      }
                                    >
                                      <div>
                                        <p className="font-bold text-black">
                                          {seat.id}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                          {seat.type}
                                        </p>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] border-gray-400 dark:border-gray-500 text-black"
                                      >
                                        {seat.type}
                                      </Badge>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded"
                      style={{
                        backgroundColor: "rgb(220, 252, 231)",
                      }}
                    ></div>
                    <span className="text-muted-foreground">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 rounded"
                      style={{
                        backgroundColor: "rgb(191, 219, 254)",
                      }}
                    ></div>
                    <span className="text-muted-foreground">
                      Selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-red-400 dark:border-red-600 rounded"
                      style={{
                        backgroundColor: "rgb(254, 202, 202)",
                      }}
                    ></div>
                    <span className="text-muted-foreground">
                      Occupied
                    </span>
                  </div>
                  <div className="ml-auto">
                    <Badge className="text-xs">
                      Total Berths: {seatLayout.length}
                    </Badge>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={
                    selectedSeats.length !==
                    searchParams.passengers
                  }
                  className="gradient-primary text-white border-0"
                >
                  Continue to Payment{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && !bookingConfirmed && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Passenger Details */}
                  <Card className="p-6">
                    <h4 className="mb-4">Passenger Details</h4>
                    <div className="space-y-6">
                      {passengerDetails.map(
                        (passenger, idx) => (
                          <div
                            key={idx}
                            className="space-y-3 p-4 border rounded-lg"
                          >
                            <Label className="text-sm mb-2 block font-semibold">
                              Passenger {idx + 1} - Seat{" "}
                              {selectedSeats[idx]}
                            </Label>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Name *
                              </Label>
                              <Input
                                placeholder="Enter full name"
                                value={passenger.name}
                                onChange={(e) => {
                                  const newDetails = [
                                    ...passengerDetails,
                                  ];
                                  newDetails[idx].name =
                                    e.target.value;
                                  setPassengerDetails(
                                    newDetails,
                                  );
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Age
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Age"
                                  value={passenger.age}
                                  onChange={(e) => {
                                    const newDetails = [
                                      ...passengerDetails,
                                    ];
                                    newDetails[idx].age =
                                      e.target.value;
                                    setPassengerDetails(
                                      newDetails,
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Gender
                                </Label>
                                <select
                                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                  value={passenger.gender}
                                  onChange={(e) => {
                                    const newDetails = [
                                      ...passengerDetails,
                                    ];
                                    newDetails[idx].gender =
                                      e.target.value;
                                    setPassengerDetails(
                                      newDetails,
                                    );
                                  }}
                                >
                                  <option value="">
                                    Select
                                  </option>
                                  <option value="Male">
                                    Male
                                  </option>
                                  <option value="Female">
                                    Female
                                  </option>
                                  <option value="Other">
                                    Other
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </Card>

                  {/* Payment Method */}
                  <Card className="p-6">
                    <h4 className="mb-4">Payment Method</h4>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <button
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === "upi"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-blue-300"
                        }`}
                      >
                        <Smartphone className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">UPI</p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === "card"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-blue-300"
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">Card</p>
                      </button>
                      <button
                        onClick={() =>
                          setPaymentMethod("wallet")
                        }
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === "wallet"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-blue-300"
                        }`}
                      >
                        <Wallet className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">Wallet</p>
                      </button>
                    </div>

                    {paymentMethod === "upi" && (
                      <div>
                        <Label className="text-sm mb-2 block">
                          UPI ID
                        </Label>
                        <Input
                          placeholder="Enter your UPI ID (e.g., name@upi)"
                          value={upiId}
                          onChange={(e) =>
                            setUpiId(e.target.value)
                          }
                          className="mb-2"
                        />
                        {upiId && !validateUpiId(upiId) && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Please enter a valid UPI ID
                          </p>
                        )}
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">
                            Card Number
                          </Label>
                          <Input placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm mb-2 block">
                              Expiry
                            </Label>
                            <Input placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label className="text-sm mb-2 block">
                              CVV
                            </Label>
                            <Input
                              placeholder="123"
                              type="password"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "wallet" && (
                      <div>
                        <Label className="text-sm mb-2 block">
                          Select Wallet
                        </Label>
                        <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                          <option>Paytm</option>
                          <option>PhonePe</option>
                          <option>Google Pay</option>
                          <option>Amazon Pay</option>
                        </select>
                      </div>
                    )}

                    <Button
                      onClick={handlePayment}
                      className="w-full gradient-primary text-white mt-6"
                    >
                      Pay ₹
                      {selectedTrain
                        ? (() => {
                            const baseFare =
                              selectedTrain.price *
                              searchParams.passengers;
                            const discount =
                              searchParams.passengers === 6
                                ? Math.round(baseFare * 0.15)
                                : 0;
                            const gst = Math.round(
                              baseFare * 0.05,
                            );
                            return baseFare - discount + gst;
                          })()
                        : 0}
                    </Button>
                  </Card>
                </div>

                {/* Booking Summary */}
                <Card className="p-6 h-fit">
                  <h5 className="mb-4">Booking Summary</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        Train
                      </p>
                      <p>{selectedTrain?.name}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">
                        Route
                      </p>
                      <p className="text-xs">
                        {searchParams.from || "New Delhi"} →{" "}
                        {searchParams.to || "Mumbai Central"}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">
                        Date & Time
                      </p>
                      <p className="text-xs">
                        {searchParams.date} at{" "}
                        {selectedTrain?.departure}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">
                        Passengers
                      </p>
                      <p>{searchParams.passengers}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">
                        Seats
                      </p>
                      <p className="text-xs">
                        {selectedSeats.join(", ")}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">
                        Base Fare
                      </p>
                      <p>
                        ₹
                        {selectedTrain
                          ? selectedTrain.price *
                            searchParams.passengers
                          : 0}
                      </p>
                    </div>
                    {searchParams.passengers === 6 && (
                      <div>
                        <p className="text-green-600 dark:text-green-400">
                          6-Ticket Discount (15%)
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          -₹
                          {selectedTrain
                            ? Math.round(
                                selectedTrain.price *
                                  searchParams.passengers *
                                  0.15,
                              )
                            : 0}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">
                        GST (5%)
                      </p>
                      <p>
                        ₹
                        {selectedTrain
                          ? Math.round(
                              selectedTrain.price *
                                searchParams.passengers *
                                0.05,
                            )
                          : 0}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p>Total Amount</p>
                      <p className="text-xl">
                        ₹
                        {selectedTrain
                          ? (() => {
                              const baseFare =
                                selectedTrain.price *
                                searchParams.passengers;
                              const discount =
                                searchParams.passengers === 6
                                  ? Math.round(baseFare * 0.15)
                                  : 0;
                              const gst = Math.round(
                                baseFare * 0.05,
                              );
                              return baseFare - discount + gst;
                            })()
                          : 0}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Booking Confirmation */}
          {bookingConfirmed && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your ticket has been booked successfully
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    PNR Number
                  </p>
                  <p className="text-3xl mb-4">{bookingId}</p>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        Train
                      </p>
                      <p>{selectedTrain?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Date
                      </p>
                      <p>{searchParams.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Seats
                      </p>
                      <p>{selectedSeats.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Passengers
                      </p>
                      <p>{searchParams.passengers}</p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <Button
                    onClick={handleDownloadTicket}
                    className="gradient-primary text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Ticket
                  </Button>
                  <Button
                    onClick={() => setCurrentPage("dashboard")}
                    variant="outline"
                  >
                    View in Dashboard
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h5 className="mb-4">Quick Actions</h5>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSetReminder}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Set Arrival Reminder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShareLocation}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Location
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReportIssue}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report Issue
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Location Modal */}
      <Dialog
        open={showShareModal}
        onOpenChange={setShowShareModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Live Location</DialogTitle>
            <DialogDescription>
              Share your journey with family and friends
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <Share2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Your live location will be shared for the
                duration of the journey
              </p>
              <div className="bg-background border rounded-lg p-3 text-sm break-all">
                https://irctc2.0/share/live/{bookingId}
              </div>
            </div>
            <Button
              onClick={handleCopyShareLink}
              className="w-full"
            >
              Copy Share Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Issue Modal */}
      <Dialog
        open={showIssueModal}
        onOpenChange={setShowIssueModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Describe the problem you're facing and our support
              team will assist you
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">
                Issue Description
              </Label>
              <textarea
                className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background resize-none"
                placeholder="Please describe the issue in detail..."
                value={issueDescription}
                onChange={(e) =>
                  setIssueDescription(e.target.value)
                }
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSubmitIssue}
                className="flex-1 gradient-primary text-white"
              >
                Submit Report
              </Button>
              <Button
                onClick={() => setShowIssueModal(false)}
                variant="outline"
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