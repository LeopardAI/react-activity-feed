// @flow
import React from 'react';

import LoadingIndicator from './LoadingIndicator';

import { emojiIndex } from 'emoji-mart';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/style.css';

export type Props = {|
  rows: number,
  placeholder: string,
  onChange: (event: SyntheticEvent<HTMLTextAreaElement>) => mixed,
  value?: string,
  innerRef?: any,
|};

const AutocompleteItem = ({ entity: { id, native } }) => (
  <div>
    {native} {id}
  </div>
);

/**
 * Component is described here.
 *
 * @example ./examples/Textarea.md
 */
export default class Textarea extends React.Component<Props> {
  static defaultProps = {
    rows: 3,
    placeholder: 'Share your opinion',
  };

  render() {
    const { innerRef } = this.props;
    return (
      <ReactTextareaAutocomplete
        loadingComponent={LoadingIndicator}
        trigger={{
          ':': {
            dataProvider: (token) => {
              const emojis = emojiIndex.search(token) || [];
              return emojis.slice(0, 10);
            },
            component: AutocompleteItem,
            output: (item) => ({
              key: item.id,
              text: item.native,
              caretPosition: 'next',
            }),
          },
        }}
        innerRef={
          innerRef &&
          ((ref) => {
            innerRef.current = ref;
          })
        }
        rows={this.props.rows}
        className="raf-textarea"
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        onSelect={this.props.onChange}
        value={this.props.value}
      />
    );
  }
}
