import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const LabelMention = props => {
    const { label, inUse } = props;
    const style = {
        backgroundColor: inUse ? '#f76072' : '#f2f2f2',
    };
    return (
        <span style={style}>
            #{label.name}
        </span>
    );
};

LabelMention.propTypes = {
    label: PropTypes.object.isRequired,
    inUse: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const { mention } = ownProps;
    const mentionId = mention.get('id');
    const label = state.labels.byId[mentionId];
    const inUse = state.labels.usedLabels.find(l => l === mentionId) !== undefined;
    return {
        label,
        inUse,
    };
};

export default connect(mapStateToProps)(LabelMention);
