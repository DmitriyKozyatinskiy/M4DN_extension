import 'bootstrap-loader';
import 'font-awesome-webpack';
import './options.scss';
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

$(document).on('auth:success', () => {
  devices.show();
  auth.isAuthed().then(footer.show);
}).on('logout:success', () => auth.show());


$('#js-modal').on('show.bs.modal', () => {
  $body.addClass('Body--HasModal');
}).on('hidden.bs.modal', () => {
  $body.removeClass('Body--HasModal');
});