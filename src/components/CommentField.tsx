import React, { useRef, useState, FormEvent, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import classNames from 'classnames';
import { EnrichedActivity, Activity } from 'getstream';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { Textarea, TextareaProps } from './Textarea';
import { inputValueFromEvent, PropsWithElementAttributes } from '../utils';
import { useFeedContext, useTranslationContext } from '../context';
import { DefaultAT, DefaultUT } from '../context/StreamApp';

// Reference the EmojiData interface from Textarea instead of defining it here
// The interface is already defined in Textarea.tsx

export type CommentFieldProps<
  UT extends DefaultUT = DefaultUT,
  AT extends DefaultAT = DefaultAT,
> = PropsWithElementAttributes<
  {
    activity: EnrichedActivity<UT, AT>;
    /** Override the default emoji dataset, library has a light set of emojis
     * to show more emojis use your own or emoji-mart sets
     * https://github.com/missive/emoji-mart#datasets
     */
    emojiData?: any; // Use any for EmojiData to avoid type conflicts
    image?: string;
    onSuccess?: () => void;
    placeholder?: string;
    targetFeeds?: string[];
    trigger?: TextareaProps['trigger'];
  },
  HTMLFormElement
>;

export const CommentField = <UT extends DefaultUT = DefaultUT, AT extends DefaultAT = DefaultAT>({
  activity,
  emojiData,
  onSuccess,
  image,
  placeholder,
  trigger,
  targetFeeds,
  className,
  style,
}: CommentFieldProps<UT, AT>) => {
  const feed = useFeedContext<UT, AT>();
  const { t } = useTranslationContext();
  const textareaReference = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState<string>('');

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement> | ReactKeyboardEvent) => {
    event.preventDefault();

    if (!text) return;

    try {
      await feed.onAddReaction('comment', activity as Activity<AT>, { text }, { targetFeeds });
    } catch (error) {
      console.error(error);
    }

    setText('');
    onSuccess?.();
  };

  useEffect(() => {
    if (!textareaReference.current) return;

    const handleFormSubmitKey = (event: KeyboardEvent) => {
      const { current: textarea } = textareaReference;
      if (event.key === 'Enter' && textarea?.nextSibling === null) {
        handleFormSubmit(event as unknown as ReactKeyboardEvent);
      }
    };

    textareaReference.current.addEventListener('keydown', handleFormSubmitKey);

    return () => {
      if (textareaReference.current) {
        textareaReference.current.removeEventListener('keydown', handleFormSubmitKey);
      }
    };
  }, [text]);

  // Ensure that t() returns a string
  const startTypingPlaceholder = typeof placeholder === 'string' ? placeholder : String(t('Start Typing...'));

  return (
    <form onSubmit={handleFormSubmit} className={classNames('raf-comment-field', className)} style={style}>
      {image && <Avatar image={image} circle size={39} />}
      <div className="raf-comment-field__group">
        <Textarea
          rows={1}
          value={text}
          placeholder={startTypingPlaceholder}
          onChange={(event) => setText(inputValueFromEvent<HTMLTextAreaElement>(event, true) || '')}
          emojiData={emojiData}
          trigger={trigger}
          maxLength={280}
          innerRef={(element) => (textareaReference.current = element)}
        />
        <Button buttonStyle="primary" disabled={!text} type="submit">
          {String(t('Post'))}
        </Button>
      </div>
    </form>
  );
};
