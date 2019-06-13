import React from 'react'
import PropTypes from 'prop-types'
import { ProcedureTemplate } from '../../templates/procedure';

const ProcedurePreview = ({ entry, widgetFor, widgetsFor }) => {
    const steps = widgetsFor('steps').toJS().map(s => s.data);
    return <ProcedureTemplate
        content={widgetFor('body')}
        description={entry.getIn(['data', 'description'])}
        steps={steps}
        title={entry.getIn(['data', 'title'])}
    />
}

ProcedurePreview.propTypes = {
    entry: PropTypes.shape({
        getIn: PropTypes.func,
    }),
    widgetFor: PropTypes.func,
}

export default ProcedurePreview
