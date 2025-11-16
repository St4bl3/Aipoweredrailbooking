"use client";

import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { BookingFlow } from "./components/BookingFlow";
import { Dashboard } from "./components/Dashboard";
import { RealTimeTracking } from "./components/RealTimeTracking";
import { ProfilePage } from "./components/ProfilePage";
import { CommunityPage } from "./components/CommunityPage";
import { TravelEcosystem } from "./components/TravelEcosystem";
import { ChatbotOverlay } from "./components/ChatbotOverlay";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const [currentPage, setCurrentPage] =
    useState<string>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "booking":
        return <BookingFlow setCurrentPage={setCurrentPage} />;
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "tracking":
        return <RealTimeTracking />;
      case "profile":
        return <ProfilePage />;
      case "community":
        return <CommunityPage />;
      case "ecosystem":
        return <TravelEcosystem />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    // Use the theme tokens from global.css: bg-background and text-foreground
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Toaster />
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="min-h-[80vh]">{renderPage()}</main>

      <ChatbotOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}