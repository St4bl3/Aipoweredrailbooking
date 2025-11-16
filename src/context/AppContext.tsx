// src/context/AppContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ---------- TYPES ----------
export interface SearchParams {
  from: string;
  to: string;
  date: string;
  travelClass: string;
  passengers: number;
  tatkalEnabled: boolean;
}

export interface PassengerDetail {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
}

export interface Booking {
  id: string;
  type: "train" | "hotel" | "cab" | "restaurant";
  name: string;
  from?: string;
  to?: string;
  fromStation?: string;
  toStation?: string;
  date: string;
  time?: string;
  seats?: string[];
  passengers?: number;
  passengerDetails?: PassengerDetail[];
  status?: string;
  amount: number;
  baseFare?: number;
  discount?: number;
  extra?: string;
  bookingDate: string;
  pnr?: string;
  train?: string;
  trainNumber?: string;
  platform?: string;
  coach?: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "cancellation";
  trainNumber?: string;
}

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  bookings: Booking[];
  addBooking: (booking: Partial<Booking>) => void;
  updateBooking?: (id: string, patch: Partial<Booking>) => void;
  removeBooking?: (id: string) => void;
  deleteBooking?: (id: string) => void;
  trackingBooking: Booking | null;
  setTrackingBooking: (booking: Booking | null) => void;
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "time">,
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  logout: () => void;
}

// ---------- CONTEXT ----------
const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ---------- UPDATED BOOKING NORMALIZER (FIXED) ----------
function normalizeBooking(partial: Partial<Booking>): Booking {
  const id = partial.id ?? `BKG_${Date.now()}`;
  const bookingDate = new Date().toISOString();
  const type = partial.type ?? "train";

  const finalFrom =
    partial.fromStation ?? partial.from ?? "Chennai Central";
  const finalTo = partial.toStation ?? partial.to ?? "Delhi";

  const name =
    partial.name ??
    (finalFrom && finalTo
      ? `${finalFrom} → ${finalTo}`
      : "Train Booking");

  const baseFare =
    typeof partial.amount === "number" && partial.amount > 0
      ? partial.amount
      : Math.floor(Math.random() * (2850 - 1450 + 1)) + 1450;

  const passengers = partial.passengers ?? 2;

  const discount = passengers >= 6 ? baseFare * 0.15 : 0;
  const amount = Math.round(baseFare - discount);

  const date =
    partial.date ?? new Date().toISOString().split("T")[0];

  return {
    id: String(id),
    type,
    name,

    from: partial.from ?? "Chennai",
    to: partial.to ?? "Delhi",

    fromStation: partial.fromStation ?? finalFrom,
    toStation: partial.toStation ?? finalTo,

    date,
    time: partial.time ?? "08:30",
    seats: partial.seats ?? ["B2-23", "B2-24"],
    passengers,

    // 🔥 FIX ADDED HERE — store passenger details inside booking
    passengerDetails: partial.passengerDetails ?? [],

    status: partial.status ?? "Confirmed",

    baseFare,
    discount,
    amount,

    extra: partial.extra,
    bookingDate,
    pnr:
      partial.pnr ??
      `PNR${Math.floor(100000 + Math.random() * 900000)}`,
    train: partial.train ?? "Rajdhani Express",
    trainNumber: partial.trainNumber ?? "12345",
    platform: partial.platform ?? "4",
    coach: partial.coach ?? "B2",
  };
}

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("irctc-dark-mode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [searchParams, setSearchParamsState] =
    useState<SearchParams>(() => {
      const saved = safeParse<SearchParams | null>(
        "irctc-search-params",
        null,
      );
      return (
        saved ?? {
          from: "",
          to: "",
          date: new Date().toISOString().split("T")[0],
          travelClass: "All Classes",
          passengers: 1,
          tatkalEnabled: false,
        }
      );
    });

  const [bookings, setBookingsState] = useState<Booking[]>(() =>
    safeParse<Booking[]>("irctc-bookings", []),
  );

  const [trackingBooking, setTrackingBookingState] =
    useState<Booking | null>(null);

  const [notifications, setNotificationsState] = useState<
    Notification[]
  >(() =>
    safeParse<Notification[]>("irctc-notifications", [
      {
        id: "1",
        message:
          "Welcome to IRCTC 2.0 — Your Smart Travel Companion!",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
        type: "info",
      },
    ]),
  );

  // Persist state
  useEffect(() => {
    localStorage.setItem(
      "irctc-dark-mode",
      JSON.stringify(darkMode),
    );
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "irctc-search-params",
      JSON.stringify(searchParams),
    );
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(
      "irctc-bookings",
      JSON.stringify(bookings),
    );
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(
      "irctc-notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Booking functions
  const addBooking = (partialBooking: Partial<Booking>) => {
    const booking = normalizeBooking(partialBooking);
    setBookingsState((prev) => [booking, ...prev]);
  };

  const updateBooking = (
    id: string,
    patch: Partial<Booking>,
  ) => {
    setBookingsState((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  };

  const removeBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookingsState((prev) => prev.filter((b) => b.id !== id));

    if (booking) {
      addNotification({
        message: `A seat just opened up on Train ${
          booking.trainNumber || "2425"
        } (${booking.from} → ${booking.to}) — Available Now!`,
        read: false,
        type: "cancellation",
        trainNumber: booking.trainNumber,
      });
    }
  };

  const deleteBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookingsState((prev) => prev.filter((b) => b.id !== id));

    if (booking) {
      addNotification({
        message: `A seat just opened up on Train ${
          booking.trainNumber || "2425"
        } (${booking.from} → ${booking.to}) — Available Now!`,
        read: false,
        type: "cancellation",
        trainNumber: booking.trainNumber,
      });
    }
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "time">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setNotificationsState((prev) => [newNotification, ...prev]);
  };

  const logout = () => {
    localStorage.clear();
    setBookingsState([]);
    setNotificationsState([]);
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode: setDarkModeState,
        searchParams,
        setSearchParams: setSearchParamsState,
        bookings,
        addBooking,
        updateBooking,
        removeBooking,
        deleteBooking,
        trackingBooking,
        setTrackingBooking: setTrackingBookingState,
        notifications,
        addNotification,
        markNotificationAsRead: (id) =>
          setNotificationsState((prev) =>
            prev.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
          ),
        markAllNotificationsAsRead: () =>
          setNotificationsState((prev) =>
            prev.map((n) => ({ ...n, read: true })),
          ),
        clearNotification: (id) =>
          setNotificationsState((prev) =>
            prev.filter((n) => n.id !== id),
          ),
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useApp must be used within AppProvider");
  return context;
}