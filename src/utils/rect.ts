import { TaroElement } from '@tarojs/runtime';
import { createSelectorQuery } from '@tarojs/taro';
import _ from 'lodash';

export const ELEMENT_NODE_TYPE = 1;
const inBrowser = typeof document !== 'undefined' && !!document.scripts;
const inWechat = process.env.TARO_ENV === 'weapp';

export function isRootElement(node?: TaroElement) {
  return node?.nodeType === ELEMENT_NODE_TYPE && node?.tagName === 'ROOT';
}

export function isBlockElement(node?: TaroElement) {
  return node?.nodeType === ELEMENT_NODE_TYPE && node?.tagName === 'BLOCK';
}

export interface Rect {
  dataset: Record<string, any>;
  id: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export function makeRect(width: number, height: number) {
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  } as Rect;
}

export function queryAllNodesRef(element: TaroElement, selector?: string) {
  if (isRootElement(element)) {
    return createSelectorQuery().selectViewport();
  }

  const ancestor = getAncestorWrapper(element);
  if (ancestor) {
    return createSelectorQuery().selectAll(`#${ancestor.uid}>>>#${element.uid}${selector}`);
  }

  return createSelectorQuery().selectAll('#' + element.uid + selector);
}

export function elementUnref(elementOrRef: any): TaroElement {
  if (elementOrRef === undefined || elementOrRef === null) {
    return elementOrRef;
  }
  if ('current' in elementOrRef) {
    return elementOrRef.current;
  }
  return elementOrRef;
}

export function isWindow(val: unknown): val is Window {
  return val === window;
}

// Fix nested in CustomWrapper is undefined
// See: https://github.com/mallfoundry/taroify/pull/143
// Fix nested in a Block element does not query elements
// See: https://github.com/mallfoundry/taroify/pull/370
function getAncestorWrapper(element: TaroElement) {
  if (inWechat) {
    let ancestor = element;

    for (let cursor = element; !_.isEmpty(cursor.parentNode); ) {
      if (isRootElement(cursor.parentNode as TaroElement)) {
        break;
      }

      if (!isBlockElement(cursor.parentNode as TaroElement)) {
        ancestor = cursor.parentNode as TaroElement;
      }

      cursor = cursor.parentNode as TaroElement;
    }

    if (ancestor && ancestor !== element) {
      return ancestor;
    }
  }
}

export function queryNodesRef(element: TaroElement) {
  if (isRootElement(element)) {
    return createSelectorQuery().selectViewport();
  }

  const ancestor = getAncestorWrapper(element);
  if (ancestor) {
    return createSelectorQuery().select(`#${ancestor.uid}>>>#${element.uid}`);
  }

  return createSelectorQuery().select('#' + element.uid);
}

export function getRect(elementOrRef: any): Promise<Rect> {
  const element = elementUnref(elementOrRef);
  if (element) {
    if (inBrowser) {
      if (isWindow(element)) {
        const width = element.innerWidth;
        const height = element.innerHeight;
        return Promise.resolve(makeRect(width, height));
      }
      return Promise.resolve((element as unknown as HTMLElement).getBoundingClientRect() as unknown as Rect);
    } else {
      return new Promise<Rect>(resolve => {
        queryNodesRef(element)
          .boundingClientRect()
          .exec(([rect]) => {
            if (isRootElement(element)) {
              const { width, height } = rect;
              resolve(makeRect(width, height));
            } else {
              resolve(rect);
            }
          });
      });
    }
  }
  return Promise.resolve(makeRect(0, 0));
}

export function getRects(elementOrRef: any, selector: string): Promise<Rect[]> {
  const element = elementUnref(elementOrRef);
  if (element) {
    if (inBrowser) {
      const rects: Rect[] = [];
      (element as unknown as HTMLElement)
        .querySelectorAll(selector)
        .forEach(oneElement => rects.push(oneElement.getBoundingClientRect() as unknown as Rect));
      return Promise.resolve(rects);
    } else {
      return new Promise<Rect[]>(resolve => {
        queryAllNodesRef(element, selector)
          .boundingClientRect()
          .exec(([rects]) => {
            return resolve(rects as unknown as Rect[]);
          });
      });
    }
  }
  return Promise.resolve([]);
}
