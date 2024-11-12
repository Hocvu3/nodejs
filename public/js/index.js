console.log("hello from parcel")
import '@babel/polyfill';
import { login,logout } from './login';
import {updateSettings} from './updateSetting';
import {bookTour} from './stripe';
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
if (logoutBtn) {
    console.log('hi');
    logoutBtn.addEventListener('click', logout);
};
const loginForm = document.querySelector('.form');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log('submitted');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}; 
if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        updateSettings(form, 'data');
    });
}
if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        updateSettings({passwordCurrent, password, passwordConfirm}, 'password');
    });
}
if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const {tourId} = e.target.dataset;
        bookTour(tourId);
        alert('Booked successfully');
    });
}