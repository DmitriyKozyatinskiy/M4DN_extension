import $ from 'jquery';
import './Loader.scss';

export default class Loader {
  constructor() {}

  static show() {
    $('body').addClass('no-events');
    $('.js-loading-container').removeClass('hidden');
  }

  static hide() {
    $('.js-loading-container').addClass('hidden');
    $('body').removeClass('no-events');
  }
}
