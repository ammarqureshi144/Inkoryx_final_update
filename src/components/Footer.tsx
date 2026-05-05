import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import inkoryx from "@/assets/inkoryx-logo.png";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-border bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={inkoryx} alt="Inkoryx" className="w-8 h-8" />
              <span className="font-heading text-lg font-bold gradient-text">Inkoryx</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Elite custom character art, high-quality 3D models, UI design, and fluid animations. Step out of the background and become the icon.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-neon">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
              <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              <Link to="/process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Process</Link>
              <Link to="/booking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-neon">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/tos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/tos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">Copyright © 2026. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Powered by THEMIXLLC</p>
          <div className="flex items-center gap-2">
            <img src={inkoryx} alt="" className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Inkoryx</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
