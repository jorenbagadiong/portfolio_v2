import Link from "next/link"
import { socials as SOCIALS } from "@/lib/site-data"

type Props = {
  containerStyles?: string
  iconStyles?: string
}

const Social = ({ containerStyles = "", iconStyles = "" }: Props) => {
  return (
    <div className={containerStyles}>
      {SOCIALS.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          href={path}
          aria-label={label}
          className={iconStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon aria-hidden="true" />
        </Link>
      ))}
    </div>
  )
}

export default Social
