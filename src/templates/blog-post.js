import React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const metadata = {
    title: data.site.siteMetadata.title,
    author: data.site.siteMetadata.author.name,
    license: data.site.siteMetadata.license,
    licenseURL: data.site.siteMetadata.licenseURL
  }
  const { previous, next } = pageContext

  return (
    <Layout location={location} metadata={metadata}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h2
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post.frontmatter.title}
          </h2>
          <div
            style={{
              ...scale(-1 / 5),
              display: `block`,
            }}
          >
            {post.frontmatter.date}
          </div>
          <div
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
            }}
          >Tags:
          
          {post.frontmatter.tags === null || post.frontmatter.tags.map(tag => {
            return (
              <span
                key={tag}
                style={{
                  marginLeft: rhythm(0.2),
                  marginRight: rhythm(0.2),
                }}
              >
                <Link to={`tags/${kebabCase(tag)}`}>{tag}</Link>
              </span>
            )
          })}
          </div>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
        description
      }
    }
  }
`
