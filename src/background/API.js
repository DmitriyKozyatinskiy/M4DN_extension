import 'whatwg-fetch';

// const API_URL = 'http://sneekr.herokuapp.com/api/v1';
const API_URL = 'http://127.0.0.1:8000/api/v1';

export default class API {
  constructor() {
    this._setEvents();
  }


  _setEvents() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case 'registration':
          this.register(request.data).then(sendResponse, sendResponse);
          break;
        case 'login':
          this.login(request.data).then(sendResponse, sendResponse);
          break;
        case 'logout':
          this.logout().then(sendResponse, sendResponse);
          break;
        case 'isAuthed':
          this.checkAuth().then(sendResponse, sendResponse);
          break;
        case 'getDevices':
          this.getDevices().then(sendResponse, sendResponse);
          break;
        case 'saveDevice':
          this.saveDevice(request.data).then(sendResponse, sendResponse);
          break;
        case 'setActiveDeviceID':
          this.saveActiveDevice(request.data.id).then(sendResponse, sendResponse);
          break;
        case 'getActiveDeviceID':
          this.getActiveDevice().then(sendResponse, sendResponse);
          break;
        default:
          break;
      }

      return true;
    });
    return this;
  }


  _checkStatus(response) {
    if (response.ok) {
      return response.json();
    } else {
      const error = new Error(response.statusText);
      return response.json().then(data => {
        error.response = data;
        throw error;
      });
    }
  }


  _setUninstallURL() {
    //chrome.runtime.setUninstallURL('');
    // chrome.runtime.setUninstallURL('http://127.0.0.1:8000', () => {

      // fetch(API_URL + '/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + localStorage['token']
      //   },
      //   body: JSON.stringify({
      //     deviceID: localStorage['activeDevice']
      //   })
      // })

    // });
  }


  saveToken(token) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({'token': token}, () => {
        localStorage['token'] = token;
        this._setUninstallURL();
        resolve();
      });
    });
  }


  getToken() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('token', token => {
        if (token && token.token) {
          localStorage['token'] = token.token;
          this._setUninstallURL();
          resolve(token.token);
        } else {
          reject({
            isSuccess: false,
            statusMessage: 'Unauthorized'
          });
        }
      });
    });
  }


  checkAuth() {
    return new Promise((resolve, reject) => {
      this.getToken().then(token => {
        fetch(API_URL + '/auth/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(this._checkStatus)
          .then(resolve)
          .catch(error => {
            this.logout().then(() => {
              reject(error.response);
            });
          });
      }, reject);
    })
  }


  login(credentials) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
        .then(this._checkStatus)
        .then(response => {
          this.saveToken(response.data.token).then(() => {
            resolve(response);
          });
        })
        .catch(error => {
          this.logout().then(() => {
            reject(error.response);
          });
        });
    })
  }


  register(credentials) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + '/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
        .then(this._checkStatus)
        .then(response => {
          this.saveToken(response.data.token).then(() => {
            resolve(response);
          });
        })
        .catch(error => {
          this.logout().then(() => {
            reject(error.response);
          });
        });
    })
  }


  logout() {
    return new Promise((resolve, reject) => {
      this.saveToken('').then(() => {
        this.saveActiveDevice('').then(() => {
          localStorage['token'] = null;
          localStorage['activeDevice'] = null;
          resolve();
        });
      });
    });
  }


  getDevices() {
    return new Promise((resolve, reject) => {
      this.getToken().then(token => {
        fetch(API_URL + '/devices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(this._checkStatus)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            if (error.response.status === 401) {
              this.logout();
            }
            reject(error.response);
          });
      }, reject);
    })
  }


  saveDevice(data) {
    return new Promise((resolve, reject) => {
      this.getToken().then(token => {
        fetch(API_URL + '/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(data)
        })
          .then(this._checkStatus)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            if (error.response.status === 401) {
              this.logout();
            }
            reject(error.response);
          });
      }, reject);
    })
  }


  saveActiveDevice(id) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({'activeDevice': id}, () => {
        localStorage['activeDevice'] = id;
        resolve();
      });
    });
  }


  getActiveDevice() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('activeDevice', activeDevice => {
        if (activeDevice && activeDevice.activeDevice) {
          localStorage['activeDevice'] = activeDevice.activeDevice;
          resolve(activeDevice.activeDevice);
        } else {
          reject();
        }
      });
    });
  }


  saveVisit(data) {
    return new Promise((resolve, reject) => {
      this.getToken().then(token => {
        this.getActiveDevice().then(activeDevice => {
          data.deviceID = activeDevice;
          fetch(API_URL + '/visits', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
          })
            .then(this._checkStatus)
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              if (error.response.status === 401) {
                this.logout();
              }
              reject(error.response);
            });
        });
      }, reject);
    })
  }
}
