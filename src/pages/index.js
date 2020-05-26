import React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"


const BlogIndex = ({ data }) => {
  const isdev = process.env.NODE_ENV !== `production`
  const posts = data.allMarkdownRemark.edges
    .filter(edge => isdev || !edge.node.frontmatter.draft)
  return (
    <Layout>
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
                  marginBottom: 0
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h2>
              <div
                style={{
                  ...scale(-1 / 5),
                  display: `block`,
                }}
              >
                Last modified: {node.frontmatter.dateModified}
              </div>
              <div
                style={{
                  ...scale(-1 / 5),
                  display: `block`,
                  marginBottom: rhythm(0.2),
                }}
              >Tags:
              
              {node.frontmatter.tags === null || node.frontmatter.tags.map(tag => {
                return (
                  <span
                    key={tag}
                    style={{
                      marginLeft: rhythm(0.2),
                      marginRight: rhythm(0.2),
                    }}
                  >
                    <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
                  </span>
                )
              })}
              </div>
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
    allMarkdownRemark(
      filter: { frontmatter: { draft: { eq: false } } }
      sort: { fields: [frontmatter___dateModified], order: DESC }
    ) {
      edges {
        node {
          excerpt(truncate: true)
          fields {
            slug
          }
          frontmatter {
            title
            dateCreated(formatString: "MMMM DD, YYYY")
            dateModified(formatString: "MMMM DD, YYYY")
            tags
            draft
            description
          }
        }
      }
    }
  }
`
