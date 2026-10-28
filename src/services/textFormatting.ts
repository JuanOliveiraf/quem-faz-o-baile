import type { CSSProperties } from 'react';
import type { TextAlignment, TextFormatting } from '../types/content';

export function getTextAlignment(content: TextFormatting, key: string): TextAlignment {
  return content.textAlignments?.[key] || 'left';
}

export function getTextColor(content: TextFormatting, key: string): string | undefined {
  return content.textColors?.[key];
}

export function withTextAlignment<T extends TextFormatting>(content: T, key: string, alignment: TextAlignment): T {
  const textAlignments = { ...content.textAlignments };
  if (alignment === 'left') delete textAlignments[key];
  else textAlignments[key] = alignment;
  const next = { ...content, textAlignments: Object.keys(textAlignments).length ? textAlignments : undefined };
  return next as T;
}

export function withTextColor<T extends TextFormatting>(content: T, key: string, color?: string): T {
  const textColors = { ...content.textColors };
  if (color) textColors[key] = color;
  else delete textColors[key];
  const next = { ...content, textColors: Object.keys(textColors).length ? textColors : undefined };
  return next as T;
}

export function textAlignmentStyle(content: TextFormatting, key: string): CSSProperties | undefined {
  const textAlign = getTextAlignment(content, key);
  const color = getTextColor(content, key);
  if (textAlign === 'left' && !color) return undefined;
  return { ...(textAlign === 'left' ? {} : { textAlign }), ...(color ? { color } : {}) };
}
