export type DecadeId = '1990' | '2000' | '2010' | '2020';
export type TextAlignment = 'left' | 'center' | 'right' | 'justify';
export interface TextFormatting { textAlignments?: Record<string, TextAlignment> }
export interface YouTubeMedia { id: string; label: string }
export interface Artist extends TextFormatting { id: string; slug: string; name: string; decade: DecadeId; kind: string; summary: string; paragraphs: string[]; editorialStatus: 'inicial' | 'pesquisado' | 'revisado'; womenHighlight: boolean; workIds: string[]; sourceIds: string[]; instagramUrl: string | null; youtubeUrl: string | null; image: { url: string; alt: string; credit: string } | null }
export interface Work extends TextFormatting { id: string; title: string; decade: DecadeId; artistIds: string[]; type: string; context: string; sourceIds: string[]; youtube: YouTubeMedia; explicit: boolean }
export interface Decade extends TextFormatting { id: DecadeId; label: string; title: string; description: string; artistIds: string[] }
export interface Topic extends TextFormatting { id: string; title: string; subtitle: string; text: string[]; questions: string[]; sourceIds: string[] }
export interface Source extends TextFormatting { id: string; title: string; credit: string; url: string | null }
export interface HeroContent { eyebrow: string; titleLines: string[]; accent: string; intro: string; ctaLabel: string; meta: string; imageUrl: string; imageAlt: string; imageCredit: string; stickerLines: string[] }
export interface SectionIntro { eyebrow: string; titleLines: string[]; descriptionLines: string[] }
export interface Channel extends TextFormatting { id: string; label: string; title: string; text: string; linkLabel: string | null; linkUrl: string | null }
export interface SiteContent extends TextFormatting {
 title: string;
 instagramUrl: string;
 playlistUrl: string | null;
 playlistTitle: string;
 navigation: { timeline: string; women: string; topics: string; catalog: string };
 hero: HeroContent;
 ribbonText: string;
 timelineSection: SectionIntro & { note: string };
 womenIntro: string;
 womenSection: { eyebrow: string; titleLines: string[]; lead: string; statLabelLines: string[] };
 topicsSection: SectionIntro;
 catalogSection: { eyebrow: string; titleLines: string[]; description: string; ctaLabel: string };
 aboutSection: { eyebrow: string; titleLines: string[]; channels: Channel[] };
 catalogPage: { eyebrow: string; title: string; description: string };
 footer: { project: string; tagline: string; notes: string[] };
}
export interface ContentBundle { artists: Artist[]; works: Work[]; decades: Decade[]; topics: Topic[]; sources: Source[]; site: SiteContent }
export type ContentCollection = keyof ContentBundle;
