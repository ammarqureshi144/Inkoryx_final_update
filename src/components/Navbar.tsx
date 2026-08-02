import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, ChevronDown, Palette, Box, Gamepad2, Monitor, Sparkles } from "lucide-react";
import inkoryx from "@/assets/inkoryx-logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services", hasMega: true },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Premium Incubator", to: "/incubator" },
  { label: "Page to Pixel", to: "/page-to-pixel" },
  { label: "Process", to: "/process" },
  { label: "Verify", to: "/verify" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/booking" },
];

const megaServices = [
  { icon: Palette, title: "Character & Lore", desc: "Custom Art, Fursonas, Anime, VTuber Models" },
  { icon: Box, title: "Publishing & Print", desc: "Book Covers, Comic Pages, Brand Guides, 3D & Fursuit Blueprints" },
  { icon: Monitor, title: "Interface & Brand", desc: "App UI/UX, Logos, Stream Overlays, Icons" },
  { icon: Gamepad2, title: "Retro & Indie Game", desc: "Pixel Art, 2D Game Assets, UI Sprite Sheets, Animation" },
  { icon: Sparkles, title: "Motion & Spatial", desc: "3D Modeling, 2D/3D Animation, Game Environments, Book Trailers" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Commission Banner */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        className="bg-neon/10 border-b border-neon/20 text-center py-1.5 text-sm"
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow inline-block" />
          <span className="text-foreground font-medium">COMMISSION SLOTS: <span className="text-neon">OPEN</span></span>
          <span className="text-muted-foreground">(Limited Availability)</span>
        </span>
      </motion.div>

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 glass-strong"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src={inkoryx}
              alt="Inkoryx"
              className="w-8 h-8"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            />
            <span className="font-heading text-lg font-bold gradient-text">Inkoryx</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              if (item.hasMega) {
                return (
                  <div key={item.to} className="relative group">
                    <Link
                      to={item.to}
                      className={`relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                        active ? "text-neon" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                      {active && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-neon rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                    {/* Mega Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-[640px] z-50">
                      <div className="glass-strong rounded-xl border border-neon/20 p-4 shadow-2xl">
                        <div className="grid grid-cols-2 gap-2">
                          {megaServices.map((svc) => (
                            <Link
                              key={svc.title}
                              to="/services"
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-neon/10 transition-colors group/item"
                            >
                              <div className="w-9 h-9 rounded-lg bg-neon/10 flex items-center justify-center shrink-0 group-hover/item:bg-neon/20">
                                <svc.icon className="w-5 h-5 text-neon" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-foreground">{svc.title}</div>
                                <div className="text-xs text-muted-foreground">{svc.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    active ? "text-neon" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-neon rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <Link
            to="/booking"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon text-primary-foreground font-medium text-sm hover-glow animate-pulse-glow"
          >
            Get a Quote
          </Link>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong border-t border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.to ? "text-neon bg-neon/10" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-neon text-primary-foreground text-center font-medium text-sm"
                >
                  Get a Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
