import React from "react"
import { Link } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import "./layout.css"

const Layout = ({ children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author {
              name
              summary
            }
            license
            licenseURL
          }
        }
      }
    `
  )
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1)} ${rhythm(3 / 4)}`
      }}
    >
      <header>
        <h1
          style={{
            fontSize: rhythm(0.7),
            paddingTop: rhythm(0.2),
            paddingBottom: rhythm(0.2)
          }}
        >
          <Link
            style={{
              color: "#800000",
              textDecoration: "none"
            }}
            to={`/`}
          >
            {site.siteMetadata.title}
          </Link>
        </h1>
      </header>
      <main>{children}</main>
      <footer style={{ fontSize: rhythm(0.5) }}>
        © {new Date().getFullYear()} {` `}
        {site.siteMetadata.author.name} All rights reserved, {` `}
        <a href={site.siteMetadata.licenseURL}>{site.siteMetadata.license}</a>, {` `}
        Built with {` `} <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
