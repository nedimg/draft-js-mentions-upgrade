import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

class LabelSuggestion extends React.Component {
    /*
    createNewLabel = e => {
        const { mention, searchValue } = this.props;
        this.props.createNewLabel({
            id: mention.get('name'),
            name: searchValue,
        });
        this.props.onMouseDown(e);
    }
    */
    renderCreateNew() {
        const {
            searchValue,
            // createNewLabel, // eslint-disable-line
            dispatch, // eslint-disable-line
            isFocused, // eslint-disable-line
            ...parentProps
        } = this.props;

        return (
            <button style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f2f2f2' }} {...parentProps}>
                + Create &quot;<strong>{searchValue}</strong>&quot;
            </button>
        );
    }

    renderLabel() {
        const {
            label,
            dispatch,
            searchValue,
            isFocused,
            // createNewLabel,
            theme,
            ...parentProps
        } = this.props;

        return (
            <div key={label.id} {...parentProps}>
                <div className={theme.mentionSuggestionsEntryContainer}>
                    <div className={theme.mentionSuggestionsEntryContainerRight}>
                        <div className={theme.mentionSuggestionsEntryText}>
                            {label.name}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { label } = this.props;
        return label ? this.renderLabel() : this.renderCreateNew();
    }
}

LabelSuggestion.propTypes = {
    // createNewLabel: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    mention: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    label: PropTypes.object,
    searchValue: PropTypes.string, // eslint-disable-line no-unused-vars
    isFocused: PropTypes.bool, // eslint-disable-line no-unused-vars
};

LabelSuggestion.defaultProps = {
    searchValue: undefined,
    isFocused: false,
    label: undefined,
};

const mapStateToProps = (state, ownProps) => {
    const { mention } = ownProps;
    const label = state.labels.byId[mention.get('name')];
    return {
        label,
    };
};
/*
const mapDispatchToProps = dispatch => ({
    createNewLabel: label => dispatch({ type: 'CREATE', payload: label }),
});
*/

export default connect(mapStateToProps)(LabelSuggestion);
