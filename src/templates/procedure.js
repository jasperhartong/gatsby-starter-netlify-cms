import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import SwipeableViews from 'react-swipeable-views';
import ImageMapper from 'react-image-mapper';
import ContainerDimensions from 'react-container-dimensions';

const MAX_IMAGE_WIDTH = 300;  // Note.. also update value in pageQuery when changing!
const styles = {
    slideRoot: {
        padding: '0 15px',
        height: '50vh',
        maxWidth: '50vh'
    },
    slideContainer: {
        padding: '0 5px',
    },
    slide: {
        padding: 15,
        minHeight: '50vh',
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

const flattenImage = (image) => {
    if (image && image.childImageSharp) {
        // Is based on the graphql pageQuery
        return image.childImageSharp.fluid.src
    }
    // Is based on the ProcedurePreview
    // TODO: In preview you want to have the same pixels width so the highlights work
    return image
}

export const ProcedureStepTemplate = ({
    step,
    stepIndex
}) => {
    return (
        <div
            style={{ ...styles.slide, ...styles.slide1 }}
            className="">
            <div className="requiredWrapperForSwipingToWork">
                <ContainerDimensions>
                    {({ width }) =>
                        <ImageMapper
                            onImageClick={(event) => event.preventDefault()}
                            width={width - 10}
                            imgWidth={MAX_IMAGE_WIDTH}
                            src={flattenImage(step.image)}
                            onClick={(area, index, event) => {
                                alert(`Now we should show a nice window with extra info: ${step.highlights[index].highlighttext}`);
                            }}
                            map={{
                                name: "area-map" + stepIndex,
                                areas: !!step.highlights ? step.highlights.map((h, i) => ({
                                    name: `${i}`,
                                    shape: !!h.shapetype ? h.shapetype : 'rect',
                                    coords: !!h.coords ? h.coords.split(',') : [0, 0, 0, 0],
                                    preFillColor: "rgba(0,0,0,0.3)",
                                    fillColor: "rgba(0,0,0,0.6)"
                                }))
                                    : [], // empty when no highlights
                            }} />
                    }
                </ContainerDimensions>
            </div>
            <h2>
                {step.title}
            </h2>
            <p>
                {step.description}
            </p>
        </div>
    )
}

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
        <section className="procedure-section">
            {helmet || ''}
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <div style={{margin:15}}>
                            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                                {title}
                            </h1>
                            <p>{description}</p>
                            <PostContent content={content} />
                        </div>
                        {steps && steps.length ? (
                            <SwipeableViews enableMouseEvents={true} style={styles.slideRoot} slideStyle={styles.slideContainer}>
                                {steps.map((step, stepIndex) => (
                                    <div key={stepIndex}>
                                        <ProcedureStepTemplate step={step} stepIndex={stepIndex} />
                                    </div>
                                ))}
                            </SwipeableViews>
                        ) : null}
                    </div>
                </div>
            </div>
            {/* Hack to ensure that the image can't be dragged out, and doesn't influence swiping on desktop  */}
            <style>{`
            .procedure-section img {
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-user-drag: none;
                user-drag: none;
                -webkit-touch-callout: none;
            }
        `}</style>
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
`
