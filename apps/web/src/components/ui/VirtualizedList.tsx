import { useState, useRef, useEffect } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

function VirtualizedList<T>({ 
  items, 
  height, 
  itemHeight, 
  renderItem, 
  className = '' 
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  
  useEffect(() => {
    if (!parentRef.current) return;
    
    const updateVisibleRange = () => {
      const container = parentRef.current;
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;
      
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        items.length - 1,
        Math.floor((scrollTop + viewportHeight) / itemHeight) + 5 // Add overscan
      );
      
      setVisibleRange({ start: Math.max(0, startIndex - 5), end: endIndex }); // Add overscan to start too
    };
    
    updateVisibleRange();
    const container = parentRef.current;
    container.addEventListener('scroll', updateVisibleRange);
    
    return () => {
      container.removeEventListener('scroll', updateVisibleRange);
    };
  }, [items.length, itemHeight]);
  
  const visibleItems = [];
  for (let i = visibleRange.start; i <= visibleRange.end; i++) {
    if (i >= 0 && i < items.length) {
      visibleItems.push({ index: i, start: i * itemHeight });
    }
  }
  
  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        style={{
          height: `${items.length * itemHeight}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${itemHeight}px`,
              transform: `translateY(${item.start}px)`,
            }}
          >
            {renderItem(items[item.index], item.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualizedList;