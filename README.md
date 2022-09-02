# 使用效果
![image](https://github.com/dingminghui/taro-index-list/blob/main/src/assets/index-list.gif)

# 使用案例
```tsx
import IndexList from '@/components/IndexList';
import { View } from '@tarojs/components';
import { Fragment } from 'react';
import styles from './index.module.scss';

const IndexListTest = () => {
const customIndexList: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const boxs = [1, 2, 3, 4, 5, 6];

return (
  <View>  
  <View style={{ height: '200px', background: 'EEE' }}></View>
  <IndexList indexList={customIndexList}>
    {customIndexList.map((index, keyIndex) => (
      <Fragment key={index}>
      <IndexList.Anchor index={keyIndex} item={index} />
        {boxs.map(x => (
          <View className={styles.box} key={x}>
          文本{x}
          </View>
        ))}
      </Fragment>
    ))}
  </IndexList>
  </View>
 );
};

export default IndexListTest;
