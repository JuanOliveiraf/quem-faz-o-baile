export type DecadeId = '1990' | '2000' | '2010' | '2020';
export interface SpotifyMedia { type: 'track' | 'album' | 'playlist'; id: string; label: string }
export interface YouTubeMedia { id: string; label: string }
export interface Artist { id: string; slug: string; name: string; decade: DecadeId; kind: string; summary: string; paragraphs: string[]; editorialStatus: 'inicial' | 'pesquisado' | 'revisado'; womenHighlight: boolean; workIds: string[]; sourceIds: string[]; instagramUrl: string | null; youtubeUrl: string | null; image: { url: string; alt: string; credit: string } | null }
export interface Work { id: string; title: string; decade: DecadeId; artistIds: string[]; type: string; context: string; sourceIds: string[]; spotify: SpotifyMedia | null; youtube: YouTubeMedia | null; explicit: boolean }
export interface Decade { id: DecadeId; label: string; title: string; description: string; artistIds: string[] }
export interface Topic { id: string; title: string; subtitle: string; text: string[]; questions: string[]; sourceIds: string[] }
export interface Source { id: string; title: string; credit: string; url: string | null }
