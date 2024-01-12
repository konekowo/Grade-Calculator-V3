import {Dialog} from "./Dialog";
import testResponse from "./test.json";

export class StatusQuery {
    public static clientID: string;
    public static expires: number;
    public static status: string;
    public static courseGrades: any[];
    public static errorMessage: string;
    public static screenshot: any;
    public static schoolCode: string;

    public static registerQueryInterval(clientID: string, statusDialog: Dialog, schoolDistrictCode: string, onFinishedCallback?: (schoolDistrictCode: string) => void){
        this.query(clientID, statusDialog);
        let interval = setInterval(()=> {
            if (this.status == "Success" || this.status == "Failed"){
                clearInterval(interval);
                if (onFinishedCallback)
                    onFinishedCallback(schoolDistrictCode);
                return;
            }
            if (this.expires){
                if (Date.now() > this.expires){
                    clearInterval(interval);
                }
            }
            this.query(clientID, statusDialog);


        }, 2000);
    }

    public static useTestResponse(statusDialog: Dialog) {
        this.parse(testResponse, statusDialog);
    }

    private static query(clientID: string, statusDialog: Dialog) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'insomnia/8.4.5'
            },
            body: new URLSearchParams({clientid: clientID})
        };

        fetch('http://localhost:9090/api/status', options)
            .then(async response => {
                let textResponse = await response.text();
                if (!textResponse.startsWith("Error:")) {
                    return JSON.parse(textResponse);
                } else {
                    this.errorMessage = textResponse;
                    return JSON.parse("{}");
                }
            })
            .then(response => {
                this.parse(response, statusDialog);
            })
            .catch(err => console.error(err));
    }

    private static parse(response: any, statusDialog: Dialog) {
        if (response.clientID){
            this.clientID = response.clientID;
        }
        if (response.expires){
            this.expires = response.expires;
        }
        if (response.status){
            this.status = response.status;
        }
        if (response.courseGrades){
            this.courseGrades = response.courseGrades;
        }
        if (response.errorMessage){
            this.errorMessage = response.errorMessage;
        }
        if (response.screenshot){
            this.screenshot = response.screenshot;
        }
        if (response.schoolCode){
            this.schoolCode = response.schoolCode;
        }
        // @ts-ignore
        statusDialog.GetHtmlDiv().querySelector(".statusDialog.status").innerText = response.status;
    }
}