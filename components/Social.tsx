import Link from "next/link"
import { socials as SOCIALS } from "@/lib/site-data"

type Props = {
  containerStyles?: string
  iconStyles?: string
}

const Social = ({ containerStyles = "", iconStyles = "" }: Props) => {
  return (
    <div className={containerStyles}>
      {SOCIALS.map(({ path, icon: Icon }, index) => (
        <Link key={index} href={path} className={iconStyles} target="_blank">
          <Icon />
        </Link>
      ))}
    </div>
  )
}

export default Social
