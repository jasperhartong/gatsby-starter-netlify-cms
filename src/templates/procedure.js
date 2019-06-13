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
        <section className="section procedure-section">
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
                                            <div className="requiredWrapperForSwipingToWork">
                                                <ContainerDimensions>
                                                    {({ width }) =>
                                                        <ImageMapper
                                                            onImageClick={(event) => event.preventDefault()}
                                                            width={width - 10}
                                                            imgWidth={MAX_IMAGE_WIDTH}
                                                            src={step.image.childImageSharp.fluid.src}
                                                            onClick={(area, index, event) => {
                                                                alert(`Now we should show a nice window with extra info: ${step.highlights[index].highlighttext}`);
                                                            }}
                                                            map={{
                                                                name: "area-map" + stepIndex,
                                                                areas: step.highlights.map((h, i) => ({ name: `${i}`, shape: h.shapetype, coords: h.coords.split(','), preFillColor: "rgba(0,0,0,0.3)", fillColor: "rgba(0,0,0,0.6)" })),
                                                            }} />
                                                    }
                                                </ContainerDimensions>
                                            </div>
                                        </div>
                                    ))}
                                </SwipeableViews>
                            </div>
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
