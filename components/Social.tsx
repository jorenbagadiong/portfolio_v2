import Link from "next/link"
import { socials as SOCIALS } from "@/lib/site-data"

type Props = {
  containerStyles?: string
  iconStyles?: string
}

const Social = ({ containerStyles = "", iconStyles = "" }: Props) => {
  return (
    <div className={containerStyles}>
      {SOCIALS.map(({ path, name, icon: Icon }) => (
        <Link
          key={path}
          href={path}
          aria-label={name}
          className={iconStyles}
          target="_blank"
        >
          <Icon aria-hidden="true" />
        </Link>
      ))}
    </div>
  )
}

export default Social
