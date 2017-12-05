import React from 'react';
import ReactDOM from 'react-dom';

import DraftEditor from './DraftEditor';
import mentions from './mentions';
import labelsDefault from './labels';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            labels: JSON.parse(JSON.stringify(labelsDefault)),
        };
    }

    onLabelCreated = name => {
        const { labels } = this.state;
        labels.push({
            id: new Date().getTime(),
            name,
        });
        this.setState({ labels });
    }

    render() {
        return (
            <div>
                <h4>Test mentions and labels</h4>
                <DraftEditor mentions={mentions} labels={this.state.labels} onCreateLabel={this.onLabelCreated} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
    window.React = React; // Enable react devtools
}
