import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: { 
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {   
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        // Safely handle cases where err.response or err.response.data is undefined
        if (err.response && err.response.data) {
            showAlert('error', err.response.data.message);
        } else {
            console.log('An error occurred:', err.message);
        }
    }
};

export const logout = async () => {
    console.log('logging out');
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};
