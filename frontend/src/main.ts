import {Dialog} from "./Dialog";
import config from "../../config.json";
import {StatusQuery} from "./StatusQuery";
import {CoursePage} from "./CoursePage";

let loginDialog: Dialog;
let statusDialog: Dialog;
// this is for development use only!
let useTestResponse: boolean = false;
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
        "<p class='text' style='text-align: center; color: rgb(255,194,194);' id='loginErrorMsg'></p>" +
        "<div style='width: 50%; margin: auto;'>" +
        "<p class='text' style='text-align: center'>Your Login information is sent to our server and then directly sent to your school district's login server. " +
        "Your login information is NEVER stored on the server (but is stored in the server's RAM, due to how computers work). <br>" +
        "Don't beleive us? <br> The code for this grade calcultor (both server AND client) is <a class='text link' href='https://github.com/konekowo/Grade-Calculator-V3/' target='_blank'>open source.</a></p>" +
        "</div>" +
        "<padding style='opacity: 0; width: 100%; height: 10px; display: block;'></padding>" +
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

    if (statusDialog){
        statusDialog.Destroy();
    }

    // @ts-ignore
    document.querySelector("#buttonLogin").setAttribute("disabled", "");
    loginDialog.CloseDialog();

    statusDialog = createStatusDialog();

    if (!useTestResponse) {
        const options = {
            method: 'POST',
            body: new URLSearchParams({
                studentid: usernameInput,
                password: passwordInput,
                schooldistrictcode: schoolDistrict
            })
        };

        fetch('http://localhost:9090/api/login', options)
            .then(async response => {
                let textResponse = await response.text();
                if (!textResponse.startsWith("Error:")) {
                    return JSON.parse(textResponse);
                } else {
                    console.warn(textResponse);
                    return textResponse;
                }
            })
            .then(response => {
                if (response.clientID) {
                    StatusQuery.registerQueryInterval(response.clientID, statusDialog, loginDialog, schoolDistrict, finishedCallback);
                } else {
                    if (response == "Error: One or more parameters were not set.") {
                        // @ts-ignore
                        document.querySelector("#loginErrorMsg").innerText = "Error: One or more fields are not filled in."
                    }
                    statusDialog.CloseDialog();
                    loginDialog.OpenDialog();
                    // @ts-ignore
                    document.querySelector("#buttonLogin").removeAttribute("disabled");
                }

            })
            .catch(err => {
                statusDialog.DestroyWithAnim();
                console.error(err);
                setTimeout(() => {
                    let errorDialog = new Dialog("" +
                        "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>Error</h1>" +
                        "<hr style='color: white'>" +
                        "<p class='text' style='text-align: center; margin-left: 20px; margin-right: 20px;'>We weren't able to reach the backend server, please try again later.</p>" +
                        "<p class='text' style='text-align: center; color: rgb(255,194,194)'>Error: " + err + "</p>",
                        false);
                    errorDialog.OpenDialog();
                }, 500);


            });
    }
    else {
        StatusQuery.useTestResponse(statusDialog, loginDialog);
        finishedCallback(schoolDistrict);
    }

    
}


function finishedCallback(schoolDistrict: string) {
    if (StatusQuery.status == "Failed"){
        if (StatusQuery.errorMessage == "Wrong Password or User ID"){
            // @ts-ignore
            document.querySelector("#loginErrorMsg").innerText = "Error: Wrong Password or Student ID";
            statusDialog.CloseDialog();
            loginDialog.OpenDialog();
            // @ts-ignore
            document.querySelector("#buttonLogin").removeAttribute("disabled");
        }
    }
    if (StatusQuery.status == "Success"){
        statusDialog.DestroyWithAnim();
        new CoursePage(schoolDistrict);
    }

}

function createStatusDialog() {
    return new Dialog("" +
        "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>Logging In...</h1>" +
        "<hr style='color: white'>" +
        "<p class='text' style='text-align: center;'>Please wait while we log you in and process your grades...</p>" +
        "<p class='text' style='text-align: center;' >Status: <span style='color: rgb(173,248,165)' class='statusDialog status text'>Sending request to server</span></p>" +
        "<div class='load' style='margin: auto;'></div>",
        true);

}