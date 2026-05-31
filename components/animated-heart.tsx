"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export function AnimatedHeart() {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="inline-block"
    >
      <Heart className="size-5 fill-red-500 text-red-500" />
    </motion.div>
  )
}
