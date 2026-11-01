import Image from "next/image"

import { DrawRing } from "@/components/motion/DrawRing"

const Photo = () => {
  return (
    <div className="relative w-[170px] h-[170px] sm:w-[298px] sm:h-[298px] xl:w-[498px] xl:h-[498px]">
      <div className="absolute inset-[1%] rounded-full overflow-hidden">
        <Image
          src="/assets/photo.png"
          priority
          quality={80}
          fill
          sizes="(min-width: 1280px) 498px, (min-width: 640px) 298px, 170px"
          alt=""
          className="object-cover"
        />
      </div>
      <DrawRing
        size={512}
        className="absolute inset-0 w-full h-full text-accent"
      />
    </div>
  )
}

export default Photo
