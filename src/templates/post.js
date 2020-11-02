// import url from "url"
import React from "react"
import url from "url"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"
import { Helmet } from "react-helmet-async"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"


const TwitterShareButton = ({ title, url, twitter }) => {
  return (
    <span
      style={{
        marginRight: rhythm(1 / 2),
        minWidth: 24
      }}
    >
      <a
        className="twitter-share-button"
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        data-text={title}
        data-url={url}
        data-via={twitter}
        data-show-count="false"
      >Tweet</a>
      <Helmet>
        <script
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        />
      </Helmet>
    </span>
  )
}


/*
const FacebookShareButton = ({ url }) => {
  return (
    <iframe
      src={`https://www.facebook.com/plugins/share_button.php?href=${encodeURIComponent(url)}&layout=button&size=small&width=69&height=20&appId`}
      title="Facebook"
      width="69"
      height="20"
      style={{
        marginRight: rhythm(1 / 2),
        minWidth: 24,
        border: `none`,
        overflow: `hidden`
      }}
      scrolling="no"
      frameBorder="0"
      allow="encrypted-media"
    ></iframe>
  )
}

*/


const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const metadata = data.site.siteMetadata
  const postLink = url.resolve(metadata.siteUrl, post.fields.slug)
  const imagepath = data.file === null ? undefined : url.resolve(
    metadata.siteUrl, data.file.childImageSharp.fixed.src)
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        imagepath={imagepath}
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
            Last modified: {post.frontmatter.dateModified}
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
                <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
              </span>
            )
          })}
          </div>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <div
          style={{
            overflow: `hidden`
          }}
        >
          <div
            style={{
              float: `right`
            }}
          >
            <TwitterShareButton
              title={post.frontmatter.title}
              url={postLink}
              twitter={metadata.social.twitter}
            />
          </div>
        </div>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate


export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $image: String) {
    site {
      siteMetadata {
        title
        siteUrl
        author {
          name
          summary
        }
        license
        licenseURL
        social {
          twitter
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields{
        slug
      }
      frontmatter {
        title
        dateCreated(formatString: "MMMM DD, YYYY")
        dateModified(formatString: "MMMM DD, YYYY")
        tags
        description
      }
    }
    file(relativePath: { eq: $image }) {
      childImageSharp {
        fixed {
          src
        }
      }
    }
  }
`
