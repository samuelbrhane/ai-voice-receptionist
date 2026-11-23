/** Same layout and height as the real day, with shimmering placeholder blocks. */
const HEIGHT = 9 * 60 * 1.1;

const BLOCKS = [
  [{ top: 4, height: 50 }, { top: 120, height: 66 }, { top: 300, height: 50 }, { top: 470, height: 66 }],
  [{ top: 40, height: 66 }, { top: 200, height: 50 }, { top: 360, height: 66 }, { top: 520, height: 34 }],
];

export function DaySkeleton() {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-x-2" aria-label="Loading the calendar" role="status">
      <div />
      {[0, 1].map((column) => (
        <div key={column} className="skeleton mx-auto mb-2 h-4 w-20 rounded" />
      ))}
      <div style={{ height: HEIGHT }} />
      {BLOCKS.map((blocks, column) => (
        <div key={column} className="relative rounded-lg bg-porcelain" style={{ height: HEIGHT }}>
          {blocks.map((block) => (
            <div key={block.top} className="skeleton absolute inset-x-1 rounded-md" style={block} />
          ))}
        </div>
      ))}
    </div>
  );
}