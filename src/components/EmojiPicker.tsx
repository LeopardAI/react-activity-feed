import React, { useRef, useState } from 'react';
import classNames from 'classnames';
// Use the new emoji-mart packages, but only import what we need
import Picker from '@emoji-mart/react';

import defaultEmojiData from '../utils/emojiData';
import { useTranslationContext } from '../context';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { EmojiIcon } from './Icons';
import { TFunction } from 'i18next';
// Create our own interface for PartialI18n
import { PropsWithElementAttributes } from '../utils';

// Define our own interfaces based on emoji-mart structure
interface EmojiData {
  [key: string]: any;
  id: string;
  native: string;
  unified: string;
  shortcodes?: string;
}

interface PartialI18n {
  categories?: {
    activity?: string;
    custom?: string;
    flags?: string;
    foods?: string;
    nature?: string;
    objects?: string;
    people?: string;
    places?: string;
    recent?: string;
    search?: string;
    symbols?: string;
  };
  categorieslabel?: string;
  clear?: string;
  notfound?: string;
  search?: string;
  skintext?: string;
}

export type EmojiPickerProps = PropsWithElementAttributes<{
  /** Override the default emoji dataset, library has a light set of emojis
   * to show more emojis use your own or emoji-mart sets
   * https://github.com/missive/emoji-mart#datasets
   */
  emojiData?: any; // Using any to avoid type issues
  i18n?: PartialI18n;
  onSelect?: (emoji: EmojiData) => void;
}>;

export const getEmojiPickerFieldsTranslations = (t: TFunction): PartialI18n => ({
  search: t('Search') as string,
  clear: t('Clear') as string,
  notfound: t('No emoji found') as string,
  skintext: t('Choose your default skin tone') as string,
  categorieslabel: t('Emoji categories') as string,
  categories: {
    search: t('Search Results') as string,
    recent: t('Frequently Used') as string,
    people: t('Smileys & Emotion') as string,
    nature: t('Animals & Nature') as string,
    foods: t('Food & Drink') as string,
    activity: t('Activity') as string,
    places: t('Travel & Places') as string,
    objects: t('Objects') as string,
    symbols: t('Symbols') as string,
    flags: t('Flags') as string,
    custom: t('Custom') as string,
  },
});

export const EmojiPicker = ({ emojiData = defaultEmojiData, i18n, onSelect, className, style }: EmojiPickerProps) => {
  const { t } = useTranslationContext();
  const [open, setOpen] = useState(false);
  const emojiPicker = useRef<HTMLDivElement>(null);

  useOnClickOutside(emojiPicker, () => setOpen(false), open);

  return (
    <div className={classNames('raf-emoji-picker', className)} style={style}>
      {open && (
        <div data-testid="picker-wrapper" className="raf-emoji-picker__container" ref={emojiPicker}>
          <Picker i18n={i18n ?? getEmojiPickerFieldsTranslations(t)} data={emojiData} onEmojiSelect={onSelect} />
        </div>
      )}
      <div role="button" onClick={() => setOpen(true)} className="raf-emoji-picker__button">
        <EmojiIcon />
      </div>
    </div>
  );
};
