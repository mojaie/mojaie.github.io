const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const isDev = process.env.NODE_ENV !== "production"
  const typeDefs = [
    `type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }`,
    schema.buildObjectType({
      name: "Frontmatter",
      fields: {
        title: "String!",
        dateCreated: {
          type: "Date!",
          extensions: { dateformat: {} }
        },
        dateModified: {
          type: "Date!",
          extensions: { dateformat: {} }
        },
        draft: {
          type: "Boolean",
          resolve: source => (source.draft == null || isDev) ? false : source.draft
        },
        tags: "[String!]",
        image: "String",
        description: "String"
      },
    })
  ]
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(
    `
      {
        postsRemark: allMarkdownRemark(
          filter: { frontmatter: { draft: { eq: false } } }
          sort: { fields: [frontmatter___dateModified], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                image
                draft
              }
            }
          }
        }
        tagsGroup: allMarkdownRemark(
          filter: { frontmatter: { draft: { eq: false } } }
          limit: 2000
        ) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }
  // Create blog posts pages.
  const postsPath = path.resolve("src/templates/post.js")
  const posts = result.data.postsRemark.edges
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: postsPath,
      context: {
        slug: post.node.fields.slug,
        draft: post.node.frontmatter.draft,
        image: post.node.frontmatter.image,
        previous,
        next,
      },
    })
  })
  
  // Tag pages
  const tagsPath = path.resolve("src/templates/tag-posts.js")
  // Make tag pages
  result.data.tagsGroup.group.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagsPath,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
