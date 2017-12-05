import React from 'react';
import PropTypes from 'prop-types';

class Label extends React.Component {
    onClick = () => {
        this.props.onClick(this.props.label);
    }

    render() {
        const style = {
            display: 'flex', marginRight: 4, padding: '4px 8px', borderRadius: 3, backgroundColor: '#f2f2f2',
        };
        const { label } = this.props;
        return (
            <div style={style}>
                <span onKeyPress={this.onRemoveLabel} onClick={this.onRemoveLabel} key={label.id}>{label.name}</span>
            </div>
        );
    }
}

Label.propTypes = {
    label: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

Label.defaultProps = {
};

export default Label;
