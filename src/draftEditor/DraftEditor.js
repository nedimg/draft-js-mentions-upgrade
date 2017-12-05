import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
// import update from 'immutability-helper';

import { EditorState, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';

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
        /*
        const labelSuggestions = nextProps.labelSuggestions.map(labelMention => {
            // extend label suggestion with `inUse` flag
            const label = { ...labelMention };
            label.inUse = nextProps.labelsInUse.find(l => l.id === label.id) !== undefined;
            return label;
        });
*/
        let { labelSuggestions } = this.state;
        labelSuggestions = labelSuggestions.update(
            labelSuggestions.findIndex(item => item.get('id') === 1),
            item => item.set('name', 'aaaaaaaaaaaaaa'),
        );

        this.setState({
            labelSuggestions,
            mentionSuggestions: fromJS(nextProps.mentionSuggestions),
        });
    }

    onSearchLabelsChange = ({ value }) => {
        let labelSuggestions = defaultSuggestionsFilter(value, fromJS(this.props.labelSuggestions));

        if (!labelSuggestions.size) {
            labelSuggestions = fromJS([{
                id: new Date().getTime(),
                name: value,
                new: true,
            }]);
        }
        this.setState({
            labelSuggestions,
        });
    }

    onSearchChange = ({ value }) => {
        const mentionSuggestions = defaultSuggestionsFilter(value, fromJS(this.props.mentionSuggestions));

        this.setState({
            mentionSuggestions,
        });
    }

    onChange = editorState => {
        this.setState({ editorState });
    }

    onAddLabel = label => {
        const labelObject = label.toObject();
        delete labelObject.new;

        if (typeof this.props.onLabel === 'function') {
            this.props.onLabel(labelObject);
        }
    }

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
        console.log(this.state.labelSuggestions.toJS());
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
    // labelsInUse: PropTypes.array,
    rawContent: PropTypes.object,
    placeholder: PropTypes.string,
};

DraftEditor.defaultProps = {
    onLabel: undefined,
    mentionSuggestions: [],
    labelSuggestions: [],
    // labelsInUse: [],
    rawContent: undefined,
    placeholder: 'Say something...',
};

export default DraftEditor;
