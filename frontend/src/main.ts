import {Dialog} from "./Dialog";
import config from "../../config.json";

window.addEventListener("DOMContentLoaded", () => {

    let schoolDistrictNamesHTML = "";

    for (let i = 0; i < config.SchoolDistricts.length; i++){
        schoolDistrictNamesHTML += ("<option>" + config.SchoolDistricts[i].name + "</option>");
    }

    new Dialog("" +
        "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>Login</h1>" +
        "<hr style='color: white'>" +
        "<p class='text' style='text-align: center;'>School District:</p>" +
        "<select id='schoolDistrict'>" +
        schoolDistrictNamesHTML +
        "</select>" +
        "<p class='text' style='text-align: center;' id='usernameInput'>Username/Student ID:</p>" +
        "<input type='text' placeholder='Username/Student ID'>" +
        "<p class='text' style='text-align: center;'>Password:</p>" +
        "<input type='password' placeholder='Password' id='passwordInput'>" +
        "<br>" +
        "<button id='buttonLogin' onclick='window.onClickLogin()'>Login</button>"
    );


});

// @ts-ignore
window.onClickLogin = () => {
    // @ts-ignore
    let schoolDistrict: string = document.querySelector('#schoolDistrict').value;
    // @ts-ignore
    let usernameInput: string = document.querySelector('#usernameInput').value;
    // @ts-ignore
    let passwordInput: string = document.querySelector('#passwordInput').value;

    
}