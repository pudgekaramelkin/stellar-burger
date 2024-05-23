import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeedsThunk,
  ordersSelector
} from '../../services/slices/feedsSlice';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(ordersSelector);

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
