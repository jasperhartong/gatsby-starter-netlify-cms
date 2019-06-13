import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import SwipeableViews from 'react-swipeable-views';
import ImageMapper from 'react-image-mapper';

const styles = {
    root: {
        padding: '0 30px',
    },
    slideContainer: {
        padding: '0 10px',
    },
    slide: {
        padding: 15,
        minHeight: '60vh',
        color: '#fff',
    },
    slide1: {
        backgroundColor: '#FEA900',
    },
    slide2: {
        backgroundColor: '#B3DC4A',
    },
    slide3: {
        backgroundColor: '#6AC0FF',
    },
};

export const ProcedureTemplate = ({
    content,
    contentComponent,
    description,
    steps,
    title,
    helmet,
}) => {
    const PostContent = contentComponent || Content

    return (
        <section className="section">
            {helmet || ''}
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                            {title}
                        </h1>
                        <p>{description}</p>
                        <PostContent content={content} />
                        {steps && steps.length ? (
                            <div style={{ marginTop: `4rem` }}>
                                <h4>Steps</h4>
                                <SwipeableViews enableMouseEvents={true} style={styles.root} slideStyle={styles.slideContainer}>
                                    {steps.map((step, stepIndex) => (
                                        <div
                                            key={step.title}
                                            style={{ ...styles.slide, ...styles.slide1 }}
                                            className="">
                                            <h2>
                                                {step.title}
                                            </h2>
                                            <p>
                                                {step.description}
                                            </p>
                                            <ImageMapper
                                                width={300}
                                                src={step.image.childImageSharp.fluid.src}
                                                map={{
                                                    name: "area-map" + stepIndex,
                                                    areas: step.highlights.map((h, i) => ({ name: `${i}`, shape: h.shapetype, coords: h.coords.split(','), preFillColor: "rgba(0,0,0,0.3)", fillColor: "rgba(0,0,0,0.6)" })),
                                                }} />
                                        </div>
                                    ))}
                                </SwipeableViews>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    )
}

ProcedureTemplate.propTypes = {
    content: PropTypes.node.isRequired,
    contentComponent: PropTypes.func,
    description: PropTypes.string,
    title: PropTypes.string,
    helmet: PropTypes.object,
}

const Procedure = ({ data }) => {
    const { markdownRemark: post } = data

    return (
        <Layout>
            <ProcedureTemplate
                content={post.html}
                contentComponent={HTMLContent}
                description={post.frontmatter.description}
                helmet={
                    <Helmet titleTemplate="%s | Blog">
                        <title>{`${post.frontmatter.title}`}</title>
                        <meta
                            name="description"
                            content={`${post.frontmatter.description}`}
                        />
                    </Helmet>
                }
                steps={post.frontmatter.steps}
                title={post.frontmatter.title}
            />
        </Layout>
    )
}

Procedure.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.object,
    }),
}

export default Procedure

export const pageQuery = graphql`
  query ProcedureByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        steps {
            description
            image {
                childImageSharp {
                    fluid(maxWidth: 240, quality: 64) {
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
`
