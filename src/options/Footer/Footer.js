import $ from 'jquery';
import Mustache from 'mustache';
import template from './Footer.html';
import './Footer.scss';

export default class Footer {
  constructor() {
    this._setEvents();
  }


  _setEvents() {
    $(document).on('click', '#js-logout', event => this.logout(event));
    return this;
  }


  show(user) {
    const $template = $(Mustache.render(template, user));
    $('#js-footer').html($template);
    return this;
  }


  hide() {
    $('#js-footer').empty();
  };


  logout(event) {
    this.hide();
    return new Promise((resolve, reject) => {
      event.preventDefault();
      chrome.runtime.sendMessage({
        type: 'logout'
      }, () => {
        $(document).trigger('logout:success');
        resolve();
      });
    });
  }
}
