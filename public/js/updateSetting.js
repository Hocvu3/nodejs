import axios from "axios";
import { showAlert } from "./alert";
export const updateSettings = async (data, type) => {
    try {
        const url =
            type === "password"
                ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword"
                : "http://127.0.0.1:3000/api/v1/users/updateMe";
        const res = await axios({
            method: "PATCH",
            url,
            data,
        });
        if (res.data.status === "success") {    
            showAlert("success", `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        // Safely handle cases where err.response or err.response.data is undefined
        if (err.response && err.response.data) {
            showAlert("error", err.response.data.message);
        } else {
            console.log("An error occurred:", err.message);
        }       
    }
};