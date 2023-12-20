import {v4} from "uuid";
export class ClientID {
    public readonly clientID: string;
    public expires: number;
    public status: Status;
    public errorMessage? : string;
    public screenshot? : any;

    public constructor() {
        this.clientID = v4();
        this.expires = Date.now() + 360000 // expire in 3 minutes
        this.status = Status.LoggingIn;
    }
}

export enum Status {
    Failed = -1,
    LoggingIn,
    FindingGrades,
    GrabbingGrades,
    Success
}