import { View } from '@tarojs/components';
import classNames from 'classnames';
import { useContext } from 'react';
import IndexListContext from './Context';
import styles from './index.nodule.scss';

interface IndexListIndexProps {
  index?: number | string;
}

const IndexListItem = (props: IndexListIndexProps) => {
  const {index} = props;
  const {activeIndex} = useContext(IndexListContext);

  return (
    <View
      className={classNames({
        [styles.indexListItem]: true,
        [styles.indexListItemActive]: activeIndex === index
      })}
    >
      {index}
    </View>
  );
}

export default IndexListItem
