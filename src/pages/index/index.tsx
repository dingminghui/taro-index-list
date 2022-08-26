import { Component, Fragment } from 'react'
import { View } from '@tarojs/components'
import IndexList from '@/components/IndexList';
import './index.scss'

const customIndexList: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const boxs = [1, 2, 3, 4, 5, 6];

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
        <View style={{ height: '200px', background: 'EEE' }}></View>
        <IndexList indexList={customIndexList}>
          {customIndexList.map((index, keyIndex) => (
            <Fragment key={index}>
              <IndexList.Anchor index={keyIndex} item={index} />
              {boxs.map(x => (
                <View style={{ height: '20px', background: '#EEE' }} key={x}>
                  文本{x}
                </View>
              ))}
            </Fragment>
          ))}
        </IndexList>
      </View>
    );
  }
}
