import IndexListCard, { IndexListCardProps } from './IndexList';
import IndexListAnchor from './IndexListAnchor';

interface IndexListInterface {
  Anchor: typeof IndexListAnchor;

  (props: IndexListCardProps): JSX.Element;
}

const IndexList = IndexListCard as IndexListInterface;

IndexList.Anchor = IndexListAnchor;

export default IndexList;
