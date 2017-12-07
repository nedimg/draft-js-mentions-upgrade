import React from 'react';
import PropTypes from 'prop-types';

import DraftEditor from './draftEditor/DraftEditor';
import Label from './Label';
import mentions from './mentions';
import { connect } from 'react-redux';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onLabelAdded = id => {
        console.log('onLabelAdded', id);
        /*
        const { current } = this.state;

        // check if label already added
        if (current.findIndex(l => l.name === label.name) === -1) {
            current.push(label);
            this.setState({ current });
        }
        */
        this.props.doLabel(id);
    }

    onLabelRemoved = ({ id }) => {
        this.props.doUnlabel(id);
        /*
        const { current } = this.state;
        const labelIndex = current.findIndex(l => l.name === label.name);
        current.splice(labelIndex, 1);
        this.setState({ current });
        */
    }

    renderLabels() {
        const { labelsInUse } = this.props;
        const labels = labelsInUse.map(l => <Label key={l.id} label={l} onRemove={this.onLabelRemoved} />);
        return (
            <div style={{ display: 'flex', margin: '8px 0px' }}>
                {labels}
            </div>
        );
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4>Test mentions and labels</h4>
                <DraftEditor mentionSuggestions={this.props.mentions} onLabel={this.onLabelAdded} />
                {this.renderLabels()}
            </div>
        );
    }
}

App.propTypes = {
    doLabel: PropTypes.func.isRequired,
    doUnlabel: PropTypes.func.isRequired,
    mentions: PropTypes.array,
    labelsInUse: PropTypes.array,
};

App.defaultProps = {
    mentions: [],
    labelsInUse: [],
};

const mapStateToProps = state => {
    const labelsInUse = state.labels.usedLabels.map(labelId => state.labels.byId[labelId]);
    return {
        labelsInUse,
        mentions,
    };
};

const mapDispatchToProps = dispatch => ({
    doLabel: id => dispatch({ type: 'DO_LABEL', payload: id }),
    doUnlabel: id => dispatch({ type: 'DO_UNLABEL', payload: id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

