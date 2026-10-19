import type { CSSProperties } from 'react';
import type { TextAlignment, TextFormatting } from '../types/content';

export function getTextAlignment(content: TextFormatting, key: string): TextAlignment {
  return content.textAlignments?.[key] || 'left';
}

export function withTextAlignment<T extends TextFormatting>(content: T, key: string, alignment: TextAlignment): T {
  const textAlignments = { ...content.textAlignments };
  if (alignment === 'left') delete textAlignments[key];
  else textAlignments[key] = alignment;
  const next = { ...content, textAlignments: Object.keys(textAlignments).length ? textAlignments : undefined };
  return next as T;
}

export function textAlignmentStyle(content: TextFormatting, key: string): CSSProperties | undefined {
  const textAlign = getTextAlignment(content, key);
  return textAlign === 'left' ? undefined : { textAlign };
}
