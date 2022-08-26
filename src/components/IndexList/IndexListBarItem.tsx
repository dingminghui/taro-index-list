import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useContext } from 'react';
import IndexListContext from './Context';

type IndexListBarItemProps = {
  activeIndex: number | string;
  index: number;
  item: any;
  onClick: (i: number) => void;
};

const IndexListBarItem: FC<IndexListBarItemProps> = ({ activeIndex, index, item, onClick }) => {
  const { getListBarDefaultRect, getListBarRect } = useContext(IndexListContext);

  if (activeIndex === index) {
    const { left } = getListBarDefaultRect()[activeIndex];
    const { width } = getListBarRect();
    Taro.createSelectorQuery()
      .select('#index-list__bar-View__')
      .node()
      .exec(res => {
        const scrollView = res[0].node;
        scrollView.scrollTo({
          left: left - width / 3
        });
      });
  }
  return (
    <View
      className={classNames({
        ['index-list__bar-item']: true,
        ['index-list__bar-active']: activeIndex === index
      })}
      onClick={() => onClick(index)}
    >
      {item}
    </View>
  );
};

export default IndexListBarItem;
