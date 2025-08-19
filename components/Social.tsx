import Link from "next/link"
import { IconType } from "react-icons"
import {
  FaFacebookF,
  FaFacebookMessenger,
  FaLinkedinIn,
  FaTelegramPlane,
} from "react-icons/fa"

type SocialItem = {
  icon: IconType
  path: string
}

type Props = {
  containerStyles?: string
  iconStyles?: string
}

const SOCIALS: SocialItem[] = [
  {
    icon: FaLinkedinIn,
    path: "https://www.linkedin.com/in/joren-bagadiong-8943a3213",
  },
  { icon: FaTelegramPlane, path: "https://t.me/jorenbagadiong" },
  {
    icon: FaFacebookMessenger,
    path: "https://m.me/jorenbagadiong",
  },
  { icon: FaFacebookF, path: "https://www.facebook.com/jorenbagadiong" },
]

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
