import React, { useMemo } from 'react';
import classNames from 'classnames';
// Use the types from @types/webscopeio__react-textarea-autocomplete but import from the new package
// @ts-ignore - Using types from the original package but importing from the forked package
import ReactTextareaAutocomplete, { TriggerType } from 'react-textarea-autocomplete';
import { LoadingIndicator } from 'react-file-utils';
import { UR } from 'getstream';
// Remove unused import
import defaultEmojiData from '../utils/emojiData';
import { PropsWithElementAttributes } from '../utils';

// Define interfaces based on emoji-mart structure
interface EmojiData {
  aliases: Record<string, string>;
  emojis: Record<string, any>;
  originalPool?: boolean;
}

interface EmojiEntity {
  id: string;
  native: string;
  unified: string;
  shortcodes?: string;
}

// Create a simple emoji index for search functionality
class EmojiIndex {
  constructor(private emojiData: EmojiData) {}

  search(value: string) {
    if (!value) return [];

    const results: EmojiEntity[] = [];
    const searchValue = value.toLowerCase();

    // Simple search based on emoji id starts with the search value
    Object.entries(this.emojiData.emojis || {}).forEach(([id, emoji]: [string, any]) => {
      if (id.toLowerCase().startsWith(searchValue)) {
        results.push({
          id,
          native: emoji.native || emoji.unicode,
          unified: emoji.unified || '',
          shortcodes: emoji.shortcodes || id,
        });
      }
    });

    return results;
  }
}

export type TextareaProps = PropsWithElementAttributes<{
  /** Override the default emoji dataset, library has a light set of emojis
   * to show more emojis use your own or emoji-mart sets
   * https://github.com/missive/emoji-mart#datasets
   */
  emojiData?: EmojiData;
  /** A ref that is bound to the textarea element */
  innerRef?:
    | React.MutableRefObject<HTMLTextAreaElement | undefined | null>
    | ((el: HTMLTextAreaElement | null) => void);
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

const emojiTrigger = (emojiData: EmojiData): TriggerType<EmojiEntity> => {
  // @ts-ignore - EmojiIndex is not properly typed
  const emojiIndex = new EmojiIndex(emojiData);
  return {
    ':': {
      dataProvider: (token: string) => {
        return emojiIndex.search(token) || [];
      },
      output: (item: EmojiEntity) => ({ key: item.id, text: item.native, caretPosition: 'next' }),
      match: /\B:([-+\w]*)$/,
      minChar: 1,
      component: function AutocompleteItem({ entity }: { entity: EmojiEntity }) {
        if (entity && emojiData.emojis && entity.id in emojiData.emojis) {
          return <div>{entity.native}</div>;
        }
        return null;
      },
    },
  };
};

export const Textarea = ({
  emojiData = defaultEmojiData as unknown as EmojiData,
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
      innerRef: (el: HTMLTextAreaElement | null) => {
        if (typeof innerRef === 'function') {
          innerRef(el);
        } else if (innerRef) {
          innerRef.current = el || undefined;
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
