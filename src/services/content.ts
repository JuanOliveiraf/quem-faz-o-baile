import artistData from '../data/artists.json';
import decadeData from '../data/decades.json';
import worksData from '../data/works.json';
import topicData from '../data/topics.json';
import sourceData from '../data/sources.json';
import siteData from '../data/site.json';
import type { Artist, ContentBundle, Decade, SiteContent, Source, Topic, Work } from '../types/content';
export const initialContent: ContentBundle = {
 artists: artistData as Artist[],
 decades: decadeData as Decade[],
 works: worksData as Work[],
 topics: topicData as Topic[],
 sources: sourceData as Source[],
 site: siteData as SiteContent
};
export const { artists, decades, works, topics, sources, site } = initialContent;
export const getArtist = (id: string, list: Artist[] = artists) => list.find(a => a.id === id);
export const getArtistWorks = (artist: Artist, list: Work[] = works) => list.filter(w => artist.workIds.includes(w.id));
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
