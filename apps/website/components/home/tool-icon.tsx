import type { ToolName } from './services';

const paths: Record<ToolName, string[]> = {
  roller: ['M6 5h14v8H6z', 'M20 8h3v9H13v10', 'M10 22h6v8h-6z'],
  wrench: ['M21 4a7 7 0 0 0-8 9L4 22a4 4 0 0 0 6 6l9-9a7 7 0 0 0 9-8l-5 5-6-6z', 'M7 25h.01'],
  bolt: ['M18 2 6 19h9l-1 11 12-18h-9z'],
  screen: ['M3 5h26v18H3z', 'M12 23v5m8-5v5M8 28h16', 'M23 9h2v5'],
  gutter: ['M3 8h25v7H3z', 'M23 15v13h6', 'M7 3v2m6-2v2m6-2v2'],
  hammer: ['M6 4h15l7 7-5 5-5-5-4 4-7-7z', 'm14 15-9 12 4 3 10-14'],
  floor: ['M3 5h26v23H3z', 'M3 13h26M3 21h26M12 5v8m9 0v8m-9 0v7'],
  water: ['M16 3C13 9 6 15 6 21a10 10 0 0 0 20 0C26 15 19 9 16 3Z', 'M11 21a5 5 0 0 0 5 5'],
  frame: ['M4 4h24v24H4z', 'M8 8h16v16H8z', 'm9 22 6-7 4 4 4-7'],
  coating: ['M6 12h20l-2 17H8z', 'M10 12V8a6 6 0 0 1 12 0v4', 'm12 21 3 3 5-6'],
  shovel: ['M12 3h8v6a4 4 0 0 1-8 0z', 'M16 13v11', 'M9 22h14v3a7 7 0 0 1-14 0z'],
  wall: ['M3 4h26v25H3z', 'M10 4v25M21 4v25M10 12h11m-11 9h11'],
  drawing: ['M5 3h17l5 5v21H5z', 'M22 3v6h5', 'M10 24v-8l6-5 6 5v8z', 'M14 24v-5h4v5'],
  welding: ['M7 5h18v14l-9 8-9-8z', 'M10 10h12v6H10z', 'm27 23 3-1m-6 6 1 3M4 22l-3 1'],
  fence: ['M4 8 8 3l4 5v21H4z', 'm20 0 4-5 4 5v21h-8z', 'M12 13h8m-8 9h8'],
  chair: ['M8 17V5h16v12', 'M5 14v9h22v-9', 'M8 23v7m16-7v7M8 18h16'],
};

export function ToolIcon({ name, className = '' }: { name: ToolName; className?: string }) {
  return (
    <svg viewBox="0 0 32 34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
