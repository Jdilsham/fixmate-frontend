import { motion } from "framer-motion";
import { useState } from "react";
export default function DarkmodeToggle() {
    const [isOn, setIsOn] = useState(false);
    return(
        <button
          onClick={()=> setIsOn(!isOn)}
          
          className={`w-[100px] h-[50px] rounded-full cursor-pointer flex p-[10px] transition-colors duration-300 ${isOn ? "bg-white justify-start" : "bg-[#101010] justify-end"}`}
          
        >
          <motion.div
            layout
            transition={{
              type: "spring",
              visualDuration: 0.2,
              bounce: 0.2,
            }}
            className={`w-[30px] h-[30px] rounded-full shadow-md ${isOn ? "bg-[#101010] justify-start" : "bg-white justify-end"}  `}
          />
        </button>
    )
}