"use client"

import { FiDownload } from "react-icons/fi"

import { Button } from "@/components/ui/button"

const DownloadCVButton: React.FC = () => {
  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="uppercase flex items-center gap-2"
    >
      <a href="/assets/files/Joren_Bagadiong_Resume_ATS.pdf" download>
        <span>Download CV</span>
        <FiDownload className="text-xl" />
      </a>
    </Button>
  )
}

export default DownloadCVButton
