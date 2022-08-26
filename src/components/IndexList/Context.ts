import { makeRect, Rect } from '@/utils/rect';
import { createContext } from 'react';

interface IndexListContextValue {
  stickyOffsetTop?: number;
  activeIndex: number | string;

  getListRect(): Rect;

  getListBarRect(): Rect;

  getAnchorRects(): Rect[];

  getListBarDefaultRect(): Rect[];
}

const IndexListContext = createContext<IndexListContextValue>({
  activeIndex: 1,
  getListRect: () => makeRect(0, 0),
  getListBarRect: () => makeRect(0, 0),
  getAnchorRects: () => [],
  getListBarDefaultRect: () => []
});

export default IndexListContext;
