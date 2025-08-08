import { memo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

function VirtualizedListComponent<T>({ 
  items, 
  height, 
  itemHeight, 
  renderItem, 
  className = '' 
}: VirtualizedListProps<T>) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );

  return (
    <List
      className={className}
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
}

export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent;