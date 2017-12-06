import React from 'react';
import PropTypes from 'prop-types';
import { Entity } from 'draft-js';

class LabelMention extends React.Component {
    onCreateNewClick = () => {
        console.log('aaaaaaaaaaaaa');
    }
    render() {
        const { mention } = this.props;
        // console.log(mention.get('name'), mention.get('inUse'));
        // const aaa = Entity.get(entityKey);
        // console.log(aaa);
        const style = {
            backgroundColor: mention.get('inUse') ? '#f76072' : '#f2f2f2',
        };
        return (
            <span style={style}>
                {this.props.children}
                {/* #{mention.get('name') */}
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
