import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const LabelMention = props => {
    const {
        entityKey,  // eslint-disable-line
        mention,  // eslint-disable-line
        dispatch,  // eslint-disable-line
        children,  // eslint-disable-line
        decoratedText,  // eslint-disable-line
        label,
        inUse,
        ...parentProps
    } = props;
    const style = {
        backgroundColor: inUse ? '#f76072' : '#f2f2f2',
    };
    return (
        <span style={style} {...parentProps}>
            <span style={{ display: 'none' }}>{children}</span>
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
    const mentionId = mention.get('name');
    const label = state.labels.byId[mentionId];
    const inUse = state.labels.usedLabels.find(l => l === mentionId) !== undefined;
    return {
        label,
        inUse,
    };
};

export default connect(mapStateToProps)(LabelMention);
