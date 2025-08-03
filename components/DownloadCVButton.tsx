"use client"

import { FiDownload } from "react-icons/fi"

import { Button } from "@/components/ui/button"

const DownloadCVButton: React.FC = () => {
  return (
    <a href="/assets/files/JorenBagadiongResumeMail.pdf" download>
      <Button
        variant="outline"
        size="lg"
        className="uppercase flex items-center gap-2"
      >
        <span>Download CV</span>
        <FiDownload className="text-xl" />
      </Button>
    </a>
  )
}

export default DownloadCVButton
