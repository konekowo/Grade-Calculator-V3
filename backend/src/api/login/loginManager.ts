import { SCPS } from './impl/SCPS/SCPS';
import { Login } from "./login";
import serverConfig from "../../../../config.json";

export class LoginManager {
    public readonly list:any[] = [];
    public constructor() {

       this.register(new SCPS(), "SCPS");

    }

    private register(loginScript: Login, schoolDistrictCode: string){
        let district;
        serverConfig.SchoolDistricts.forEach((obj) => {
            if (obj.code == schoolDistrictCode)
                district = obj;
        });
        // add loginScript property to object, using @ts-ignore since TypeScript doesn't allow this.
        // @ts-ignore
        district.loginScript = loginScript;
        this.list.push(district);
    }

    public GetObjWithDistrictCode(schoolDistrictCode: string) : null | {code: string, name: string, loginScript: Login} {
        for (let i = 0; i < this.list.length; i++){
            if (this.list[i].code == schoolDistrictCode) {
                return this.list[i];
            }
        }
        return null;
    }
}