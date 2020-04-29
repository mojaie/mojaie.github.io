
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"
import SocialIcon from "./social-icon"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/shiocombu.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      github: file(absolutePath: { regex: "/github-icon.png/" }) {
        childImageSharp {
          fixed(width: 24, height: 24) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      twitter: file(absolutePath: { regex: "/twitter-icon.png/" }) {
        childImageSharp {
          fixed(width: 24, height: 24) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      linkedin: file(absolutePath: { regex: "/linkedin-icon.png/" }) {
        childImageSharp {
          fixed(width: 24, height: 24) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
            linkedin
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div
        style={{
          fontSize: rhythm(0.5)
        }}
      >
        <div><strong>Author: {author.name}</strong></div>
        <div>
          <SocialIcon
            href={`https://twitter.com/${social.twitter}`}
            fixed={data.twitter.childImageSharp.fixed}
            alt="Twitter"
          />
          <SocialIcon
            href={`https://github.com/${social.github}`}
            fixed={data.github.childImageSharp.fixed}
            alt="GitHub"
          />
          <SocialIcon
            href={`https://www.linkedin.com/in/${social.linkedin}`}
            fixed={data.linkedin.childImageSharp.fixed}
            alt="LinkedIn"
          />
        </div>
      </div>
    </div>
  )
}

export default Bio
