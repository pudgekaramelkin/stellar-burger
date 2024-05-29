import ingredientsReducer, { IngredientsState, getIngredientsThunk } from '../src/services/slices/ingredientsSlice';

import { buns } from '../src/mockData';

describe('Тестирование асинхронных экшенов', () => {
  describe('Тестирование getIngredientsThunk', () => {
    test('Запрос в процессе (pending)', async () => {
      const initialState: IngredientsState = {
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      };

      const newState = ingredientsReducer(
        initialState,
        getIngredientsThunk.pending('pending')
      );

      expect(newState.isIngredientsLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Запрос завершился ошибкой (rejected)', async () => {
      const initialState: IngredientsState = {
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка загрузки ингредиентов'
      };

      const newState = ingredientsReducer(
        initialState,
        getIngredientsThunk.rejected(error, 'rejected')
      );

      expect(newState.isIngredientsLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Запрос выполнен успешно (fulfilled)', async () => {
      const initialState: IngredientsState = {
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      };

      const newState = ingredientsReducer(
        initialState,
        getIngredientsThunk.fulfilled(buns, 'fulfilled')
      );

      expect(newState.ingredients).toEqual(buns);
      expect(newState.isIngredientsLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
