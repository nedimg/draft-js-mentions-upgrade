import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import uuid from 'js-uuid';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';

import suggestionsFilter from './suggestionsFilter';
import LabelMention from './LabelMention';
import LabelSuggestion from './LabelSuggestion';

import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';

class DraftEditor extends React.Component {
    constructor(props) {
        super(props);

        this._emojiPlugin = createEmojiPlugin();
        this._mentionPlugin = createMentionPlugin();
        this._labelPlugin = createMentionPlugin({
            mentionPrefix: '#',
            mentionTrigger: '#',
            mentionComponent: LabelMention,
        });

        this._plugins = [this._mentionPlugin, this._labelPlugin, this._emojiPlugin];

        this.state = {
            editorState: props.rawContent ? EditorState.createWithContent(convertFromRaw(props.rawContent)) : EditorState.createEmpty(),
            mentionSuggestions: fromJS(props.mentionSuggestions),
            labelSuggestions: fromJS(props.labelSuggestions),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            labelSuggestions: fromJS(nextProps.labelSuggestions),
            mentionSuggestions: fromJS(nextProps.mentionSuggestions),
        });
    }

    onSearchLabelsChange = ({ value }) => {
        const filteredLabels = suggestionsFilter(value, this.props.labels);

        const hasNoExactMatch = filteredLabels.find(label => (label.name === value)) === undefined;

        if (hasNoExactMatch && filteredLabels.length < 3) {
            // push a new label suggestion (CREATE)
            filteredLabels.push({ id: uuid.v4() });
        }

        this.setState({
            labelSuggestions: fromJS(filteredLabels.map(label => ({ id: label.id }))),
        });
    }

    onSearchChange = ({ value }) => {
        const mentionSuggestions = suggestionsFilter(value, fromJS(this.props.mentionSuggestions));

        this.setState({
            mentionSuggestions,
        });
    }

    onChange = editorState => {
        this.setState({ editorState });

        if (typeof this.props.onLabel === 'function') {
            if (this.label) {
                this.props.onLabel(this.label);
                delete this.label;
            }
        }
    }

    onAddLabel = label => {
        const labelObject = label.toObject();
        if (typeof this.props.onLabel === 'function') {
            this.props.onLabel(labelObject);
        }
    }

    getRawContent = () => convertToRaw(this.editor.getEditorState().getCurrentContent());

    focus = () => {
        this.editor.focus();
    }

    renderMentionSuggestions() {
        const { MentionSuggestions } = this._mentionPlugin;
        return (
            <MentionSuggestions
                onSearchChange={this.onSearchChange}
                suggestions={this.state.mentionSuggestions}
            />
        );
    }

    renderLabelSuggestions() {
        const { MentionSuggestions } = this._labelPlugin;
        // console.log(this.state.labelSuggestions.toJS().length);
        /*
        let { labelSuggestions } = this.state;
        if (labelSuggestions.size > 3) {
            console.log('do the update');
            labelSuggestions = labelSuggestions.update(
                labelSuggestions.findIndex(item => item.get('name') === 'design'),
                item => item.set('inUse', true),
            );
            this.editor
                .getEditorState()
                .getCurrentContent()
                .getEntityMap()
                .replaceData('1', { mention: fromJS({ name: 'design', inUse: true }) });
        }
        */
        return (
            <MentionSuggestions
                onSearchChange={this.onSearchLabelsChange}
                suggestions={this.state.labelSuggestions}
                onAddMention={this.onAddLabel}
                entryComponent={LabelSuggestion}
            />
        );
    }

    renderEmojiSuggestions() {
        const { EmojiSuggestions /* , EmojiSelect */ } = this._emojiPlugin;
        return <EmojiSuggestions />;
    }

    render() {
        const style1 = {
            display: 'flex', flexDirection: 'column', width: 300, height: 300, padding: 10, border: '1px solid #efefef',
        };
        return (
            <div style={style1}>
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    plugins={this._plugins}
                    placeholder={this.props.placeholder}
                    ref={element => { this.editor = element; }}
                />
                {this.renderEmojiSuggestions()}
                {this.renderMentionSuggestions()}
                {this.renderLabelSuggestions()}
            </div>
        );
    }
}

DraftEditor.propTypes = {
    // onChange: PropTypes.func,
    onLabel: PropTypes.func,
    mentionSuggestions: PropTypes.array,
    labelSuggestions: PropTypes.array,
    labels: PropTypes.array,
    rawContent: PropTypes.object,
    placeholder: PropTypes.string,
};

DraftEditor.defaultProps = {
    onLabel: undefined,
    mentionSuggestions: [],
    labelSuggestions: [],
    labels: [],
    rawContent: undefined,
    placeholder: 'Say something...',
};

const mapStateToProps = state => {
    const allLabels = Object.values(state.labels.byId);
    const labelSuggestions = allLabels.map(l => ({ id: l.id }));
    const labels = allLabels.map(l => ({ ...l }));

    return {
        labels,
        labelSuggestions,
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(DraftEditor);
