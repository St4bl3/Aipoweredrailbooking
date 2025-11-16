import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Calendar,
  Users,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  RefreshCw,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const stations = [
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
  "Kochi",
];

const cityStations: { [key: string]: Array<{ name: string; code: string }> } = {
  "New Delhi": [
    { name: "New Delhi", code: "NDLS" },
    { name: "Old Delhi", code: "DLI" },
    { name: "Hazrat Nizamuddin", code: "NZM" },
    { name: "Anand Vihar Terminal", code: "ANVT" },
  ],
  "Mumbai Central": [
    { name: "Mumbai Central", code: "MMCT" },
    { name: "Dadar", code: "DR" },
    { name: "Bandra Terminus", code: "BDTS" },
    { name: "Thane", code: "TNA" },
  ],
  "Chennai Central": [
    { name: "Chennai Central", code: "MAS" },
    { name: "Chennai Egmore", code: "MS" },
    { name: "Tambaram", code: "TBM" },
    { name: "Perambur", code: "PER" },
  ],
  "Kolkata": [
    { name: "Howrah Junction", code: "HWH" },
    { name: "Sealdah", code: "SDAH" },
    { name: "Kolkata Terminal", code: "KOAA" },
    { name: "Santragachi", code: "SRC" },
  ],
  "Bangalore": [
    { name: "KSR Bengaluru", code: "SBC" },
    { name: "Yesvantpur Junction", code: "YPR" },
    { name: "KR Puram", code: "KJM" },
    { name: "Banaswadi", code: "BAND" },
  ],
  "Hyderabad": [
    { name: "Secunderabad", code: "SC" },
    { name: "Hyderabad Deccan / Nampally", code: "HYB" },
    { name: "Kacheguda", code: "KCG" },
    { name: "Begumpet", code: "BMT" },
  ],
  "Pune": [
    { name: "Pune Junction", code: "PUNE" },
    { name: "Shivajinagar", code: "SVJR" },
    { name: "Khadki", code: "KK" },
    { name: "Pimpri", code: "PMP" },
  ],
  "Ahmedabad": [
    { name: "Ahmedabad Junction", code: "ADI" },
    { name: "Sabarmati Junction", code: "SBI" },
    { name: "Maninagar", code: "MAN" },
    { name: "Gandhigram", code: "GG" },
  ],
  "Jaipur": [
    { name: "Jaipur Junction", code: "JP" },
    { name: "Gandhinagar Jaipur", code: "GADJ" },
    { name: "Durgapura", code: "DPA" },
  ],
  "Lucknow": [
    { name: "Lucknow NR", code: "LKO" },
    { name: "Lucknow Jn", code: "LJN" },
    { name: "Badshahnagar", code: "BNZ" },
    { name: "Aishbagh", code: "ASH" },
  ],
  "Chandigarh": [
    { name: "Chandigarh Junction", code: "CDG" },
    { name: "Chandi Mandir", code: "CNDM" },
  ],
  "Goa": [
    { name: "Madgaon Junction", code: "MAO" },
    { name: "Vasco Da Gama", code: "VSG" },
    { name: "Thivim", code: "THVM" },
    { name: "Karmali", code: "KRMI" },
  ],
  "Agra": [
    { name: "Agra Cantt", code: "AGC" },
    { name: "Agra Fort", code: "AF" },
    { name: "Raja Ki Mandi", code: "RKM" },
  ],
  "Varanasi": [
    { name: "Varanasi Junction", code: "BSB" },
    { name: "Manduadih / Banaras", code: "BSBS" },
    { name: "Kashi", code: "KEI" },
  ],
  "Amritsar": [
    { name: "Amritsar Junction", code: "ASR" },
    { name: "Verka Junction", code: "VKA" },
  ],
  "Bhopal": [
    { name: "Bhopal Junction", code: "BPL" },
    { name: "Habibganj / Rani Kamalapati", code: "RKMP" },
    { name: "Nishatpura", code: "NSZ" },
  ],
  "Indore": [
    { name: "Indore Junction", code: "INDB" },
    { name: "Lakshmibai Nagar", code: "LMNR" },
    { name: "Rau", code: "RAU" },
  ],
  "Nagpur": [
    { name: "Nagpur Junction", code: "NGP" },
    { name: "Ajni", code: "AJNI" },
    { name: "Itwari", code: "ITR" },
  ],
  "Surat": [
    { name: "Surat", code: "ST" },
    { name: "Udhna Junction", code: "UDN" },
  ],
  "Kochi": [
    { name: "Ernakulam Junction", code: "ERS" },
    { name: "Ernakulam Town", code: "ERN" },
    { name: "Aluva", code: "AWY" },
    { name: "Tripunithura", code: "TRTR" },
  ],
};

