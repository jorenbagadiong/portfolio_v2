import { motion } from "framer-motion"

type ProgressBarProps = {
  name: string
  percentage: number
  index: number
}

const ProgressBar = ({ name, percentage, index }: ProgressBarProps) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <h3 className="text-xl font-medium text-white">{name}</h3>
        <span className="text-xl font-medium text-white/60">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: index * 0.15 }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
