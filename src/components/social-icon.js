
import React from "react"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"


const SocialIcon = ({ href, fixed, alt }) => {
  return (
    <a href={href}>
      <Image
        fixed={fixed}
        alt={alt}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 24
        }}
      />
    </a>
  )
}

export default SocialIcon
