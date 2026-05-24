'use client';
import React, { useState, useEffect } from 'react';
import EmojiPicker, { EmojiStyle, SuggestionMode } from 'emoji-picker-react';
import './emoji-picker.css';

interface EmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void;
  height?: number;
  width?: number;
  emojiStyle?: EmojiStyle;
  suggestedEmojisMode?: SuggestionMode;
  searchDisabled?: boolean;
  searchPlaceholder?: string;
  emojiSize?: number;
  compact?: boolean;
  position?: 'top' | 'bottom';
}

export const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  height = 350,
  width = 400,
  emojiStyle = EmojiStyle.NATIVE,
  suggestedEmojisMode = SuggestionMode.RECENT,
  searchDisabled = false,
  searchPlaceholder = 'Search emojis...',
  emojiSize = 16,
  compact = false,
  position = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<'top' | 'bottom'>(
    position
  );

  const handleEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject.emoji;
    onEmojiSelect?.(emoji);
    setIsOpen(false);
  };

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  const handleToggleClick = () => {
    if (!isOpen) {
      const button = document.querySelector('.emoji-toggle-btn') as HTMLElement;
      if (button) {
        const rect = button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = window.innerWidth - rect.left;

        if (spaceBelow < height && spaceAbove > height) {
          setPickerPosition('top');
        } else {
          setPickerPosition('bottom');
        }

        const pickerWrapper = document.querySelector(
          '.emoji-picker-wrapper'
        ) as HTMLElement;
        if (pickerWrapper) {
          if (spaceRight < width) {
            pickerWrapper.style.left = 'auto';
            pickerWrapper.style.right = '0';
          } else {
            pickerWrapper.style.left = '0';
            pickerWrapper.style.right = 'auto';
          }
        }
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }

    return undefined;
  }, [isOpen]);

  return (
    <div className="emoji-picker-container">
      <button
        onClick={handleToggleClick}
        className={`flex items-center gap-1 text-basic-black border border-basic-white hover:border-gray-300 rounded-md px-1 transition-colors ${
          compact ? 'compact' : ''
        }`}
      >
        <span className="material-symbols-outlined text-base">
          add_reaction
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="emoji-picker-backdrop"
            onClick={handleBackdropClick}
          />
          <div
            className={`emoji-picker-wrapper ${
              compact ? 'compact' : ''
            } ${pickerPosition}`}
          >
            <style jsx>{`
              .compact .EmojiPickerReact {
                --epr-emoji-size: ${emojiSize}px;
                --epr-emoji-gap: 4px;
                --epr-category-label-font-size: 12px;
                --epr-search-input-font-size: 12px;
                --epr-search-input-padding: 6px 8px;
              }
            `}</style>
            <EmojiPicker
              height={height}
              width={width}
              emojiStyle={emojiStyle}
              suggestedEmojisMode={suggestedEmojisMode}
              previewConfig={{ showPreview: false }}
              searchDisabled={searchDisabled}
              searchPlaceholder={searchPlaceholder}
              onEmojiClick={handleEmojiClick}
            />
          </div>
        </>
      )}
    </div>
  );
};
