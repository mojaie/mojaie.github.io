/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

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
        <strong>Author: {author.name}</strong><br />
        <a href={`https://twitter.com/${social.twitter}`}>
          <Image
            fixed={data.twitter.childImageSharp.fixed}
            alt="Twitter"
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              minWidth: 24
            }}
          />
        </a>
        <a href={`https://github.com/${social.github}`}>
          <Image
            fixed={data.github.childImageSharp.fixed}
            alt="GitHub"
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              minWidth: 24
            }}
          />
        </a>
        <a href={`https://www.linkedin.com/in/${social.linkedin}`}>
          <Image
            fixed={data.linkedin.childImageSharp.fixed}
            alt="LinkedIn"
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              minWidth: 24
            }}
          />
        </a>
      </div>
    </div>
  )
}

export default Bio
