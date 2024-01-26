import express, {Request, Response} from "express";
import serverConfig from "../../config.json";
import cors from "cors";
import {LoginManager} from "./api/login/loginManager";
import {ClientID, Status} from "./ClientID";
import {BrowserInstaller} from "./BrowserInstaller";
import os from "os";
import bodyParser from "body-parser";
import * as log4js from "log4js";
import {Global} from "./Global";


if (os.type() == "Darwin"){
    throw new Error("macOS is currently not supported!")
}

const app: express.Application = express();
const port: number = serverConfig.backendPort;

const loginManager = new LoginManager();


log4js.configure({
    appenders: { file: { type: "file", filename: "log.txt" }, stdout: { type: "stdout" } },
    categories: { default: { appenders: ["file", "stdout"], level: serverConfig.backendDoDebugLog? "debug" : "info" } },
});

Global.logger = log4js.getLogger();

export class ClientIDS {
    public static clientIDs: ClientID[] = [];

    public static getUsingClientID(clientID: string) {
        for (let i = 0; i < ClientIDS.clientIDs.length; i++){
            if (ClientIDS.clientIDs[i].clientID == clientID){
                return ClientIDS.clientIDs[i];
            }
        }
        return null;
    }

    public static getActiveRequests(){
        let activeRequests = 0;
        ClientIDS.clientIDs.forEach((clientID) => {
            if (clientID.status != Status.Success && clientID.status != Status.Failed){
                activeRequests++;
            }
        });
        Global.logger.debug("Active requests:", activeRequests);
        return activeRequests;
    }
}

BrowserInstaller.isInstalled().then((result) => {
   if (!result){
       Global.logger.log("Browser not installed, installing... (This could take a few minutes, please wait!)")
       BrowserInstaller.install().then(() => {
           init();
       });
   }
   else {
       init();
   }
});


function init() {
    app.listen(port, () => {
        Global.logger.log(`Listening at http://localhost:${port}/`);
    });
    setInterval(()=> {
        for (let i = 0; i < ClientIDS.clientIDs.length; i++){
           if (Date.now() > ClientIDS.clientIDs[i].expires){
               Global.logger.log("Expiring ClientID:", ClientIDS.clientIDs[i].clientID)
               ClientIDS.clientIDs.splice(i, 1);
           }
        }
    },1000);
}

app.use(cors({
    origin: '*'
}))

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/login/', (req: Request, res: Response) => {

    if (!req.body.studentid || !req.body.password || !req.body.schooldistrictcode){
        res.send("Error: One or more parameters were not set.");
        return;
    }

    if (ClientIDS.getActiveRequests() >= serverConfig.backendMaxActiveRequests){
        Global.logger.warn("Server is currently being rate-limited, consider turning up 'backendMaxActiveRequests' " +
            "to allow for more requests if your hardware can handle it.");
        res.send("Error: This server is currently being rate-limited, please try again later.");
        return;
    }

    let schoolDistrictCode = req.body.schooldistrictcode;
    let isSchoolDistrictInList = false;
    serverConfig.SchoolDistricts.forEach((obj) => {
        if (obj.code == schoolDistrictCode)
            isSchoolDistrictInList = true;
    });
    if (!isSchoolDistrictInList){
        res.send("Error: The School District code provided is not supported by this Grade Calculator Server!");
        return;
    }

    let loginScript = loginManager.GetObjWithDistrictCode(schoolDistrictCode)?.loginScript;
    let duplicatedLoginObj;
    if (loginScript !== undefined){
        duplicatedLoginObj = loginScript.duplicate();
    }
    else {
        throw new Error("Login Script undefined! " +
            "Is the login script that was requested by the client registered in the LoginManager?")
    }
    let clientID = new ClientID(schoolDistrictCode);
    Global.logger.log("Logging in "+clientID.clientID+"!");
    ClientIDS.clientIDs.push(clientID);
    duplicatedLoginObj.doLogin(clientID.clientID, req.body.studentid, req.body.password).then((result:any) => {
        Global.logger.debug(clientID.clientID+":", result);
        Global.logger.log("Done with "+clientID.clientID+"!");
    });

    res.send(clientID);
});

app.use("/api/status/", (req: Request, res: Response) => {
    if (!req.body.clientid){
        res.send("Error: One or more parameters were not set.");
        return;
    }
    let clientObj = ClientIDS.getUsingClientID(req.body.clientid);
    if (clientObj === null){
        res.send("Error: The client ID is expired or does not exist.");
        return;
    }
    res.send(clientObj);
});





