export class StatusQuery {
    public static clientID: string;
    public static expires: number;
    public static status: string;
    public static courseGrades: any[];
    public static errorMessage: string;
    public static screenshot: any;
    public static schoolCode: string;

    public static registerQueryInterval(clientID: string, onFinishedCallback?: () => string){
        this.query(clientID);
        let interval = setInterval(()=> {
            if (this.status == "Success" || this.status == "Failed"){
                clearInterval(interval);
                if (onFinishedCallback)
                    onFinishedCallback();
                return;
            }
            if (this.expires){
                if (Date.now() > this.expires){
                    clearInterval(interval);
                }
            }
            this.query(clientID);


        }, 2000);
    }

    private static query(clientID: string) {
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

            })
            .catch(err => console.error(err));
    }
}