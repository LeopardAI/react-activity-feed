import React, { useMemo } from 'react';
import classNames from 'classnames';
// Use the types from @types/webscopeio__react-textarea-autocomplete but import from the new package
// @ts-ignore - Using types from the original package but importing from the forked package
import ReactTextareaAutocomplete, { TriggerType } from 'react-textarea-autocomplete';
import { LoadingIndicator } from 'react-file-utils';
import { BaseEmoji } from 'emoji-mart';
import { UR } from 'getstream';
import { Data as EmojiDataSet } from 'emoji-mart';
// @ts-ignore - Missing type definitions for emoji-mart internals
import EmojiIndex from 'emoji-mart/dist/utils/emoji-index/nimble-emoji-index';
import defaultEmojiData from '../utils/emojiData';
import { PropsWithElementAttributes } from '../utils';

export type TextareaProps = PropsWithElementAttributes<{
  /** Override the default emoji dataset, library has a light set of emojis
   * to show more emojis use your own or emoji-mart sets
   * https://github.com/missive/emoji-mart#datasets
   */
  emojiData?: EmojiDataSet;
  /** A ref that is bound to the textarea element */
  innerRef?: React.MutableRefObject<HTMLTextAreaElement | undefined> | ((el: HTMLTextAreaElement) => void);
  maxLength?: number;
  onChange?: (event: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  /** An extra trigger for ReactTextareaAutocomplete, this can be used to show
   * a menu when typing @xxx or #xxx, in addition to the emoji menu when typing :xxx
   */
  trigger?: TriggerType<UR>;
  value?: string;
}>;

const emojiTrigger: (emojiData: EmojiDataSet) => TriggerType<BaseEmoji> = (emojiData) => {
  const emojiIndex = new EmojiIndex(emojiData);
  return {
    ':': {
      dataProvider: (token: string) => {
        return emojiIndex.search(token) || [];
      },
      // Define a proper type for item
      output: (item: BaseEmoji) => ({ key: item.id, text: item.native, caretPosition: 'next' }),
      match: /\B:([-+\w]*)$/,
      minChar: 1,
      component: function AutocompleteItem({ entity }: { entity: { id: string; native: string } }) {
        const emoji = emojiData.emojis[entity.id];
        if (emoji) {
          return <div>{entity.native}</div>;
        }
        return null;
      },
    },
  };
};

export const Textarea = ({
  emojiData = defaultEmojiData,
  innerRef,
  maxLength,
  onChange,
  onPaste,
  placeholder = 'Share your opinion',
  rows = 3,
  trigger = {},
  value,
  className,
  style,
}: TextareaProps) => {
  const emojiReactTextareaAutocompleteProps = useMemo(() => {
    return {
      trigger: { ...emojiTrigger(emojiData), ...trigger },
      loadingComponent: LoadingIndicator,
      minChar: 0,
      innerRef: (el: HTMLTextAreaElement) => {
        if (typeof innerRef === 'function') {
          innerRef(el);
        } else if (innerRef) {
          innerRef.current = el;
        }
      },
    };
  }, [emojiData, innerRef, trigger]);

  return (
    <ReactTextareaAutocomplete
      {...emojiReactTextareaAutocompleteProps}
      rows={rows}
      maxLength={maxLength}
      className={classNames('raf-textarea__textarea', className)}
      style={style}
      containerClassName="raf-textarea"
      dropdownClassName="raf-emojisearch"
      listClassName="raf-emojisearch__list"
      itemClassName="raf-emojisearch__item"
      placeholder={placeholder}
      onChange={onChange}
      onSelect={onChange}
      onPaste={onPaste}
      value={value}
    />
  );
};
