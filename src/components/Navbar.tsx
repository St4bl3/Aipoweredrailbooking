// navbar.tsx
import {
  Moon,
  Sun,
  User,
  Menu,
  Bell,
  LogOut,
  Settings,
  CreditCard,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navbar({
  currentPage,
  setCurrentPage,
}: NavbarProps) {
  const {
    darkMode,
    setDarkMode,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] =
    useState(false);
  const unreadCount = notifications.filter(
    (n) => !n.read,
  ).length;

  // Scroll hide/show logic
  const lastScrollY = useRef<number>(0);
  const ticking = useRef<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    const threshold = 50; // px before hide/show logic starts
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY || window.pageYOffset;
        const lastY = lastScrollY.current;

        // near top -> always show
        if (currentY <= threshold) {
          setHidden(false);
        } else {
          if (currentY > lastY && currentY > threshold) {
            // scrolling down
            setHidden(true);
          } else if (currentY < lastY) {
            // scrolling up
            setHidden(false);
          }
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // The nav itself moves up/down. The blur/backdrop is an absolutely-positioned
    // element INSIDE the nav but behind the content so only the background is blurred.
    <nav
      className={`relative sticky top-0 z-50 transform transition-transform duration-300 ease-in-out will-change-transform
        ${hidden ? "-translate-y-[110%]" : "translate-y-0"}`}
      aria-hidden={hidden ? "true" : "false"}
    >
      {/* BACKDROP LAYER: absolute, behind content, pointer-events-none so it doesn't intercept clicks.
          Uses darkMode to choose light or dark translucent blur. */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className={
            // light blur in light mode, dark blur in dark mode:
            `w-full h-full backdrop-blur-md ${
              darkMode
                ? "bg-black/40 border-b border-border/30"
                : "bg-white/40 border-b border-border/10"
            }`
          }
          aria-hidden="true"
        />
      </div>

      {/* CONTENT: sits above the backdrop and is NOT blurred */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setCurrentPage("home")}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md">
              <span className="text-xl text-white">🚂</span>
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-lg font-semibold tracking-wide text-foreground mb-0">
                IRCTC 2.0
              </h1>
              <p className="text-xs text-muted-foreground leading-none mt-[-2px]">
                Smart Travel Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {[
              { name: "Home", key: "home" },
              { name: "My Trips", key: "dashboard" },
              { name: "Travel Services", key: "ecosystem" },
              { name: "Community", key: "community" },
            ].map((item) => (
              <Button
                key={item.key}
                variant={
                  currentPage === item.key ? "default" : "ghost"
                }
                onClick={() => setCurrentPage(item.key)}
                className={`text-sm px-4 py-1.5 rounded-md transition-all ${
                  currentPage === item.key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "hover:bg-muted/50 hover:text-foreground/80"
                }`}
              >
                {item.name}
              </Button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <DropdownMenu
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 p-0 shadow-lg border-border/50"
              >
                <div className="p-3 border-b bg-muted/40 backdrop-blur-sm flex justify-between items-center">
                  <h5 className="font-medium text-sm">
                    Notifications
                  </h5>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        No notifications
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-muted/40 flex items-start justify-between group ${
                          !notification.read
                            ? "bg-white dark:bg-blue-950/40"
                            : ""
                        }`}
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() =>
                            markNotificationAsRead(
                              notification.id,
                            )
                          }
                        >
                          <p className="text-sm leading-tight">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            clearNotification(notification.id)
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 border-border/40 shadow-lg"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        RS
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        Rahul Sharma
                      </p>
                      <p className="text-xs text-muted-foreground">
                        rahul.sharma@email.com
                      </p>
                    </div>
                  </div>
                </div>

                <DropdownMenuItem
                  onClick={() => setCurrentPage("profile")}
                >
                  <UserCircle className="mr-2 h-4 w-4" /> My
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentPage("dashboard")}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> My
                  Bookings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentPage("ecosystem")}
                >
                  <Settings className="mr-2 h-4 w-4" /> Travel
                  Services
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setCurrentPage("home")}
                >
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentPage("dashboard")}
                >
                  My Trips
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentPage("ecosystem")}
                >
                  Travel Services
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentPage("community")}
                >
                  Community
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;