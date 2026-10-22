import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { safeURL } from '../lib/widgets';
export interface MarkdownViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  source: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}
function inline(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_|`([^`]+)`/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index!;
    nodes.push(text.slice(last, at));
    const key = String(at);
    if (match[1]) {
      const href = safeURL(match[2]);
      nodes.push(
        href ? (
          <a key={key} href={href}>
            {match[1]}
          </a>
        ) : (
          <span key={key}>{match[1]}</span>
        ),
      );
    } else if (match[3]) nodes.push(<strong key={key}>{match[3]}</strong>);
    else if (match[4]) nodes.push(<em key={key}>{match[4]}</em>);
    else nodes.push(<code key={key}>{match[5]}</code>);
    last = at + match[0].length;
  }
  nodes.push(text.slice(last));
  return nodes;
}
/** A documented safe Markdown subset; raw HTML is always text. */
export const MarkdownViewer = forwardRef<HTMLDivElement, MarkdownViewerProps>(
  function MarkdownViewer({ source, headingLevel = 2, className, ...props }, ref) {
    const lines = source.replace(/\r\n/g, '\n').split('\n'),
      blocks: ReactNode[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('```')) {
        const code: string[] = [];
        while (++i < lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
        blocks.push(
          <pre key={i} role="region" aria-label={'Code block ' + (blocks.length + 1)} tabIndex={0}>
            <code>{code.join('\n')}</code>
          </pre>,
        );
        continue;
      }
      const heading = /^(#{1,6})\s+(.+)$/.exec(line);
      if (heading) {
        blocks.push(
          createElement(
            'h' + Math.min(6, headingLevel + heading[1].length - 1),
            { key: i },
            inline(heading[2]),
          ),
        );
        continue;
      }
      if (/^[-*] /.test(line)) {
        const items: ReactNode[] = [];
        while (i < lines.length && /^[-*] /.test(lines[i])) {
          items.push(<li key={i}>{inline(lines[i].slice(2))}</li>);
          i++;
        }
        i--;
        blocks.push(<ul key={i}>{items}</ul>);
        continue;
      }
      if (line.trim()) blocks.push(<p key={i}>{inline(line)}</p>);
    }
    return (
      <div {...props} ref={ref} className={['dvy-markdown', className].filter(Boolean).join(' ')}>
        {blocks}
      </div>
    );
  },
);
