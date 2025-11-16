// ChatbotOverlay.tsx (full updated)
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Sparkles,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext"; // <-- use context

type Message = {
  id: number;
  type: "bot" | "user";
  text: string;
  time: string;
};

export function ChatbotOverlay() {
  const { addBooking, addNotification, setSearchParams } =
    useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      type: "bot",
      text: "Hi! I'm your AI travel assistant. Try 'Book a Ticket' to get started.",
      time: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messageIdCounter = useRef(0); // Use ref for counter

  // Booking flow state:
  const [flow, setFlow] = useState<null | {
    name: "booking";
    step:
      | "from"
      | "to"
      | "date"
      | "class"
      | "passengers"
      | "confirm";
    data: {
      from?: string;
      to?: string;
      date?: string;
      travelClass?: string;
      passengers?: number;
      tatkal?: boolean;
    };
  }>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen)
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, []);

  // helper to push messages
  function pushBot(text: string) {
    setMessages((m) => {
      const newId = Date.now() + messageIdCounter.current; // Make IDs unique
      messageIdCounter.current += 1;
      return [
        ...m,
        { id: newId, type: "bot", text, time: "Just now" },
      ];
    });
  }
  function pushUser(text: string) {
    setMessages((m) => {
      const newId = Date.now() + messageIdCounter.current; // Make IDs unique
      messageIdCounter.current += 1;
      return [
        ...m,
        { id: newId, type: "user", text, time: "Just now" },
      ];
    });
  }

  // Basic intent detection: if user writes "book", start booking flow
  function handleSend() {
    const txt = inputValue.trim();
    if (!txt) return;
    pushUser(txt);

    // quick intent detection
    const lower = txt.toLowerCase();
    if (lower.includes("book") || lower.includes("ticket")) {
      startBookingFlow();
    } else if (flow?.name === "booking") {
      // if in booking flow, process the answer for the active step
      handleFlowInput(txt);
    } else {
      // fallback: echo + helpful prompt
      setTimeout(() => {
        pushBot(
          "I didn't quite understand that. You can say 'Book a Ticket' to start booking or choose a quick action.",
        );
      }, 400);
    }

    setInputValue("");
  }

  // Start booking
  function startBookingFlow() {
    pushBot(
      "Sure — let's book a ticket. Where are you travelling from? (type station name)",
    );
    setFlow({
      name: "booking",
      step: "from",
      data: {
        tatkal: false,
        passengers: 1,
        travelClass: "All Classes",
      },
    });
  }

  // Handle user input while in booking flow
  function handleFlowInput(txt: string) {
    if (!flow || flow.name !== "booking") return;
    const f = { ...flow };
    const d = { ...f.data };

    const step = f.step;

    // Valid station names
    const validStations = [
      "New Delhi",
      "Mumbai Central",
      "Chennai Central",
      "Kolkata",
      "Bangalore",
      "Hyderabad",
      "Pune",
      "Ahmedabad",
      "Jaipur",
      "Lucknow",
      "Chandigarh",
      "Goa",
      "Agra",
      "Varanasi",
      "Amritsar",
      "Bhopal",
      "Indore",
      "Nagpur",
      "Surat",
      "Kochi"
    ];

    // Helper function to find similar station names
    const findSimilarStations = (input: string) => {
      const inputLower = input.toLowerCase();
      return validStations.filter(station => 
        station.toLowerCase().includes(inputLower) || 
        inputLower.includes(station.toLowerCase())
      ).slice(0, 3);
    };

    // Helper function to validate station
    const isValidStation = (input: string) => {
      return validStations.some(station => 
        station.toLowerCase() === input.toLowerCase()
      );
    };

    if (step === "from") {
      if (!isValidStation(txt)) {
        const suggestions = findSimilarStations(txt);
        if (suggestions.length > 0) {
          pushBot(
            `❌ Invalid station name. Did you mean: ${suggestions.join(", ")}? Please enter a valid station name.`
          );
        } else {
          pushBot(
            `❌ Invalid station name. Please enter a valid station from: New Delhi, Mumbai Central, Chennai Central, Kolkata, Bangalore, Hyderabad, etc.`
          );
        }
        return;
      }
      d.from = txt;
      f.step = "to";
      setFlow({ ...f, data: d });
      pushBot("Got it — destination?");
      return;
    }
    if (step === "to") {
      if (!isValidStation(txt)) {
        const suggestions = findSimilarStations(txt);
        if (suggestions.length > 0) {
          pushBot(
            `❌ Invalid station name. Did you mean: ${suggestions.join(", ")}? Please enter a valid station name.`
          );
        } else {
          pushBot(
            `❌ Invalid station name. Please enter a valid station from: New Delhi, Mumbai Central, Chennai Central, Kolkata, Bangalore, Hyderabad, etc.`
          );
        }
        return;
      }
      d.to = txt;
      // basic check
      if (
        d.from &&
        d.to &&
        d.from.toLowerCase() === d.to.toLowerCase()
      ) {
        pushBot(
          "Departure and destination cannot be the same. Please give a different destination.",
        );
        return;
      }
      f.step = "date";
      setFlow({ ...f, data: d });
      pushBot(
        "Which date would you like to travel? (YYYY-MM-DD). If you want Tatkal, say 'tatkal' instead of a date.",
      );
      return;
    }
    if (step === "date") {
      // allow 'tatkal' keyword
      if (txt.toLowerCase().includes("tatkal")) {
        d.tatkal = true;
        // set date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        d.date = tomorrow.toISOString().split("T")[0];
        f.step = "class";
        setFlow({ ...f, data: d });
        pushBot(
          `Tatkal selected — date auto-set to ${d.date}. Which class? (eg. Sleeper, AC 3-Tier)`,
        );
        return;
      }
      // validate date quick regex
      const ok = /^\d{4}-\d{2}-\d{2}$/.test(txt);
      if (!ok) {
        pushBot(
          "Please send date as YYYY-MM-DD, or type 'tatkal' if you want Tatkal.",
        );
        return;
      }
      d.date = txt;
      f.step = "class";
      setFlow({ ...f, data: d });
      pushBot(
        "Which class do you prefer? (All Classes / AC 1st Class / AC 2-Tier / AC 3-Tier / Sleeper)",
      );
      return;
    }
    if (step === "class") {
      d.travelClass = txt;
      f.step = "passengers";
      setFlow({ ...f, data: d });
      pushBot("How many passengers? (1–6)");
      return;
    }
    if (step === "passengers") {
      const n = parseInt(txt, 10);
      if (isNaN(n) || n < 1 || n > 6) {
        pushBot("Please enter a number between 1 and 6.");
        return;
      }
      d.passengers = n;
      f.step = "confirm";
      setFlow({ ...f, data: d });
      pushBot(
        `Please confirm: ${d.from} → ${d.to} on ${d.date}, ${d.travelClass}, ${d.passengers} passenger(s). Reply 'confirm' to book or 'cancel' to abort.`,
      );
      return;
    }
    if (step === "confirm") {
      if (txt.toLowerCase().startsWith("confirm")) {
        // create booking
        const booking = {
          id: `BKG_${Date.now()}`,
          from: d.from!,
          to: d.to!,
          date: d.date!,
          travelClass: d.travelClass || "All Classes",
          passengers: d.passengers || 1,
          tatkal: !!d.tatkal,
          createdAt: new Date().toISOString(),
          status: "confirmed" as const,
        };
        // call context fn
        addBooking(booking);
        // also set search params (optional): navigates to booking page if you want
        setSearchParams?.({
          from: booking.from,
          to: booking.to,
          date: booking.date,
          travelClass: booking.travelClass,
          passengers: booking.passengers,
          tatkalEnabled: booking.tatkal,
        });

        pushBot(
          `✅ Booking confirmed! Reference ${booking.id}. I've added it to your My Bookings and notified you.`,
        );
        setFlow(null);
        return;
      } else if (txt.toLowerCase().startsWith("cancel")) {
        pushBot(
          "Booking flow cancelled. If you want to start again, say 'Book a Ticket'.",
        );
        setFlow(null);
        return;
      } else {
        pushBot(
          "Reply 'confirm' to finish booking or 'cancel' to stop.",
        );
        return;
      }
    }
  }

  // quick action handler (if you planned quick buttons)
  function handleQuickAction(action: string) {
    pushUser(action);
    if (action.toLowerCase().includes("book")) {
      startBookingFlow();
    } else {
      pushBot(
        "I'll help with that — please provide more details.",
      );
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              className="w-16 h-16 rounded-full gradient-primary text-white border-0 shadow-2xl"
              onClick={() => setIsOpen(true)}
              aria-label="Open chat"
            >
              <MessageCircle className="h-7 w-7" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
          >
            <Card
              className="flex flex-col h-[600px] shadow-2xl overflow-hidden"
            >
              {/* header */}
              <div className="gradient-primary text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-white">
                      AI Travel Assistant
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/80">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-card text-foreground">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mb-3 flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.type === "user" ? "gradient-primary text-white" : "bg-card text-foreground border border-border"}`}
                    >
                      <div className="text-sm">{m.text}</div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {m.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* input */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={
                      flow
                        ? "Answer the question..."
                        : "Type a message (e.g. 'Book a Ticket')"
                    }
                    value={inputValue}
                    onChange={(e) =>
                      setInputValue(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    className="gradient-primary text-white"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                  <div>
                    Quick actions:{" "}
                    <button
                      className="underline"
                      onClick={() =>
                        handleQuickAction("Book a Ticket")
                      }
                    >
                      Book a Ticket
                    </button>
                  </div>
                  <div>Powered by AI</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
