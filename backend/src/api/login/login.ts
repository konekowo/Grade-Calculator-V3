
export class Login {

    public async doLogin(clientID: string, StudentID: string, Password: string): Promise<any> {
        throw new Error("You're supposed to extend off of this Login class and override the doLogin() method.");
    }


    public duplicate() {
        return new Login();
    }


}

export class Course {
    public courseName?: string;
    public courseID?: string;
    public teacher?: string;
    public Q1: Grade[] = [];
    public Q2: Grade[] = [];
    public S1: Grade[] = [];
    public Q3: Grade[] = [];
    public Q4: Grade[] = [];
    public S2: Grade[] = [];
}

export class Grade {
    public type?: string;
    public name?: string;
    public date?: string;
    public points?: string;
    public missing?: boolean;
    public comment?: string;
}