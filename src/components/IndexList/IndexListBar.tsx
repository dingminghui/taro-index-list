import { ScrollView, View } from '@tarojs/components';
import { CSSProperties, ForwardedRef, forwardRef, useContext } from 'react';
import { IndexListType } from './IndexList';
import IndexListContext from './Context';
import IndexListBarItem from './IndexListBarItem';
import './index.nodule.scss';

interface IndexListSidebarProps {
  indexList: IndexListType[];
  onClick: (i: number) => void;
}

const IndexListBar = (props: IndexListSidebarProps, ref: ForwardedRef<HTMLElement | undefined>) => {
  const { activeIndex, stickyOffsetTop = 0, getAnchorRects } = useContext(IndexListContext);
  const { indexList = [], onClick } = props;
  let anchorStyle: CSSProperties = {};

  if (activeIndex >= 0) {
    const { top } = getAnchorRects()[0];
    if (0 >= top) {
      anchorStyle = {
        position: 'fixed',
        top: stickyOffsetTop
      };
    } else {
      anchorStyle = {};
    }
  }

  return (
    <View ref={ref} catchMove style={anchorStyle} className='index-list__bar-wrapper'>
      <ScrollView scrollX style={{ width: '100vw' }} enhanced id='index-list__bar-View__'>
        <View className='index-list__bar-box'>
          {indexList.map((x, index) => (
            <IndexListBarItem key={index} onClick={onClick} index={index} activeIndex={activeIndex} item={x} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default forwardRef(IndexListBar);
