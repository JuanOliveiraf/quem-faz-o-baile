export type ReadingBlock = { kind: 'heading' | 'paragraph'; text: string };

/**
 * Converte o texto corrido do CMS em blocos de leitura.
 * Cada "- Título" inicia uma nova seção: o título vira subtítulo e o corpo
 * é separado em parágrafos (linha em branco), com espaçamento entre eles.
 */
export function toReadingBlocks(paragraphs: string[]): ReadingBlock[] {
  const blocks: ReadingBlock[] = [];
  for (const raw of paragraphs) {
    const parts = raw.split(/(?:^|\s)-\s+(?=[A-ZÀ-Ú])/);
    parts.forEach((part, index) => {
      const chunks = part.split(/\n\s*\n/).map(chunk => chunk.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
      chunks.forEach((chunk, chunkIndex) => {
        const isHeading = index > 0 && chunkIndex === 0 && chunks.length > 1;
        blocks.push({ kind: isHeading ? 'heading' : 'paragraph', text: chunk });
      });
    });
  }
  return blocks;
}
