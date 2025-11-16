import { useState } from "react";
import { motion } from "motion/react";
import {
  Bus,
  Car,
  Hotel,
  UtensilsCrossed,
  Plane,
  MapPin,
  ArrowRight,
  Star,
  Search,
  X,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { useApp } from "../context/AppContext";

export function TravelEcosystem() {
  const { addBooking, addNotification } = useApp();
  const [selectedMetroCity, setSelectedMetroCity] =
    useState("Delhi");
  const [selectedHotelCity, setSelectedHotelCity] =
    useState("Mumbai");
  const [selectedFoodCity, setSelectedFoodCity] =
    useState("Mumbai");
  const [showMetroRoutes, setShowMetroRoutes] = useState(false);
  const [selectedMetroLine, setSelectedMetroLine] = useState<
    string | null
  >(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<any>(null);
  const [cabPickup, setCabPickup] = useState("Mumbai Central Railway Station");
  const [cabDrop, setCabDrop] = useState("");
  const [cabErrors, setCabErrors] = useState<{[key: string]: string}>({});

  const metroData = {
    Delhi: {
      partner: "DMRC",
      lines: [
        {
          name: "Red Line",
          route: "Rithala - Shaheed Sthal",
          stations: 29,
          color: "line-red",
        },
        {
          name: "Blue Line",
          route: "Noida - Dwarka",
          stations: 50,
          color: "line-blue",
        },
        {
          name: "Yellow Line",
          route: "Samaypur Badli - HUDA City Centre",
          stations: 37,
          color: "line-yellow",
        },
        {
          name: "Green Line",
          route: "Kirti Nagar - Mundka",
          stations: 23,
          color: "line-green",
        },
      ],
    },

    Mumbai: {
      partner: "MMRCL",
      lines: [
        {
          name: "Line 1",
          route: "Versova - Ghatkopar",
          stations: 12,
          color: "line-blue",
        },
        {
          name: "Line 2A",
          route: "Dahisar - DN Nagar",
          stations: 18,
          color: "line-yellow",
        },
        {
          name: "Line 7",
          route: "Andheri - Dahisar",
          stations: 13,
          color: "line-red",
        },
      ],
    },

    Chennai: {
      partner: "CMRL",
      lines: [
        {
          name: "Blue Line",
          route: "Washermenpet - Airport",
          stations: 32,
          color: "line-blue",
        },
        {
          name: "Green Line",
          route: "Light House - Poonamallee",
          stations: 23,
          color: "line-green",
        },
        {
          name: "Purple Line",
          route: "Kilpauk - Tambaram",
          stations: 20,
          color: "line-purple",
        },
      ],
    },

    Bangalore: {
      partner: "BMRCL",
      lines: [
        {
          name: "Purple Line",
          route: "Baiyappanahalli - Mysore Road",
          stations: 18,
          color: "line-purple",
        },
        {
          name: "Green Line",
          route: "Nagasandra - Silk Institute",
          stations: 30,
          color: "line-green",
        },
        {
          name: "Yellow Line",
          route: "R.V. Road - Bommasandra",
          stations: 19,
          color: "line-yellow",
        },
      ],
    },
  };

  const cabServices = [
    {
      name: "Ola",
      type: "Sedan",
      price: 250,
      time: "5 min",
      rating: 4.5,
    },
    {
      name: "Uber",
      type: "Premier",
      price: 320,
      time: "3 min",
      rating: 4.7,
    },
    {
      name: "Local Taxi",
      type: "Auto",
      price: 80,
      time: "2 min",
      rating: 4.2,
    },
  ];

  const hotelsByCity: any = {
    Mumbai: [
      {
        name: "The Grand Plaza",
        location: "Near Railway Station, Mumbai",
        price: 2499,
        rating: 4.5,
        amenities: ["WiFi", "Breakfast", "AC"],
        image:
          "https://images.unsplash.com/photo-1532968899863-5b52ef155913?w=400",
      },
      {
        name: "Station View Hotel",
        location: "Central Mumbai",
        price: 1899,
        rating: 4.3,
        amenities: ["WiFi", "Parking"],
        image:
          "https://images.unsplash.com/photo-1664081507458-94de02277afe?w=400",
      },
    ],
    Delhi: [
      {
        name: "Capitol Heights",
        location: "Connaught Place, Delhi",
        price: 3299,
        rating: 4.6,
        amenities: ["WiFi", "Breakfast", "Gym"],
        image:
          "https://images.unsplash.com/photo-1532968899863-5b52ef155913?w=400",
      },
    ],
    Chennai: [
      {
        name: "Marina Bay Resort",
        location: "Near Beach, Chennai",
        price: 2199,
        rating: 4.4,
        amenities: ["WiFi", "Pool", "AC"],
        image:
          "https://images.unsplash.com/photo-1664081507458-94de02277afe?w=400",
      },
    ],
  };

  const restaurantsByCity: any = {
    Mumbai: [
      {
        name: "Taj Mahal Restaurant",
        cuisine: "North Indian",
        rating: 4.5,
        distance: "0.5 km",
        price: "₹₹",
        deliveryTime: "30 min",
      },
      {
        name: "Chinese Wok",
        cuisine: "Chinese",
        rating: 4.3,
        distance: "1.2 km",
        price: "₹",
        deliveryTime: "25 min",
      },
      {
        name: "Pizza Paradise",
        cuisine: "Italian",
        rating: 4.6,
        distance: "0.8 km",
        price: "₹₹",
        deliveryTime: "35 min",
      },
    ],
    Delhi: [
      {
        name: "Spice Route",
        cuisine: "Multi-cuisine",
        rating: 4.7,
        distance: "0.3 km",
        price: "₹₹₹",
        deliveryTime: "20 min",
      },
      {
        name: "Burger Junction",
        cuisine: "Fast Food",
        rating: 4.2,
        distance: "1.5 km",
        price: "₹",
        deliveryTime: "30 min",
      },
    ],
    Chennai: [
      {
        name: "Saravana Bhavan",
        cuisine: "South Indian",
        rating: 4.8,
        distance: "0.4 km",
        price: "₹",
        deliveryTime: "15 min",
      },
      {
        name: "Sea Shell",
        cuisine: "Seafood",
        rating: 4.4,
        distance: "2.0 km",
        price: "₹₹",
        deliveryTime: "40 min",
      },
    ],
  };

  const tourPackages = [
    {
      title: "Golden Triangle Tour",
      duration: "5D/4N",
      price: 12999,
      destinations: ["Delhi", "Agra", "Jaipur"],
      image:
        "https://images.unsplash.com/photo-1664081507458-94de02277afe?w=400",
    },
    {
      title: "Kerala Backwaters",
      duration: "4D/3N",
      price: 15999,
      destinations: ["Kochi", "Alleppey", "Munnar"],
      image:
        "https://images.unsplash.com/photo-1639494095806-1680b909cb33?w=400",
    },
    {
      title: "Goa Beach Holiday",
      duration: "3D/2N",
      price: 8999,
      destinations: ["North Goa", "South Goa"],
      image:
        "https://images.unsplash.com/photo-1761686882697-16fe5ef2be91?w=400",
    },
  ];

  const metroCities = Object.keys(metroData);
  const hotelCities = Object.keys(hotelsByCity);
  const foodCities = Object.keys(restaurantsByCity);

  const handleBookCab = (cabName: string, price: number) => {
    const errors: {[key: string]: string} = {};
    
    if (!cabPickup.trim()) {
      errors.pickup = "Please enter pickup location";
    }
    if (!cabDrop.trim()) {
      errors.drop = "Please enter drop location";
    }
    
    setCabErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const booking = {
        id: Date.now().toString(),
        type: "cab" as const,
        name: cabName,
        from: cabPickup,
        to: cabDrop,
        date: new Date().toISOString().split("T")[0],
        time: "Now",
        amount: price,
        bookingDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      };
      
      addBooking(booking);
      addNotification({
        message: `🚗 ${cabName} booked! Driver arriving shortly from ${cabPickup} to ${cabDrop}`,
        read: false,
        type: 'success',
      });
      
      toast.success(
        `🚗 ${cabName} booked successfully! Driver arriving in few minutes. Total: ₹${price}`,
      );
      
      // Reset form
      setCabDrop("");
    }
  };

  const handleBookHotel = (
    hotelName: string,
    price: number,
    location: string,
  ) => {
    const booking = {
      id: Date.now().toString(),
      type: "hotel" as const,
      name: hotelName,
      date: new Date().toISOString().split("T")[0],
      amount: price,
      extra: location,
      bookingDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    
    addBooking(booking);
    addNotification({
      message: `🏨 Hotel booked: ${hotelName} at ${location}. Check-in details sent to email`,
      read: false,
      type: 'success',
    });
    
    toast.success(
      `🏨 ${hotelName} booked successfully! Confirmation sent to your email. Total: ₹${price}`,
    );
    setSelectedHotel(null);
  };

  const handleOrderFood = (restaurantName: string, cuisine: string, price: string) => {
    const booking = {
      id: Date.now().toString(),
      type: "restaurant" as const,
      name: restaurantName,
      date: new Date().toISOString().split("T")[0],
      time: "Now",
      amount: 500, // Placeholder amount
      extra: cuisine,
      bookingDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    
    addBooking(booking);
    addNotification({
      message: `🍽️ Food order placed at ${restaurantName}. Delivery on the way!`,
      read: false,
      type: 'success',
    });
    
    toast.success(
      `🍽️ Order placed at ${restaurantName}! Your food will arrive soon.`,
    );
    setSelectedRestaurant(null);
  };

  const handleExploreTour = (
    tourTitle: string,
    price: number,
  ) => {
    toast.success(
      `✈️ ${tourTitle} package added to wishlist! Price: ₹${price.toLocaleString()}`,
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2">Travel Ecosystem</h2>
          <p className="text-muted-foreground">
            Complete your journey with integrated travel
            services
          </p>
        </div>

        {/* Service Tabs */}
        <Tabs defaultValue="metro" className="mb-8">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="metro">
              <Bus className="h-4 w-4 mr-2" />
              Metro
            </TabsTrigger>
            <TabsTrigger value="cab">
              <Car className="h-4 w-4 mr-2" />
              Cab
            </TabsTrigger>
            <TabsTrigger value="hotel">
              <Hotel className="h-4 w-4 mr-2" />
              Hotel
            </TabsTrigger>
            <TabsTrigger value="food">
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Food
            </TabsTrigger>
            <TabsTrigger value="tours">
              <Plane className="h-4 w-4 mr-2" />
              Tours
            </TabsTrigger>
          </TabsList>

          {/* Metro Tab */}
          <TabsContent value="metro" className="mt-6">
            {/* City Selector */}
            <Card className="p-6 mb-6">
              <h4 className="mb-4">Select Metro City</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metroCities.map((city) => (
                  <Button
                    key={city}
                    variant={
                      selectedMetroCity === city
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedMetroCity === city
                        ? "gradient-primary text-white border-0"
                        : ""
                    }
                    onClick={() => setSelectedMetroCity(city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Metro Lines */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4>{selectedMetroCity} Metro</h4>
                  <p className="text-sm text-muted-foreground">
                    {
                      metroData[
                        selectedMetroCity as keyof typeof metroData
                      ].partner
                    }
                  </p>
                </div>
                <Button
                  onClick={() => setShowMetroRoutes(true)}
                >
                  View All Routes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {metroData[
                  selectedMetroCity as keyof typeof metroData
                ].lines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() =>
                      setSelectedMetroLine(line.name)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-12 rounded-full ${line.color}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p>{line.name}</p>
                          <Badge variant="secondary">
                            {line.stations} stations
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {line.route}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Cab Tab */}
          <TabsContent value="cab" className="mt-6">
            <Card className="p-6 mb-6">
              <h4 className="mb-4">Book a Ride from Station</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm mb-2 block">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      className={`pl-10 ${cabErrors.pickup ? 'border-red-500 border-2' : ''}`}
                      placeholder="Enter pickup location"
                      value={cabPickup}
                      onChange={(e) => {
                        setCabPickup(e.target.value);
                        setCabErrors({...cabErrors, pickup: ""});
                      }}
                    />
                  </div>
                  {cabErrors.pickup && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{cabErrors.pickup}</p>}
                </div>
                <div>
                  <label className="text-sm mb-2 block">
                    Drop Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      className={`pl-10 ${cabErrors.drop ? 'border-red-500 border-2' : ''}`}
                      placeholder="Enter destination"
                      value={cabDrop}
                      onChange={(e) => {
                        setCabDrop(e.target.value);
                        setCabErrors({...cabErrors, drop: ""});
                      }}
                    />
                  </div>
                  {cabErrors.drop && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{cabErrors.drop}</p>}
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {cabServices.map((cab, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                          <Car className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5>{cab.name}</h5>
                            <Badge variant="secondary">
                              {cab.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>Arrives in {cab.time}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{cab.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl mb-1">
                          ₹{cab.price}
                        </p>
                        <Button
                          size="sm"
                          className="gradient-primary text-white border-0"
                          onClick={() =>
                            handleBookCab(cab.name, cab.price)
                          }
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Hotel Tab */}
          <TabsContent value="hotel" className="mt-6">
            {/* City Selector */}
            <Card className="p-6 mb-6">
              <h4 className="mb-4">Select City for Hotels</h4>
              <div className="flex gap-3 flex-wrap">
                {hotelCities.map((city) => (
                  <Button
                    key={city}
                    variant={
                      selectedHotelCity === city
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedHotelCity === city
                        ? "gradient-primary text-white border-0"
                        : ""
                    }
                    onClick={() => setSelectedHotelCity(city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {hotelsByCity[selectedHotelCity].map(
                (hotel: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <ImageWithFallback
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-white/90 text-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {hotel.rating}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h5 className="mb-1">{hotel.name}</h5>
                        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hotel.location}
                        </p>
                        <div className="flex gap-2 mb-3">
                          {hotel.amenities.map(
                            (amenity: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {amenity}
                              </Badge>
                            ),
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Starting from
                            </p>
                            <p className="text-xl">
                              ₹{hotel.price}/night
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ),
              )}
            </div>
          </TabsContent>

          {/* Food Tab */}
          <TabsContent value="food" className="mt-6">
            {/* City Selector */}
            <Card className="p-6 mb-6">
              <h4 className="mb-4">
                Select City for Food Delivery
              </h4>
              <div className="flex gap-3 flex-wrap">
                {foodCities.map((city) => (
                  <Button
                    key={city}
                    variant={
                      selectedFoodCity === city
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedFoodCity === city
                        ? "gradient-primary text-white border-0"
                        : ""
                    }
                    onClick={() => setSelectedFoodCity(city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {restaurantsByCity[selectedFoodCity].map(
                (restaurant: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className="p-4 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() =>
                        setSelectedRestaurant(restaurant)
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            {restaurant.name}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{restaurant.distance}</span>
                        <span>•</span>
                        <span>{restaurant.price}</span>
                        <span>•</span>
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-3 gradient-primary text-white border-0"
                        onClick={() =>
                          handleOrderFood(restaurant.name, restaurant.cuisine, restaurant.price)
                        }
                      >
                        Order Now
                      </Button>
                    </Card>
                  </motion.div>
                ),
              )}
            </div>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours" className="mt-6">
            <div className="mb-6">
              <h4>Curated Tour Packages</h4>
              <p className="text-sm text-muted-foreground">
                Explore India with our partner travel agencies
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {tourPackages.map((tour, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 gradient-accent text-white border-0">
                        {tour.duration}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h5 className="mb-2">{tour.title}</h5>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tour.destinations.map((dest, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {dest}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Starting from
                          </p>
                          <p className="text-xl">
                            ₹{tour.price.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="gradient-primary text-white border-0"
                          onClick={() =>
                            handleExploreTour(
                              tour.title,
                              tour.price,
                            )
                          }
                        >
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Partner Brands */}
        <Card className="p-6">
          <h4 className="mb-6">Our Travel Partners</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "Ola",
              "Uber",
              "Swiggy",
              "Zomato",
              "MakeMyTrip",
              "Goibibo",
            ].map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
              >
                <p className="text-muted-foreground">
                  {partner}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Metro Routes Modal */}
      <Dialog
        open={showMetroRoutes}
        onOpenChange={setShowMetroRoutes}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMetroCity} Metro Routes
            </DialogTitle>
            <DialogDescription>
              View all metro lines and routes in{" "}
              {selectedMetroCity}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {metroData[
              selectedMetroCity as keyof typeof metroData
            ].lines.map((line, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-3 h-12 rounded-full ${line.color}`}
                  />
                  <div>
                    <p>{line.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {line.route}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {line.stations} stations
                  </Badge>
                  <Badge variant="outline">Operational</Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hotel Details Modal */}
      <Dialog
        open={!!selectedHotel}
        onOpenChange={() => setSelectedHotel(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedHotel?.name}</DialogTitle>
            <DialogDescription>
              View hotel details and amenities
            </DialogDescription>
          </DialogHeader>
          {selectedHotel && (
            <div>
              <div className="aspect-video relative overflow-hidden bg-muted rounded-lg mb-4">
                <ImageWithFallback
                  src={selectedHotel.image}
                  alt={selectedHotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm">
                    {selectedHotel.location}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {selectedHotel.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Price per night
                  </p>
                  <p className="text-xl">
                    ₹{selectedHotel.price}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Amenities
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedHotel.amenities.map(
                      (amenity: string, i: number) => (
                        <Badge key={i} variant="outline">
                          {amenity}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
                <Button
                  className="w-full gradient-primary text-white border-0 mt-4"
                  onClick={() =>
                    handleBookHotel(
                      selectedHotel.name,
                      selectedHotel.price,
                    )
                  }
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restaurant Details Modal */}
      <Dialog
        open={!!selectedRestaurant}
        onOpenChange={() => setSelectedRestaurant(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedRestaurant?.name}
            </DialogTitle>
            <DialogDescription>
              Restaurant details and ordering information
            </DialogDescription>
          </DialogHeader>
          {selectedRestaurant && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Cuisine
                </p>
                <p className="text-sm">
                  {selectedRestaurant.cuisine}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Rating
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {selectedRestaurant.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Distance
                </p>
                <p className="text-sm">
                  {selectedRestaurant.distance}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Delivery Time
                </p>
                <p className="text-sm">
                  {selectedRestaurant.deliveryTime}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Price Range
                </p>
                <p className="text-sm">
                  {selectedRestaurant.price}
                </p>
              </div>
              <Button
                className="w-full gradient-primary text-white border-0"
                onClick={() =>
                  handleOrderFood(selectedRestaurant.name)
                }
              >
                Order Now
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}