export class Login {

    public async doLogin(clientID: string, StudentID: string, Password: string): Promise<any> {
        throw new Error("You're supposed to extend off of this Login class and override the doLogin() method.");
    }


    public duplicate() {
        return new Login();
    }


}