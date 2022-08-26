import { getRect, makeRect, Rect } from '@/utils/rect';
import { View } from '@tarojs/components';
import Taro, { NodesRef, usePageScroll } from '@tarojs/taro';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import IndexListContext from './Context';
import IndexListBar from './IndexListBar';

export type IndexListType = (string | number)[];

export type IndexListCardProps = {
  stickyOffsetTop?: number;
  indexList: IndexListType[];
  children: ReactNode;
};

const IndexListCard: FC<IndexListCardProps> = ({ stickyOffsetTop = 0, indexList, children }) => {
  const listRef = useRef<HTMLElement>();
  const listBarRef = useRef<HTMLElement>();
  // 获取容器的Rect
  const listRectRef = useRef<Rect>(makeRect(0, 0));
  const listBarRectRef = useRef<Rect>(makeRect(0, 0));
  // 计算出来的内容容器的宽高数组
  const anchorRectsRef = useRef<Rect[]>([]);
  // 默认的容器的内容的Rects
  const anchorDefaultRectsRef = useRef<Rect[]>([]);
  const listDefaultBarRectsRef = useRef<Rect[]>([]);
  // 滚动的距离
  const scrollTopRef = useRef(0);

  const [activeAnchor, setActiveAnchor] = useState<number>(-1);

  const getActiveAnchor = useCallback((): number => {
    for (let i = anchorRectsRef.current.length - 1; i >= 0; i--) {
      const prevHeight = i > 0 ? anchorRectsRef.current[i - 1].height : 0;
      if (prevHeight >= anchorRectsRef.current[i].top) {
        return i;
      }
    }
    return -1;
  }, []);

  const onScroll = useCallback(async () => {
    const arrayedIndex = getActiveAnchor();
    if (arrayedIndex >= 0) {
      setActiveAnchor(arrayedIndex);
    } else {
      setActiveAnchor(-1);
    }
  }, []);

  const getListRect = useCallback(
    () =>
      getRect(listRef).then(rect => ({
        ...rect,
        top: rect.top + scrollTopRef.current
      })),
    []
  );

  const getListBarRect = useCallback(() => getRect(listBarRef), []);

  const getAnchorRects = useCallback((): Promise<Rect[]> => {
    return new Promise(resolve => {
      const query = Taro.createSelectorQuery();
      query
        .selectAll(`.index-list__anchor-wrapper`)
        .boundingClientRect((res: NodesRef.BoundingClientRectCallbackResult) => {
          resolve(res as unknown as Rect[]);
        })
        .exec();
    });
  }, []);

  const getAnchorBarRects = useCallback((): Promise<Rect[]> => {
    return new Promise(resolve => {
      const query = Taro.createSelectorQuery();
      query
        .selectAll(`.index-list__bar-item`)
        .boundingClientRect((res: NodesRef.BoundingClientRectCallbackResult) => {
          resolve(res as unknown as Rect[]);
        })
        .exec();
    });
  }, []);

  const getIndexListData = (isDefault?: boolean) => {
    setTimeout(() => {
      Promise.all([getListRect(), getListBarRect(), getAnchorRects(), getAnchorBarRects()])
        .then(rects => {
          const [listRect, listBarRect, anchorRects, anchorBarRects] = rects;
          listRectRef.current = listRect;
          listBarRectRef.current = listBarRect;
          anchorRectsRef.current = anchorRects;
          if (isDefault) {
            anchorDefaultRectsRef.current = anchorRects;
            listDefaultBarRectsRef.current = anchorBarRects;
          }
        })
        .then(onScroll);
    }, 0);
  };

  useEffect(() => {
    Taro.nextTick(() => {
      getIndexListData(true);
    });
  }, []);

  usePageScroll(({ scrollTop }) => {
    scrollTopRef.current = scrollTop;
    getIndexListData();
  });

  const onBarClick = async index => {
    if (listRef.current) {
      await Taro.pageScrollTo({
        scrollTop: anchorDefaultRectsRef.current[index].top,
        duration: 0
      });
    }
  };

  return (
    <IndexListContext.Provider
      value={{
        stickyOffsetTop,
        activeIndex: activeAnchor ?? -1,
        getListRect: () => listRectRef.current,
        getListBarRect: () => listBarRectRef.current,
        getAnchorRects: () => anchorRectsRef.current,
        getListBarDefaultRect: () => listDefaultBarRectsRef.current
      }}
    >
      <View ref={listRef}>
        <IndexListBar ref={listBarRef} onClick={onBarClick} indexList={indexList} />
        <View>{children}</View>
      </View>
    </IndexListContext.Provider>
  );
};

export default IndexListCard;
