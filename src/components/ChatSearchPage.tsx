import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, ArrowRight, X, Sparkles, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface ChatSearchPageProps {
  setCurrentPage: (page: string) => void;
  onSearchComplete: (data: {
    from: string;
    to: string;
    fromStation: string;
    toStation: string;
  }) => void;
}

// City database with stations and common typos
const cities = [
  {
    city: "Hyderabad",
    stations: ["Kacheguda (KCG)", "Secunderabad (SC)", "Nampally (HYB)"],
    typos: ["hydrebad", "hydrabad", "hyd", "hyderbad", "hyderabat"],
  },
  {
    city: "Mumbai",
    stations: ["Dadar (DR)", "CSMT (CSMT)", "Thane (TNA)"],
    typos: ["mumbai", "bombay", "mum", "mumba"],
  },
  {
    city: "Bangalore",
    stations: ["Bangalore City (BNC)", "Yeshwantpur (YPR)", "Bangalore East (BNCE)"],
    typos: ["banglor", "bangalor", "bengaluru", "blr", "bangolore"],
  },
  {
    city: "Chennai",
    stations: ["Chennai Central (MAS)", "Chennai Egmore (MS)", "Tambaram (TBM)"],
    typos: ["chennai", "madras", "chnnai", "chenai"],
  },
  {
    city: "New Delhi",
    stations: ["New Delhi (NDLS)", "Old Delhi (DLI)", "Hazrat Nizamuddin (NZM)"],
    typos: ["delhi", "newdelhi", "dilli", "delh"],
  },
];

// Levenshtein distance for typo detection
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
};

export function ChatSearchPage({ setCurrentPage, onSearchComplete }: ChatSearchPageProps) {
  const [step, setStep] = useState<"from" | "to" | "from-station" | "to-station">("from");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typoSuggestion, setTypoSuggestion] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [selectedFromStation, setSelectedFromStation] = useState("");

  useEffect(() => {
    if (input.length >= 2) {
      const inputLower = input.toLowerCase().trim();
      const matches: string[] = [];
      let closestMatch = "";
      let closestDistance = Infinity;

      cities.forEach((cityData) => {
        const cityLower = cityData.city.toLowerCase();
        
        // Exact or prefix match
        if (cityLower.startsWith(inputLower)) {
          matches.push(cityData.city);
        }
        // Check typos
        else {
          const distance = levenshteinDistance(inputLower, cityLower);
          if (distance <= 2 && distance < closestDistance) {
            closestDistance = distance;
            closestMatch = cityData.city;
          }
          
          cityData.typos.forEach((typo) => {
            if (typo.startsWith(inputLower)) {
              if (!matches.includes(cityData.city)) {
                matches.push(cityData.city);
              }
            }
            const typoDistance = levenshteinDistance(inputLower, typo);
            if (typoDistance <= 2 && typoDistance < closestDistance) {
              closestDistance = typoDistance;
              closestMatch = cityData.city;
            }
          });
        }
      });

      setSuggestions(matches);
      if (matches.length === 0 && closestMatch) {
        setTypoSuggestion(closestMatch);
      } else {
        setTypoSuggestion("");
      }
    } else {
      setSuggestions([]);
      setTypoSuggestion("");
    }
  }, [input]);

  const handleCitySelect = (city: string) => {
    // Validate that the city exists in our database
    const isValidCity = cities.some((c) => c.city === city);
    if (!isValidCity) {
      toast.error("Invalid city selected. Please choose from the list.");
      return;
    }

    if (step === "from") {
      setSelectedFrom(city);
      setStep("from-station");
    } else if (step === "to") {
      setSelectedTo(city);
      setStep("to-station");
    }
    setInput("");
    setSuggestions([]);
    setTypoSuggestion("");
  };

  const handleStationSelect = (station: string) => {
    if (step === "from-station") {
      setSelectedFromStation(station);
      setStep("to");
    } else if (step === "to-station") {
      onSearchComplete({
        from: selectedFrom,
        to: selectedTo,
        fromStation: station,
        toStation: selectedFromStation,
      });
      setCurrentPage("train-results");
    }
  };

  const cityData =
    step === "from-station"
      ? cities.find((c) => c.city === selectedFrom)
      : step === "to-station"
      ? cities.find((c) => c.city === selectedTo)
      : null;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-[#E8F1FF] via-[#F7FAFF] to-[#FFFFFF] dark:from-[#030712] dark:via-[#0B1120] dark:to-[#1E293B]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => setCurrentPage("home")} className="mb-4">
            ← Back to Home
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2">Smart Search</h1>
            <p className="text-muted-foreground mb-8">
              AI-powered search with typo correction
            </p>
          </motion.div>

          {/* Journey Summary */}
          {(selectedFrom || selectedTo) && (
            <Card className="p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-semibold">{selectedFrom || "---"}</p>
                  {selectedFromStation && (
                    <p className="text-xs text-muted-foreground">{selectedFromStation}</p>
                  )}
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-semibold">{selectedTo || "---"}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Station Selection */}
          <AnimatePresence mode="wait">
            {(step === "from-station" || step === "to-station") && cityData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">
                    Select Station in {step === "from-station" ? selectedFrom : selectedTo}
                  </h3>
                  <div className="space-y-2">
                    {cityData.stations.map((station) => (
                      <Button
                        key={station}
                        variant="outline"
                        className="w-full justify-between h-auto py-4"
                        onClick={() => handleStationSelect(station)}
                      >
                        <span>{station}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* City Search */}
            {(step === "from" || step === "to") && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {step === "from" ? "Where are you starting from?" : "Where are you going?"}
                      </h3>
                      <p className="text-xs text-muted-foreground">Type city name (typos okay!)</p>
                    </div>
                  </div>

                  <Input
                    placeholder="Type city name..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="text-lg h-14 mb-4"
                    autoFocus
                  />

                  {/* Invalid Input Warning */}
                  {input.length >= 3 && suggestions.length === 0 && !typoSuggestion && (
                    <Card className="p-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                          No matching city found. Please check spelling or select from popular cities below.
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Typo Suggestion */}
                  <AnimatePresence>
                    {typoSuggestion && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card
                          className="p-3 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100 mb-4"
                          onClick={() => handleCitySelect(typoSuggestion)}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-600" />
                            <p className="text-sm">
                              Did you mean: <strong>{typoSuggestion}</strong>?
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      {suggestions.map((city) => (
                        <Button
                          key={city}
                          variant="outline"
                          className="w-full justify-start h-auto py-3"
                          onClick={() => handleCitySelect(city)}
                        >
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{city}</span>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Popular Cities */}
                  {input.length === 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Popular Cities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cities.map((cityData) => (
                          <Button
                            key={cityData.city}
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleCitySelect(cityData.city)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {cityData.city}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
