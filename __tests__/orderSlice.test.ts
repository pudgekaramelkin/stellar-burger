import orderReducer, { OrderState, clearOrder, isOrderLoadingSelector, orderSelector } from '../src/services/slices/orderSlice';
import { orderBurgerThunk } from '../src/services/slices/orderSlice';
import { TOrder } from '../src/utils/types';
import { AnyAction } from 'redux';

describe('Тестирование orderSlice', () => {
  const initialState: OrderState = {
    order: null,
    isOrderLoading: false,
    error: null
  };

  test('Должен вернуть начальное состояние', () => {
    expect(orderReducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  test('Должен обработать clearOrder', () => {
    const previousState: OrderState = {
      order: {
        _id: '123',
        status: 'done',
        name: 'Burger',
        createdAt: '2021-07-21T17:32:28.123Z',
        updatedAt: '2021-07-21T17:32:28.123Z',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      },
      isOrderLoading: true,
      error: null
    };
    expect(orderReducer(previousState, clearOrder())).toEqual(initialState);
  });

  test('Должен обработать orderBurgerThunk.pending', () => {
    const action = { type: orderBurgerThunk.pending.type };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isOrderLoading: true
    });
  });

  test('Должен обработать orderBurgerThunk.rejected', () => {
    const errorMessage = 'Failed to order burger';
    const action = { type: orderBurgerThunk.rejected.type, error: { message: errorMessage } };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isOrderLoading: false,
      error: errorMessage
    });
  });

  test('Должен обработать orderBurgerThunk.fulfilled', () => {
    const order: TOrder = {
      _id: '123',
      status: 'done',
      name: 'Burger',
      createdAt: '2021-07-21T17:32:28.123Z',
      updatedAt: '2021-07-21T17:32:28.123Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    };
    const action = { type: orderBurgerThunk.fulfilled.type, payload: { order } };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isOrderLoading: false,
      order: order
    });
  });

  test('Должен выбрать isOrderLoading из состояния', () => {
    const state = { order: initialState };
    expect(isOrderLoadingSelector(state)).toEqual(false);
  });

  test('Должен выбрать order из состояния', () => {
    const order: TOrder = {
      _id: '123',
      status: 'done',
      name: 'Burger',
      createdAt: '2021-07-21T17:32:28.123Z',
      updatedAt: '2021-07-21T17:32:28.123Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    };
    const state = { order: { ...initialState, order } };
    expect(orderSelector(state)).toEqual(order);
  });
});