export function HomePage({ setCurrentPage }: HomePageProps) {
  const { searchParams, setSearchParams, bookings } = useApp();
  const [from, setFrom] = useState(searchParams.from);
  const [to, setTo] = useState(searchParams.to);
  const [date, setDate] = useState(searchParams.date);
  const [travelClass, setTravelClass] = useState(
    searchParams.travelClass,
  );
  const [tatkalEnabled, setTatkalEnabled] = useState(
    searchParams.tatkalEnabled,
  );
  const [passengers, setPassengers] = useState(
    searchParams.passengers,
  );
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  // State for city and station selection
  const [fromCity, setFromCity] = useState("");
  const [fromStation, setFromStation] = useState("");
  const [toCity, setToCity] = useState("");
  const [toStation, setToStation] = useState("");

  // Handle city selection
  const handleFromCityChange = (city: string) => {
    setFromCity(city);
    setFromStation(""); // Reset station when city changes
    if (city && cityStations[city] && cityStations[city].length === 1) {
      // If only one station, auto-select it
      const station = cityStations[city][0];
      setFromStation(`${station.name} (${station.code})`);
      setFrom(`${station.name} (${station.code})`);
    } else {
      setFrom(city); // Set city as from for now
    }
  };

  const handleFromStationChange = (stationValue: string) => {
    setFromStation(stationValue);
    setFrom(stationValue);
  };

  const handleToCityChange = (city: string) => {
    setToCity(city);
    setToStation(""); // Reset station when city changes
    if (city && cityStations[city] && cityStations[city].length === 1) {
      // If only one station, auto-select it
      const station = cityStations[city][0];
      setToStation(`${station.name} (${station.code})`);
      setTo(`${station.name} (${station.code})`);
    } else {
      setTo(city); // Set city as to for now
    }
  };

  const handleToStationChange = (stationValue: string) => {
    setToStation(stationValue);
    setTo(stationValue);
  };

  const specialTrains = [
    {
      id: "ST001",
      number: "22120",
      name: "Shatabdi Premium Special",
      from: "New Delhi",
      to: "Mumbai Central",
      date: "2025-11-20",
      fare: 2500,
    },
    {
      id: "ST002",
      number: "12650",
      name: "Holiday Special Express",
      from: "Chennai Central",
      to: "Bangalore",
      date: "2025-11-22",
      fare: 850,
    },
    {
      id: "ST003",
      number: "17603",
      name: "Diwali Special",
      from: "Hyderabad",
      to: "Mumbai Central",
      date: "2025-11-25",
      fare: 1200,
    },
  ];

  useEffect(() => {
    if (tatkalEnabled) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [tatkalEnabled]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!from)
      newErrors.from = "Please select a departure station";
    if (!to)
      newErrors.to = "Please select a destination station";
    if (from === to)
      newErrors.to = "Destination must be different";
    if (!date) newErrors.date = "Please select a travel date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateForm()) {
      setSearchParams({
        from,
        to,
        date,
        travelClass,
        passengers,
        tatkalEnabled,
      });
      setCurrentPage("booking");
    }
  };

  const handleRebookLastJourney = () => {
    if (bookings.length === 0) {
      toast.error("No recent journeys found.");
      return;
    }

    // Get the most recent booking
    const lastBooking = bookings[0];
    
    // Set the journey date to today or tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const rebookDate = tomorrow.toISOString().split("T")[0];

    // Pre-fill booking details from last journey
    setFrom(lastBooking.from || "");
    setTo(lastBooking.to || "");
    setDate(rebookDate);
    setPassengers(lastBooking.passengers || 1);
    
    // Update search params and navigate
    setSearchParams({
      from: lastBooking.from || "",
      to: lastBooking.to || "",
      date: rebookDate,
      travelClass,
      passengers: lastBooking.passengers || 1,
      tatkalEnabled,
    });
    
    toast.success(`Rebooking ${lastBooking.from} → ${lastBooking.to}`);
    setCurrentPage("booking");
  };

  const popularRoutes = [
    { from: "New Delhi", to: "Mumbai Central", trains: 45 },
    { from: "Chennai Central", to: "Bangalore", trains: 32 },
    { from: "Kolkata", to: "New Delhi", trains: 28 },
    { from: "Mumbai Central", to: "Goa", trains: 15 },
  ];

  return (
    <div
      className="min-h-screen pb-20 relative overflow-hidden 
      bg-white
      dark:from-[#030712] dark:via-[#0B1120] dark:to-[#1E293B]
      transition-colors duration-500"
    >
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 font-extrabold text-5xl md:text-6xl tracking-tight">
            <span className="text-foreground">
              Book Your Journey,
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#0052D4] to-[#9C27B0] bg-clip-text text-transparent">
              Smartly & Swiftly
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience the next generation of travel booking
            with AI-powered fare predictions, real-time
            tracking, and seamless trip management.
          </p>
        </motion.div>

        {/* 6-Ticket Discount Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card
            onClick={() => setCurrentPage("chat-search")}
            className="p-5 bg-gradient-to-r from-emerald-500 to-blue-600 border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
      <Sparkles className="h-6 w-6 text-white" />
    </div>
    <div>
      <h3 className="text-white text-xl font-bold mb-1">
        Book 6 Tickets → Auto Discount Applied!
      </h3>
      <p className="text-white/90 text-sm">
        Get 15% off automatically when booking 6 or
        more tickets
      </p>
    </div>
  </div>
</div>
          </Card>
        </motion.div>

        {/* Smart Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto p-6 md:p-8 glass border-border shadow-2xl">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {/* From */}
              <div>
                <Label className="text-sm text-foreground">
                  From
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-foreground"
                    value={fromCity}
                    onChange={(e) => handleFromCityChange(e.target.value)}
                  >
                    <option value="">Select city</option>
                    {stations.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {errors.from && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.from}
                  </p>
                )}
                {fromCity && cityStations[fromCity].length > 1 && (
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-foreground"
                      value={fromStation}
                      onChange={(e) =>
                        handleFromStationChange(e.target.value)
                      }
                    >
                      <option value="">Select station</option>
                      {cityStations[fromCity].map((s) => (
                        <option key={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* To */}
              <div>
                <Label className="text-sm text-foreground">
                  To
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-foreground"
                    value={toCity}
                    onChange={(e) => handleToCityChange(e.target.value)}
                  >
                    <option value="">Select city</option>
                    {stations.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {errors.to && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.to}
                  </p>
                )}
                {toCity && cityStations[toCity].length > 1 && (
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-foreground"
                      value={toStation}
                      onChange={(e) => handleToStationChange(e.target.value)}
                    >
                      <option value="">Select station</option>
                      {cityStations[toCity].map((s) => (
                        <option key={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <Label className="text-sm text-foreground">
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      !tatkalEnabled && setDate(e.target.value)
                    }
                    disabled={tatkalEnabled}
                    className="pl-10 text-foreground"
                  />
                </div>
                {tatkalEnabled && (
                  <p className="text-xs text-orange-500 mt-1">
                    Auto-set to tomorrow
                  </p>
                )}
              </div>

              {/* Class */}
              <div>
                <Label className="text-sm text-foreground">
                  Class
                </Label>
                <select
                  className="w-full h-10 pl-3 rounded-md border border-border bg-background text-foreground"
                  value={travelClass}
                  onChange={(e) =>
                    setTravelClass(e.target.value)
                  }
                >
                  <option>All Classes</option>
                  <option>AC 1st Class</option>
                  <option>AC 2-Tier</option>
                  <option>AC 3-Tier</option>
                  <option>Sleeper</option>
                </select>
              </div>
            </div>

            {/* Tatkal & Passengers */}
            <div className="grid md:grid-cols-2 gap-4 mb-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted-adaptive">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <Label className="text-sm text-foreground">
                    Tatkal Booking
                  </Label>
                </div>
                <Switch
                  checked={tatkalEnabled}
                  onCheckedChange={setTatkalEnabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted-adaptive">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <Label className="text-sm text-foreground">
                    Passengers
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setPassengers(Math.max(1, passengers - 1))
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-foreground">
                    {passengers}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setPassengers(Math.min(6, passengers + 1))
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 gradient-primary h-12"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" /> Search
                Trains
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 text-foreground"
                onClick={handleRebookLastJourney}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Rebook
                Last Journey
              </Button>
            </div>

            {/* Live Availability */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
              </div>
              <span>
                Live availability • Updated 2 seconds ago
              </span>
            </div>
          </Card>
        </motion.div>

        {/* AI Fare Predictor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-6"
        >
          <Card className="p-4 gradient-accent text-white border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-90">
                    AI Fare Predictor
                  </p>
                  <p>
                    Book now — prices expected to rise by 12% in
                    3 days
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                <Sparkles className="mr-1 h-3 w-3" /> AI Insight
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Special Trains Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <div className="mb-6">
            <h3 className="text-foreground text-2xl font-semibold mb-2">
              Special Trains
            </h3>
            <p className="text-muted-foreground">
              Premium services for festive and special occasions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {specialTrains.map((train, idx) => (
              <motion.div
                key={train.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
                    <Badge className="bg-white/20 text-white border-0 mb-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Special
                    </Badge>
                    <h4 className="text-lg font-bold mb-1">
                      {train.name}
                    </h4>
                    <p className="text-sm opacity-90">
                      Train #{train.number}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            From
                          </p>
                          <p className="font-semibold">
                            {train.from}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            To
                          </p>
                          <p className="font-semibold">
                            {train.to}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Date
                          </p>
                          <p className="font-medium">
                            {new Date(
                              train.date,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Fare from
                          </p>
                          <p className="font-medium text-green-600 dark:text-green-400">
                            ₹{train.fare}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                      onClick={() => {
                        setFrom(train.from);
                        setTo(train.to);
                        handleSearch();
                      }}
                    >
                      Book Special Train
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Routes */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                Popular Routes
              </h3>
              <p className="text-muted-foreground">
                Quick access to frequently traveled destinations
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border border-border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        From
                      </p>
                      <p className="text-foreground font-medium">
                        {route.from}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      To
                    </p>
                    <p className="text-foreground font-medium">
                      {route.to}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {route.trains} trains
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => {
                        setFrom(route.from);
                        setTo(route.to);
                        handleSearch();
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-12 bg-muted-adaptive rounded-2xl transition-all duration-500">
          <div className="text-center mb-8">
            <h3 className="text-foreground text-2xl font-semibold">
              Why Choose IRCTC 2.0?
            </h3>
            <p className="text-muted-foreground">
              Next-generation features for modern travelers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "AI-Powered Predictions",
                description:
                  "Smart fare alerts and booking recommendations powered by ML models.",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Real-Time Tracking",
                description:
                  "Live train location, delay estimates, and accurate platform updates.",
              },
              {
                icon: <RefreshCw className="h-6 w-6" />,
                title: "One-Click Rebooking",
                description:
                  "Instantly rebook your favorite journeys with saved preferences.",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="p-6 text-center hover:shadow-lg bg-card transition-all"
              >
                <div className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h5 className="mb-2 text-foreground font-semibold">
                  {feature.title}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}