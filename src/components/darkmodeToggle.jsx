import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

export default function DarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    
      <motion.button
        layout
        onClick={() => setDark(!dark)}
        className="
              w-15 h-10 rounded-full
              bg-muted
              flex items-center
              px-1
              cursor-pointer
            "
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="
                w-8 h-8 rounded-full
                bg-accent
                flex items-center justify-center
                text-accent-foreground
              "
          style={{
            marginLeft: dark ? "auto" : "0",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {dark ? (
              <motion.svg
                key="moon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <path
                  fill="currentColor"
                  d="M21 12.79A9 9 0 0 1 11.21 3
                      A7 7 0 0 0 12 17a7 7 0 0 0 9-4.21Z"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="sun"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <path
                  fill="currentColor"
                  d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-14v2m0 12v2
                      m8-8h2M2 12H4m12.95-6.95l1.41-1.41
                      M5.64 18.36l1.41-1.41m0-11.31L5.64 5.64
                      m12.72 12.72l-1.41-1.41"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    
  );
}
