"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, BarChart, Users, Clock } from "lucide-react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: BarChart },
  { href: "/events", label: "Eventos", icon: Calendar },
  { href: "/meetings", label: "Reuniones", icon: Users },
  { href: "/availability", label: "Disponibilidad", icon: Clock },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded } = useUser();

  return (
    <>
      {!isLoaded && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <BarLoader width={"100%"} color="#3b82f6" />
        </div>
      )}
      <div className="flex flex-col h-screen bg-blue-50 md:flex-row">
        {/* Sidebar for medium screens and up */}
        <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Mi Aplicación</h1>
          </div>
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 md:px-8 md:py-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold gradient-title text-gray-900">
                {navItems.find((item) => item.href === pathname)?.label ||
                  "Panel"}
              </h2>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-4">
            {children}
          </div>
        </main>

        {/* Bottom navigation for mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <ul className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center h-full px-2 transition-colors duration-200 ${
                    pathname === item.href 
                      ? "text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <item.icon 
                    className={`w-5 h-5 mb-1 ${
                      pathname === item.href ? "text-blue-600" : "text-gray-500"
                    }`} 
                  />
                  <span className="text-xs font-medium truncate max-w-full">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}