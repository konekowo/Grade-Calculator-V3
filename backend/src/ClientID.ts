import {v4} from "uuid";
import {Course} from "./api/login/login";
export class ClientID {
    public readonly clientID: string;
    public expires: number;
    public status: Status;
    public studentName?: string;
    public courseGrades?: Course[];
    public errorMessage? : string;
    public screenshot? : any;
    public readonly schoolCode: string;

    public constructor(schoolCode: string) {
        this.clientID = v4();
        this.expires = Date.now() + 360000 // expire in 3 minutes
        this.status = Status.LoggingIn;
        this.schoolCode = schoolCode;
    }
}

export enum Status {
    Failed = "Failed",
    LoggingIn = "Logging In",
    FindingGrades = "Finding Grades",
    GrabbingGrades = "Grabbing Grades",
    Success = "Success"
}