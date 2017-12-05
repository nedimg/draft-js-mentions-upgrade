import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

import { EditorState, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';

// import MentionPopover from './MentionPopover';
import LabelEntry from './LabelEntry';

import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';

class DraftEditor extends React.Component {
    constructor(props) {
        super(props);

        this._emojiPlugin = createEmojiPlugin();
        this._mentionPlugin = createMentionPlugin();
        this._labelsPlugin = createMentionPlugin({
            mentionPrefix: '#',
            mentionTrigger: '#',
            // mentionComponent: MentionPopover,
        });

        this._plugins = [this._mentionPlugin, this._labelsPlugin, this._emojiPlugin];

        this.mentions = fromJS(props.mentions);

        this.state = {
            editorState: props.rawContent ? EditorState.createWithContent(convertFromRaw(props.rawContent)) : EditorState.createEmpty(),
            mentions: this.mentions,
            labels: fromJS(props.labels),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mentions: fromJS(nextProps.mentions),
            labels: fromJS(nextProps.labels),
        });
    }

    onSearchLabelsChange = ({ value }) => {
        let labels = defaultSuggestionsFilter(value, fromJS(this.props.labels));

        if (!labels.size) {
            labels = fromJS([{
                id: -1,
                name: value,
            }]);
        }
        this.setState({
            labels,
        });
    }

    onSearchChange = ({ value }) => {
        const mentions = defaultSuggestionsFilter(value, this.state.mentions);

        this.setState({
            mentions,
        });
    }

    onChange = editorState => {
        this.setState({ editorState });
    }

    onAddLabel = label => {
        const labelObject = label.toObject();
        const { id, name } = labelObject;
        if (id === -1 && typeof this.props.onCreateLabel === 'function') {
            this.props.onCreateLabel(name);
        }
    }

    focus = () => {
        this.editor.focus();
    }

    renderMentionSuggestions() {
        if (this.state.mentions) {
            const { MentionSuggestions } = this._mentionPlugin;
            return (
                <MentionSuggestions
                    onSearchChange={this.onSearchChange}
                    suggestions={this.state.mentions}
                />
            );
        }
        return undefined;
    }

    renderLabelSuggestions() {
        const { MentionSuggestions } = this._labelsPlugin;
        return (
            <MentionSuggestions
                onSearchChange={this.onSearchLabelsChange}
                suggestions={this.state.labels}
                onAddMention={this.onAddLabel}
                entryComponent={LabelEntry}
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
                <div onKeyPress={this.focus} onClick={this.focus}>
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
            </div>
        );
    }
}

DraftEditor.propTypes = {
    // onChange: PropTypes.func,
    onCreateLabel: PropTypes.func,
    mentions: PropTypes.array,
    labels: PropTypes.array,
    rawContent: PropTypes.object,
    placeholder: PropTypes.string,
};

DraftEditor.defaultProps = {
    onCreateLabel: undefined,
    mentions: [],
    labels: [],
    rawContent: undefined,
    placeholder: 'Say something...',
};

export default DraftEditor;
