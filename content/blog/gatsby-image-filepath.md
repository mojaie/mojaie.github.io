---
title: gatsby-imageで生成された画像ファイルのパス
dateCreated: 2020-11-03
dateModified: 2020-11-03
tags:
  - Gatsby
  - GraphQL
  - static site generator
---

gatsby-imageで生成された画像ファイルがpublicのどこに保存されているのかわからなかった。


### 環境

- gatsby: 2.21.16,
- gatsby-image: 2.4.2


### frontmatterでTwitter cardに使う画像を設定する

```
title: hogehoge
image: images/cool_picture.png
```

frontmatterのimageを取得するところまではわかったが、src/component/seo.jsでtwitter:imageタグのcontentには絶対パスを渡さないといけないので、public以下のどのフォルダに生成された画像が保存されているのか知る必要があった。

### GraphQL

```javascript
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $image: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields{
        slug
      }
      frontmatter {
        title
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
```

createPagesでpageQueryにfrontmatterのimageを渡して、relativePathがimageに一致するレコードを検索する(relativePathはgatsby-source-filesystemで指定したパスを基準にした相対パス)。childImageSharpのfixedやfluidなどに各環境用に生成する画像のプロパティが格納されており、その中のsrcにpublicを基準にした相対パスが入っているので、ベースURL(siteMetadata.siteUrl)と連結すればWeb上での絶対パスになる。

あまり細かくドキュメントはされていないので、その都度gatsby developでGraphQLの構造の確認とクエリのテストをしておくのが良さそうである。
