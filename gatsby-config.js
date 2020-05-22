module.exports = {
  siteMetadata: {
    title: `mojaie.github.io`,
    author: {
      name: `Seiji Matsuoka`,
      summary: `Cheminformatics, Biointeraction and Laboratory automation`,
    },
    description: `Cheminformatics, Biointeraction and Laboratory automation`,
    siteUrl: `https://mojaie.github.io/`,
    license: `CC BY 4.0`,
    licenseURL: `https://creativecommons.org/licenses/by/4.0/legalcode`,
    social: {
      twitter: `mojaie`,
      github: `mojaie`,
      linkedin: `seiji-matsuoka-83802a2b`
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges
                .map(edge => {
                  return Object.assign({}, edge.node.frontmatter, {
                    description: edge.node.excerpt,
                    date: edge.node.frontmatter.dateModified,
                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug
                  })
                })
            },
            query: `{
              allMarkdownRemark(
                filter: {frontmatter: {draft: {ne: true}}}
                sort: { order: DESC, fields: [frontmatter___dateModified] }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      dateModified
                    }
                  }
                }
              }
            }`,
            output: "/rss.xml"
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `mojaie.github.io`,
        short_name: `mojaie.github.io`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/shiocombu.png`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/tags/*`],
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage(
            filter: {context: {draft: {ne: true}}}
          ) {
            nodes {
              path
            }
          }
        }`
      }
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet-async`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    }
  ],
}
