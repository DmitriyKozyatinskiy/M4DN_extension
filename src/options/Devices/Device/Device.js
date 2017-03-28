import $ from 'jquery';
import Mustache from 'mustache';
import template from './Device.html';
import './Device.scss';

export default class Device {
  constructor(data) {
    this._data = data;
    this._$node = null;
    this.show()._setEvents();
  }


  _setEvents() {
    return this;
  }


  show() {
    const $template = $(Mustache.render(template, this._data));
    this._$node = $template;
    $template.appendTo('#js-devices');
    if (this._data.isActive) {
      $template.find('.js-device-selector').prop('checked', true);
    }
    
    return this;
  }


  triggerClick() {
    this._$node.find('.js-device-selector').trigger('click');
    return this;
  }
}
