import React from 'react';
import '@testing-library/jest-dom';
import { render } from '../../utils/test-utils';
import { StatusUpdateForm } from './StatusUpdateForm';
import { EmojiPicker } from '../EmojiPicker';

// Define our own interface for emoji i18n
interface EmojiI18n {
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

const customTextareaPlaceholder = 'Custom placeholder';
const Textarea = jest.fn(() => <textarea placeholder={customTextareaPlaceholder} />);

jest.mock('../EmojiPicker', () => {
  return {
    ...jest.requireActual('../EmojiPicker'),
    EmojiPicker: jest.fn(() => null),
  };
});

describe('StatusUpdateForm', () => {
  beforeEach(jest.clearAllMocks);

  it('passes i18n prop to EmojiPicker', () => {
    const emojiI18n: Partial<EmojiI18n> = {
      search: 'Custom Search String',
      categories: { recent: 'Recent Emojis' },
    };

    render(<StatusUpdateForm emojiI18n={emojiI18n} />);
    expect(EmojiPicker).toHaveBeenCalledWith(expect.objectContaining({ i18n: emojiI18n }), {});
  });

  it('renders default Textarea', () => {
    const { getByRole } = render(<StatusUpdateForm />);
    expect(getByRole('textbox')).toHaveProperty('placeholder', 'Type your post...');
  });

  it('renders custom Textarea', () => {
    const { getByRole } = render(<StatusUpdateForm Textarea={Textarea} />);
    expect(getByRole('textbox')).toHaveProperty('placeholder', customTextareaPlaceholder);
  });
});
