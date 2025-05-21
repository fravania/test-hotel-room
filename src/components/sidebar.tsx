"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  Settings, 
  Home 
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Reservations",
      href: "/reservations",
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: "Guests",
      href: "/guests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed top-0 left-0 flex h-screen w-64 flex-col border-r bg-muted/40 z-10">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-bold" href="/">
          <Home className="h-5 w-5" />
          <span>Hotel Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 