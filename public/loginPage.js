"use strict"

const userForm = new UserForm();

userForm.loginFormCallback = data => {
    ApiConnector.login(data, callback => {
        console.log(callback);
        if (callback.success) {
            location.reload();
        } else {
            console.log(callback.error);
            userForm.setLoginErrorMessage(callback.error);
        }
    });
};

userForm.registerFormCallback = data => {
    ApiConnector.register(data, callback => {
        console.log(callback);
        if (callback.success) {
            location.reload();
        } else {
            console.log(callback.error);
            userForm.setRegisterErrorMessage(callback.error);
        }
    });
};