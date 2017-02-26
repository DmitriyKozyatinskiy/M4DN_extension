import $ from 'jquery';
import Mustache from 'mustache';
import template from './Devices.html';
import newDeviceTemplate from './AddDevice.html';
import Device from './Device/Device';
import './Devices.scss';
import Alert from './../Alert/Alert';

export default class Devices {
  constructor() {
    this._devices = [];
    this._activeDeviceID = null;
  }


  _setEvents() {
    $(document)
      .on('click', '#js-add-new-device', this._showNewDeviceForm)
      .on('submit', '#js-add-device-form', this._saveDevice)
      .on('change', '.js-device-selector', this._setActiveDevice);
    return this;
  }


  _showNewDeviceForm() {
    const $template = $(Mustache.render(newDeviceTemplate));
    $('#js-modal-title').html('Add new device');
    $('#js-modal-body').html($template);
    $('#js-modal').modal('show');
  }


  _saveDevice(event) {
    return new Promise((resolve, reject) => {
      event.preventDefault();
      const $submitButton = $(event.target).find('.js-submit-button');
      $submitButton.button('loading');
      const data = {
        name: $('#js-device-name').val()
      };

      chrome.runtime.sendMessage({
        type: 'saveDevice',
        data: data
      }, response => {
        $submitButton.button('reset');
        if (response.isSuccess) {
          $('#js-modal').modal('hide');
          Alert.showSuccess(response.statusText);
          const newDevice = new Device(response.data.device);
          newDevice.triggerClick();
          resolve(response.data.device);
        } else {
          Alert.showError(response.statusText, true);
          reject(response.statusText);
        }
      });
    });
  }


  _setActiveDevice(event) {
    return new Promise((resolve, reject) => {
      const $device = $(event.target);
      const deviceID = $device.val();
      chrome.runtime.sendMessage({
        type: 'setActiveDeviceID',
        data: {
          id: deviceID
        }
      }, () => {
        resolve();
      });
    });
  }


  _getDevices() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'getDevices'
      }, response => {
        if (response.isSuccess) {
          resolve(response.data.devices);
        } else {
          reject(response.statusText);
        }
      });
    });
  }


  getActiveDeviceID() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'getActiveDeviceID'
      }, activeDeviceID => {
        console.log('ACTIVE: ', activeDeviceID);
        if (activeDeviceID) {
          this._activeDeviceID = activeDeviceID;
          resolve(activeDeviceID);
        } else {
          resolve();
        }
      });
    });
  }


  show() {
    this._getDevices().then(devices => {
      this._devices = devices;
      const $template = $(Mustache.render(template));
      $('#js-main').html($template);

      this.getActiveDeviceID().then(activeDeviceID => {
        if (!this._devices.length) {
          Alert.showWarning('Add a device to continue');
        } else if (!activeDeviceID) {
          Alert.showWarning('Choose a device or add a new one to continue');
        }

        this._devices.forEach(device => {
          console.log('Device: ', device);
          if (device.id == activeDeviceID) {
            console.log('active');
            device.isActive = true;
          }

          new Device(device);
        });
        this._setEvents();
      });
      return this;
    });
  }
}
