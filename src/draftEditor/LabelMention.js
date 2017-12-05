import React from 'react';
import PropTypes from 'prop-types';

class LabelMention extends React.Component {
    onCreateNewClick = () => {
        console.log('aaaaaaaaaaaaa');
    }
    render() {
        const { mention } = this.props;
        // console.log(mention);
        const style = {
            backgroundColor: mention.get('inUse') ? '#f76072' : '#f2f2f2',
        };
        return (
            <span style={style}>
                {this.props.children}
            </span>
        );
    }
}

LabelMention.propTypes = {
    children: PropTypes.array,
    mention: PropTypes.object.isRequired,
};

LabelMention.defaultProps = {
    children: [],
};

export default LabelMention;
