import React from 'react';
import PropTypes from 'prop-types';

class MentionPopover extends React.Component {
    onCreateNewClick = () => {
        console.log('aaaaaaaaaaaaa');
    }
    render() {
        return (
            <div>
                {this.props.children}
                <br />
                <button onClick={this.onCreateNewClick}>Test</button>
            </div>
        );
    }
}

MentionPopover.propTypes = {
    children: PropTypes.array,
};

MentionPopover.defaultProps = {
    children: [],
};

export default MentionPopover;
