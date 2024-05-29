import feedReducer, {
  IFeedsState,
  getFeedsThunk,
  getOrderByNumberThunk
} from '../src/services/slices/feedsSlice';

import { userOrders } from '../src/mockData';
import { TFeedsResponse, TOrderResponse } from '../src/utils/burger-api';

describe('Тестирование асинхронных экшенов', () => {
  describe('Тестирование getFeedsThunk', () => {
    test('Отправка запроса (pending)', async () => {
      const initialState: IFeedsState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const newState = feedReducer(
        initialState,
        getFeedsThunk.pending('pending')
      );

      expect(newState.isFeedsLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Обработка ошибки при запросе (rejected)', async () => {
      const initialState: IFeedsState = {
        orders: [],
        isFeedsLoading: true,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка получения данных о заказах'
      };

      const newState = feedReducer(
        initialState,
        getFeedsThunk.rejected(error, 'rejected')
      );

      expect(newState.isFeedsLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Успешный запрос (fulfilled)', async () => {
      const initialState: IFeedsState = {
        orders: [],
        isFeedsLoading: true,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const feeds: TFeedsResponse = {
        orders: userOrders,
        total: 10,
        totalToday: 20,
        success: true
      };

      const newState = feedReducer(
        initialState,
        getFeedsThunk.fulfilled(feeds, 'fulfilled')
      );

      expect(newState.orders).toEqual(userOrders);
      expect(newState.total).toEqual(10);
      expect(newState.totalToday).toEqual(20);
      expect(newState.isFeedsLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });

  describe('Тестирование getOrderByNumberThunk', () => {
    test('Отправка запроса (pending)', async () => {
      const initialState: IFeedsState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.pending('pending', 1)
      );

      expect(newState.isOrderLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Обработка ошибки при запросе (rejected)', async () => {
      const initialState: IFeedsState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: true,
        total: 0,
        totalToday: 0,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка получения данных о конкретном заказе'
      };

      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.rejected(error, 'rejected', 1)
      );

      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Успешный запрос (fulfilled)', async () => {
      const initialState: IFeedsState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: true,
        total: 0,
        totalToday: 0,
        error: null
      };

      const order: TOrderResponse = {
        orders: [userOrders[0]],
        success: true
      };

      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.fulfilled(order, 'fulfilled', 1)
      );

      expect(newState.order).toEqual(userOrders[0]);
      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
