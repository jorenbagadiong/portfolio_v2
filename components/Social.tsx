import Link from "next/link"
import { IconType } from "react-icons"
import { FaFacebookF, FaFacebookMessenger, FaLinkedinIn } from "react-icons/fa"

type SocialItem = {
  icon: IconType
  path: string
}

type Props = {
  containerStyles?: string
  iconStyles?: string
}

const SOCIALS: SocialItem[] = [
  { icon: FaLinkedinIn, path: "/" },
  { icon: FaFacebookMessenger, path: "/" },
  { icon: FaFacebookF, path: "/" },
]

const Social = ({ containerStyles = "", iconStyles = "" }: Props) => {
  return (
    <div className={containerStyles}>
      {SOCIALS.map(({ path, icon: Icon }, index) => (
        <Link key={index} href={path} className={iconStyles}>
          <Icon />
        </Link>
      ))}
    </div>
  )
}

export default Social
