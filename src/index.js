import React from 'react';
import ReactDOM from 'react-dom';

import DraftEditor from './draftEditor/DraftEditor';
import Label from './Label';

import mentions from './mentions';
import labelsDefault from './labels';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            labels: JSON.parse(JSON.stringify(labelsDefault)),
            current: [],
        };
    }

    onLabelAdded = label => {
        const { current, labels } = this.state;

        // if totally new label (is not in labels array)
        if (labels.findIndex(l => l.id === label.id) === -1) {
            labels.push(label);
            this.setState({ labels });
        }

        // check if label already added
        if (current.findIndex(l => l.id === label.id) === -1) {
            current.push(label);
            this.setState({ current });
        }
    }

    onLabelRemoved = label => {
        const { current } = this.state;
        const labelIndex = current.findIndex(l => l.id === label.id);
        current.splice(labelIndex, 1);
        this.setState({ current });
    }

    renderLabels() {
        const { current } = this.state;
        const labels = current.map(l => <Label key={l.id} label={l} onRemove={this.onLabelRemoved} />);
        return (
            <div style={{ display: 'flex', margin: '8px 0px' }}>
                {labels}
            </div>
        );
    }

    render() {
        return (
            <div>
                <h4>Test mentions and labels</h4>
                <DraftEditor mentionSuggestions={mentions} labelSuggestions={this.state.labels} labelsInUse={this.state.current} onLabel={this.onLabelAdded} />
                {this.renderLabels()}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
    window.React = React; // Enable react devtools
}
