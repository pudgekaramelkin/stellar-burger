import * as orderData from '../fixtures/order.json';
import * as authTokens from '../fixtures/token.json';

describe('E2E тестирование страницы конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  context('Добавление и проверка ингредиентов в конструкторе', () => {
    it('Добавление ингредиентов в конструктор', () => {
      cy.request('/api/ingredients');

      // Добавление ингредиентов в заказ
      const ingredients = ['bun', 'main', 'sauce'];
      ingredients.forEach((type) => {
        cy.get(`[data-cy=${type}] > .common_button`).first().click();
      });

      // Проверка содержимого конструктора
      const burgerParts = [
        {
          selector: '.constructor-element__text',
          text: 'Краторная булка N-200i (верх)',
          position: 0
        },
        {
          selector: '.constructor-element__text',
          text: 'Биокотлета из марсианской Магнолии',
          position: 1
        },
        {
          selector: '.constructor-element__text',
          text: 'Соус Spicy-X',
          position: 2
        },
        {
          selector: '.constructor-element__text',
          text: 'Краторная булка N-200i (низ)',
          position: 3
        }
      ];
      burgerParts.forEach((part) => {
        cy.get(part.selector)
          .eq(part.position)
          .should('contain.text', part.text);
      });
    });

    it('Удаление ингредиента из конструктора', () => {
      cy.request('/api/ingredients');

      // Добавление ингредиентов в заказ
      const ingredients = ['bun', 'main', 'sauce'];
      ingredients.forEach((type) => {
        cy.get(`[data-cy=${type}] > .common_button`).first().click();
      });

      // Удаление главного ингредиента
      cy.get('.constructor-element__action').eq(1).click();

      // Проверка, что главный ингредиент удален
      cy.get('.constructor-element__text').should(
        'not.contain.text',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  describe('Тестирование работы модального окна при определенном ингредиенте', () => {
    it('Открытие модального окна', () => {
      cy.get('[data-cy=bun]').first().click();

      const modal = cy.get('#modals > div:first-child');
      modal.find('h3').contains('Краторная булка N-200i');
    });

    it('Закрытие модального окна по крестику', () => {
      cy.get('[data-cy=bun]').first().click();

      const modal = cy.get('#modals > div:first-child');
      modal.find('button').click();

      cy.get('#modals > div:first-child').should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get('[data-cy=bun]').first().click();

      const modal = cy.get('#modals > div:first-child');
      modal.get('#modals > div:nth-child(2)').click({ force: true });

      cy.get('#modals > div:first-child').should('not.exist');
    });
    it('Закрытие модального окна по клику на ESC', () => {
      cy.get('[data-cy=bun]').first().click();

      cy.get('body').type('{esc}');
      cy.get('#modals > div:first-child').should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
      cy.setCookie('accessToken', authTokens.accessToken);
      localStorage.setItem('refreshToken', authTokens.refreshToken);
      cy.intercept('GET', '/api/auth/tokens', { fixture: 'token.json' });
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    });

    it('Полный процесс создания заказа', () => {
      // Добавление ингредиентов
      cy.get('[data-cy=bun] > .common_button').first().click();
      cy.get('[data-cy=main] > .common_button').first().click();
      cy.get('[data-cy=sauce] > .common_button').first().click();

      // Проверка, что кнопка заказа активна
      cy.get('button').contains('Оформить заказ').should('not.be.disabled');

      // Нажатие кнопки заказа
      cy.get('button').contains('Оформить заказ').click();

      // Проверка модального окна заказа
      cy.get('#modals > div:first-child', { timeout: 10000 }).should(
        'be.visible'
      );
      cy.get('#modals > div:first-child')
        .find('h2')
        .contains(orderData.order.number, { timeout: 10000 });
      const modal = cy.get('#modals > div:first-child');
      modal.find('button').click();

      cy.get('#modals > div:first-child', { timeout: 10000 }).should(
        'not.exist'
      );

      cy.get('section:nth-child(2) > div')
        .first()
        .should('contain.text', 'Выберите булки');
      cy.get('section:nth-child(2) > ul > div').should(
        'contain.text',
        'Выберите начинку'
      );
      cy.get('section:nth-child(2) > div')
        .eq(-2)
        .should('contain.text', 'Выберите булки');
    });

    it('Проверка ошибки создания заказа без ингредиентов', () => {
      // Нажатие кнопки заказа без добавления ингредиентов
      cy.get('button').contains('Оформить заказ').should('be.disabled');

      // Проверка отсутствия модального окна ошибки
      cy.get('#modals > div:first-child').should('not.exist');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
