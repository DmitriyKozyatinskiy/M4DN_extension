import 'bootstrap-loader';
import 'font-awesome-webpack';
import './options.scss';
import Alert from './Alert/Alert';
import Auth from './Auth/Auth';
import Devices from './Devices/Devices';
import Footer from './Footer/Footer';

const auth = new Auth();
const devices = new Devices();
const footer = new Footer();

const $body = $('#js-body');

auth.isAuthed().then(user => {
  devices.show();
  footer.show(user);
}, () => auth.show());

chrome.extension.isAllowedIncognitoAccess(isAllowed => {
  if (!isAllowed) {
    Alert.showWarning(`<a id="js-incognito-warning-url" href="#">Allow incognito mode to get full capabilities</a>`);
  }
});

$(document).on('auth:success', () => {
  devices.show();
  auth.isAuthed().then(footer.show);
})
  .on('logout:success', () => auth.show())
  .on('click', '#js-incognito-warning-url', event => {
    event.preventDefault();
    chrome.tabs.create({ url: `chrome://extensions/?id=${ chrome.runtime.id }` });
  });

$('#js-modal').on('show.bs.modal', () => {
  $body.addClass('Body--HasModal');
}).on('hidden.bs.modal', () => {
  $body.removeClass('Body--HasModal');
});