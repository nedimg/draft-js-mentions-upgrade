import React from 'react';
import ReactDOM from 'react-dom';

import DraftEditor from './DraftEditor';
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

    onLabelCreated = name => {
        const { labels } = this.state;
        const label = {
            id: new Date().getTime(),
            name,
        };
        labels.push(label);
        this.setState({ labels });
        this.onLabelAdded(label);
    }

    onLabelAdded = label => {
        const { current } = this.state;
        current.push(label);
        this.setState({ current });
    }

    onLabelRemoved = label => {
        const { current } = this.state;
        const labelIndex = current.findIndex(l => l.id === label.id);
        current.splice(labelIndex, 1);
        this.setState({ current });
    }

    renderLabels() {
        const { current } = this.state;
        const labels = current.map(l => <Label key={l.id} label={l} onClick={this.onLabelRemoved} />);
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
                <DraftEditor mentions={mentions} labels={this.state.labels} onLabel={this.onLabelAdded} onCreateLabel={this.onLabelCreated} />
                {this.renderLabels()}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
    window.React = React; // Enable react devtools
}
