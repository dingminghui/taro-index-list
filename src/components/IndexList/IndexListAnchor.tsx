import { View } from '@tarojs/components';
import {CSSProperties, FC, ReactNode, useContext} from 'react';
import classNames from 'classnames';
import './index.nodule.scss';
import IndexListContext from './Context';

export interface IndexListAnchorInstance {
  scrollIntoView(scrollTop: number): void;
}

export type IndexListAnchorProps = {
  index: number; // 使用数组渲染时的index即可
  item: ReactNode;
};

const IndexListAnchor: FC<IndexListAnchorProps> = ({ index, item }) => {
  const {
    activeIndex,
    stickyOffsetTop = 0,
    getAnchorRects,
    getListRect,
    getListBarRect
  } = useContext(IndexListContext);

  let active: boolean;
  let anchorStyle: CSSProperties = {};
  if (activeIndex === index) {
    const { top } = getAnchorRects()[activeIndex];
    const { height = 0 } = getListBarRect();
    const activeAnchorSticky = top <= height;
    if (activeAnchorSticky) {
      anchorStyle = {
        position: 'fixed',
        top: `${height + stickyOffsetTop}px`
      };
    }

    active = true;
  } else if (activeIndex >= 0 && activeIndex === index - 1) {
    const listRect = getListRect();
    const anchorRects = getAnchorRects();
    const currentAnchor = anchorRects[activeIndex];
    const currentOffsetTop = currentAnchor.top;
    const targetOffsetTop = activeIndex === anchorRects.length - 1 ? listRect.top : anchorRects[activeIndex + 1].top;
    const parentOffsetHeight = targetOffsetTop - currentOffsetTop;
    const translateY = parentOffsetHeight - currentAnchor.height;
    anchorStyle = {
      position: 'relative',
      transform: `translate3d(0, ${translateY}, 0)`
    };

    active = true;
  } else {
    active = false;
    anchorStyle = {};
  }

  return (
    <View className='index-list__anchor-wrapper'>
      <View
        style={anchorStyle}
        className={classNames({
          ['index-list__anchor--sticky']: index === activeIndex && active
        })}
      >
        {item}
      </View>
    </View>
  );
};

export default IndexListAnchor;
