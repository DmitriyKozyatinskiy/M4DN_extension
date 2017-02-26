import $ from 'jquery';
import Mustache from 'mustache';
import errorTemplate from './ErrorTemplate.html';
import successTemplate from './SuccessTemplate.html';
import warningTemplate from './WarningTemplate.html';

import './Alert.scss';


export default class Alert {
  constructor() {}


  _setEvents() {
    return this;
  }


  static showSuccess(text, isModal = false) {
    Alert.hide();
    const $template = $(Mustache.render(successTemplate, {
      text: text
    }));
    const $container = isModal ? $('#js-modal-body') : $('#js-wrapper');
    $template.prependTo($container);
    $('#js-success-message').alert();
    return this;
  }


  static showError(text, isModal = false) {
    Alert.hide();
    const $template = $(Mustache.render(errorTemplate, {
      text: text
    }));
    const $container = isModal ? $('#js-modal-body') : $('#js-wrapper');
    $template.prependTo($container);
    $('#js-error-message').alert();
    return this;
  }


  static showWarning(text, isModal = false) {
    Alert.hide();
    const $template = $(Mustache.render(warningTemplate, {
      text: text
    }));
    const $container = isModal ? $('#js-modal-body') : $('#js-wrapper');
    $template.prependTo($container);
    $('#js-error-message').alert();
    return this;
  }

  
  static hide() {
    $('.js-message').remove();
  }
}
