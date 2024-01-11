import {Dialog} from "./Dialog";
import config from "../../config.json";
import {StatusQuery} from "./StatusQuery";

let loginDialog: Dialog;
let statusDialog: Dialog;
window.addEventListener("DOMContentLoaded", () => {

    let schoolDistrictNamesHTML = "";

    for (let i = 0; i < config.SchoolDistricts.length; i++){
        schoolDistrictNamesHTML += ("<option>" + config.SchoolDistricts[i].name + "</option>");
    }

    loginDialog = new Dialog("" +
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
        "<padding style='opacity: 0; width: 100%; height: 40px; display: block;'></padding>" +
        "<button id='buttonLogin' onclick='window.onClickLogin()'>Login</button>",
        true
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

    // @ts-ignore
    document.querySelector("#buttonLogin").setAttribute("disabled", "");
    loginDialog.CloseDialog();

    statusDialog = new Dialog("" +
        "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>Logging In...</h1>" +
        "<hr style='color: white'>" +
        "<p class='text' style='text-align: center;'>Please wait while we log you in and process your grades...</p>" +
        "<p class='text' style='text-align: center;'>Status: <span style='color: rgb(173,248,165)' class='text'>Sending request to server</span></p>" +
        "<div class='load' style='margin: auto;'></div>",
        true);

    const options = {
        method: 'POST',
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