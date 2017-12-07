import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Entity } from 'draft-js';
import { fromJS } from 'immutable';

const LabelMention = props => {
    const {
        entityKey,
        mention,
        dispatch,
        children,
        label,
        inUse,
        ...parentProps
    } = props;
    const style = {
        backgroundColor: inUse ? '#f76072' : '#f2f2f2',
    };
    return (
        <span style={style} {...parentProps}>
            {children}
        </span>
    );
};

LabelMention.propTypes = {
    label: PropTypes.object.isRequired,
    inUse: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const { mention, entityKey } = ownProps;
    const mentionId = mention.get('name');
    const label = state.labels.byId[mentionId];
    // Entity.get(entityKey).replaceData('1', { mention: fromJS(label) });
    console.log(Entity.get(entityKey));
    const inUse = state.labels.usedLabels.find(l => l === mentionId) !== undefined;
    return {
        label,
        inUse,
    };
};

export default connect(mapStateToProps)(LabelMention);
