import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import { HTMLContent } from './Content';

class ProcedureRoll extends React.Component {
  render() {
    const { data } = this.props
    const { edges: procedures } = data.allMarkdownRemark

    return (
      <div className="columns is-multiline">
        {procedures &&
          procedures.map(({ node: procedure }) => (
            <div className="is-parent column is-6" key={procedure.id}>
              <article
                className={`blog-list-item tile is-child box notification`}
              >
                <header>
                  {procedure.frontmatter.steps && procedure.frontmatter.steps.length > 0  ? (
                    <div className="featured-thumbnail">
                      <PreviewCompatibleImage
                        imageInfo={{
                          image: procedure.frontmatter.steps[0].image.childImageSharp.fluid.src,
                          alt: `featured image thumbnail for procedure ${
                            procedure.title
                          }`,
                        }}
                      />
                    </div>
                  ) : null}
                  <p className="post-meta">
                    <Link
                      className="title has-text-primary is-size-4"
                      to={procedure.fields.slug}
                    >
                      {procedure.frontmatter.title}
                    </Link>
                    <span> &bull; </span>
                    <span className="subtitle is-size-5 is-block">
                      {procedure.frontmatter.date}
                    </span>
                  </p>
                </header>
                <HTMLContent content={procedure.html} />                  
              </article>
            </div>
          ))}
      </div>
    )
  }
}

ProcedureRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}
export default () => (
  <StaticQuery
    query={graphql`
      query ProcedureQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "procedure" } } }
        ) {
          edges {
            node {
                id
                html
                fields {
                    slug
                }
                frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    title
                    description
                    steps {
                        description
                        image {
                            childImageSharp {
                                fluid(maxWidth: 300, quality: 64) {
                                ...GatsbyImageSharpFluid
                                }
                            }
                        }
                        title
                        highlights {
                            coords
                            highlighttext
                            shapetype
                        }
                    }
                }
            }
          }
        }
      }
    `}
    render={(data, count) => <ProcedureRoll data={data} count={count} />}
  />
)
