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
            entityMutability: 'IMMUTABLE',
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
            searchTerm: value,
            labelSuggestions: fromJS(filteredLabels.map(l => ({ name: l.id }))),
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
    }

    onAddLabel = label => {
        const { searchTerm } = this.state;
        let labelObject;
        if (searchTerm) {
            labelObject = {
                id: label.get('name'),
                name: searchTerm,
            };
            this.props.createNewLabel(labelObject);
        } else {
            labelObject = label.toObject();
        }
        if (typeof this.props.onLabel === 'function') {
            this.props.onLabel(label.get('name'));
        }
    }

    getRawContent = () => {
        if (this.editor) {
            return convertToRaw(this.editor.getEditorState().getCurrentContent());
        }
        return undefined;
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
        /*
        try {
            this.editor
                .getEditorState()
                .getCurrentContent()
                .getEntityMap()
                .replaceData('0', { mention: fromJS({ id: 'sasaas', name: 'designnn3' }) });
        } catch (error) {
            console.log(error);
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
    createNewLabel: PropTypes.func.isRequired,
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
    const labelSuggestions = allLabels.map(l => ({ name: l.id }));
    const labels = allLabels.map(l => ({ ...l }));

    return {
        labels,
        labelSuggestions,
    };
};

const mapDispatchToProps = dispatch => ({
    createNewLabel: label => dispatch({ type: 'CREATE', payload: label }),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DraftEditor);
