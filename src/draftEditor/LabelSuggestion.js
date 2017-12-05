import React from 'react';
import PropTypes from 'prop-types';

class LabelSuggestion extends React.Component {
    renderCreateNew() {
        const { mention, searchValue, ...parentProps } = this.props;
        return (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f2f2f2' }} key={mention.get('id')} {...parentProps}>
                + Create &quot;<strong>{searchValue}</strong>&quot;
            </div>
        );
    }

    renderLabel() {
        const {
            mention,
            theme,
            searchValue, // eslint-disable-line no-unused-vars
            isFocused, // eslint-disable-line no-unused-vars
            ...parentProps
        } = this.props;
        console.log(mention.get('name'), mention.get('inUse'));
        return (
            <div key={mention.get('id')} {...parentProps}>
                <div className={theme.mentionSuggestionsEntryContainer}>
                    <div className={theme.mentionSuggestionsEntryContainerRight}>
                        <div className={theme.mentionSuggestionsEntryText}>
                            {mention.get('name')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { mention } = this.props;
        if (mention.get('new')) {
            return this.renderCreateNew();
        }
        return this.renderLabel();
    }
}

LabelSuggestion.propTypes = {
    mention: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    searchValue: PropTypes.string, // eslint-disable-line no-unused-vars
    isFocused: PropTypes.bool, // eslint-disable-line no-unused-vars
};

LabelSuggestion.defaultProps = {
    searchValue: undefined,
    isFocused: false,
};

export default LabelSuggestion;
