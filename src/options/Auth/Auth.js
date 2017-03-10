import $ from 'jquery';
import Mustache from 'mustache';
import template from './Auth.html';
import registrationTemplate from './Registration.html';
import './Auth.scss';
import Alert from './../Alert/Alert';

export default class Auth {
  constructor() {
    this._$node = null;
    this._setEvents();
  }


  _setEvents() {
    $(document)
      .on('submit', '#js-login-form', this.login)
      .on('submit', '#js-registration-form', event => this.register(event))
      .on('click', '#js-registration-button', this.showRegistration)
      .on('click', '#js-registration-back-button', this.show);
    return this;
  }


  show() {
    const $template = $(Mustache.render(template));
    $('#js-main').html($template);
    return this;
  }


  showRegistration() {
    const $template = $(Mustache.render(registrationTemplate));
    $('#js-main').html($template);
    return this;
  }


  isAuthed() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'isAuthed'
      }, response => {
        if (response.isSuccess) {
          resolve(response.data.user);
        } else {
          reject(response.statusText);
        }
      });
    });
  }


  login(event) {
    return new Promise((resolve, reject) => {
      event.preventDefault();
      Alert.hide();
      const $submitButton = $(event.target).find('.js-submit-button');
      $submitButton.button('loading');

      const credentials = {
        email: $('#js-email').val(),
        password: $('#js-password').val()
      };

      chrome.runtime.sendMessage({
        type: 'login',
        data: credentials
      }, response => {
        $submitButton.button('reset');
        if (response.isSuccess) {
          $(document).trigger('auth:success');
          resolve();
        } else {
          Alert.showError(response.statusText);
          reject(response.statusText);
        }
      });
    });
  }


  register(event) {
    return new Promise((resolve, reject) => {
      event.preventDefault();
      Alert.hide();
      const $submitButton = $(event.target).find('.js-submit-button');
      $submitButton.button('loading');

      const credentials = {
        name: $('#js-name').val(),
        email: $('#js-email').val(),
        password: $('#js-password').val(),
        password_confirmation: $('#js-password-confirm').val()
      };

      chrome.runtime.sendMessage({
        type: 'registration',
        data: credentials
      }, response => {
        $submitButton.button('reset');
        if (response.isSuccess) {
          this.show();
          Alert.showSuccess('Please, confirm your email to finish registration.');
          resolve();
        } else {
          if (response.errors) {
            let errorMessage = '';
            Object.keys(response.errors).forEach(errorName => {
              errorMessage = errorMessage + '- ' + response.errors[errorName] + '<br>';
            });
            Alert.showError(errorMessage);
          } else {
            Alert.showError(response.statusText);
          }
          reject(response.statusText);
        }
      });
    });
  }
}
