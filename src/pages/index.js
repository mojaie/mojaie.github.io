import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const metadata = {
    title: data.site.siteMetadata.title,
    author: data.site.siteMetadata.author.name,
    license: data.site.siteMetadata.license,
    licenseURL: data.site.siteMetadata.licenseURL
  }
  const isdev = process.env.NODE_ENV !== `production`
  const posts = data.allMarkdownRemark.edges
    .filter(edge => isdev || edge.node.frontmatter.published)

  return (
    <Layout location={location} metadata={metadata}>
      <SEO title="All posts" />
      <Bio />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <header>
              <h2
                style={{
                  fontSize: rhythm(0.8),
                  marginTop: rhythm(2.5),
                  marginBottom: rhythm(0.5)
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h2>
              <small>{node.frontmatter.date}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
            published
            description
          }
        }
      }
    }
  }
`
