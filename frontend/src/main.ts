import {Dialog} from "./Dialog";
import config from "../../config.json";
import {StatusQuery} from "./StatusQuery";

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
        "<p class='text' style='text-align: center;'>Username/Student ID:</p>" +
        "<input type='text' placeholder='Username/Student ID' id='usernameInput'>" +
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

    // Convert district name into district code
    config.SchoolDistricts.forEach((obj) => {
        if (obj.name == schoolDistrict){
            schoolDistrict = obj.code;
        }
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'insomnia/8.4.5'
        },
        body: new URLSearchParams({studentid: usernameInput, password: passwordInput, schooldistrictcode: schoolDistrict})
    };

    fetch('http://localhost:9090/api/login', options)
        .then(async response => {
            let textResponse = await response.text();
            if (!textResponse.startsWith("Error:")) {
                return JSON.parse(textResponse);
            } else {
                console.warn(textResponse);
                return JSON.parse("{}");
            }
        })
        .then(response => {
            StatusQuery.registerQueryInterval(response.clientID);
        })
        .catch(err => console.error(err));

    
}