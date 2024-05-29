import userReducer, { UserState, clearErrors, getOrdersThunk } from '../src/services/slices/userSlice';
import { userOrders } from '../src/mockData';

describe('Тесты синхронных экшенов', () => {
  test('Очистка ошибок', () => {
    const initialState: UserState = {
      isAuthenticated: false,
      loginUserRequest: false,
      user: null,
      orders: [],
      ordersRequest: false,
      error: 'некоторая ошибка'
    };

    const newState = userReducer(initialState, clearErrors());
    expect(newState.error).toBeNull();
  });
});

describe('Тесты асинхронных экшенов', () => {
  describe('Тестирование getOrdersThunk', () => {
    test('Отправка запроса (pending)', async () => {
      const initialState: UserState = {
        isAuthenticated: false,
        loginUserRequest: false,
        user: null,
        orders: [],
        ordersRequest: false,
        error: null
      };

      const newState = userReducer(
        initialState,
        getOrdersThunk.pending('pending')
      );

      expect(newState.ordersRequest).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Ошибка при запросе (rejected)', async () => {
      const initialState: UserState = {
        isAuthenticated: false,
        loginUserRequest: false,
        user: null,
        orders: [],
        ordersRequest: true,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка получения заказов юзера'
      };

      const newState = userReducer(
        initialState,
        getOrdersThunk.rejected(error, 'rejected')
      );

      expect(newState.ordersRequest).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Успешный запрос (fulfilled)', async () => {
      const initialState: UserState = {
        isAuthenticated: false,
        loginUserRequest: false,
        user: null,
        orders: [],
        ordersRequest: true,
        error: null
      };

      const newState = userReducer(
        initialState,
        getOrdersThunk.fulfilled(userOrders, 'fulfilled')
      );

      expect(newState.orders).toEqual(userOrders);
      expect(newState.ordersRequest).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
