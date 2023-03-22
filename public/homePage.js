"use strict"

// Выход из личного кабинета
const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    });
};

// Получение информации о пользователе
ApiConnector.current(callback => {
    if (callback.success) {
        ProfileWidget.showProfile(callback.data);
    }
});

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function ratesCall() {
    ApiConnector.getStocks(callback => {
        if (callback.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(callback.data);
        }
    });
}

ratesCall();

setInterval(ratesCall, 6000);

// Операции с деньгами:
const moneyManager = new MoneyManager();

//  пополнение баланса
moneyManager.addMoneyCallback = ({ currency, amount }) => {
    ApiConnector.addMoney({ currency, amount }, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            moneyManager.setMessage(callback.success, `Баланс успешно пополнен на ${amount} ${currency}`);
        } else {
            moneyManager.setMessage(callback.success, callback.error);
        }
    }) 
}

//  конвертирование валюты
moneyManager.conversionMoneyCallback = ({ fromCurrency, targetCurrency, fromAmount }) => {
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            moneyManager.setMessage(callback.success, `Конвертирование ${fromAmount} ${fromCurrency} в ${targetCurrency} выполнено успешно`);
        } else {
            moneyManager.setMessage(callback.success, callback.error);
        }
    })
}

//  перевод валюты
moneyManager.sendMoneyCallback = ({ to, currency, amount }) => {
    ApiConnector.transferMoney({ to, currency, amount }, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            moneyManager.setMessage(callback.success, `Перевод ${amount} ${currency} пользователю ${to} выполнен`);
        } else {
            moneyManager.setMessage(callback.success, callback.error);
        }
    })
}

// Работа с избранным:
const favoritesWidget = new FavoritesWidget;

//  начальный список избранного
ApiConnector.getFavorites (callback => {
    if (callback.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(callback.data);
        moneyManager.updateUsersList(callback.data);
    }
});

//  добавления пользователя в список избранных
favoritesWidget.addUserCallback = ({id, name}) => {
    ApiConnector.addUserToFavorites({id, name}, callback => {
        if (callback.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(callback.data);
            favoritesWidget.updateUsersList(callback.data);
            favoritesWidget.setMessage(callback.success, "Пользователь успешно добавлен");
        } else {
            favoritesWidget.setMessage(callback.success, callback.error);
        }
    });
}

//  удаление пользователя из избранного
favoritesWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, callback => {
        if (callback.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(callback.data);
            favoritesWidget.updateUsersList(callback.data);
            favoritesWidget.setMessage(callback.success, "Пользователь удален");
        } else {
            favoritesWidget.setMessage(callback.success, callback.error);
        }
    })
    
}