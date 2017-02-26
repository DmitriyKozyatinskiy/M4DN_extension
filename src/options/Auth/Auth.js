import $ from 'jquery';
import Mustache from 'mustache';
import template from './Auth.html';
import './Auth.scss';
import Alert from './../Alert/Alert';

export default class Auth {
  constructor() {
    this._$node = null;
  }


  _setEvents() {
    $('#js-login-form').on('submit', this.login);
    return this;
  }


  show() {
    const $template = $(Mustache.render(template));
    $('#js-main').html($template);
    this._setEvents();
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
}
