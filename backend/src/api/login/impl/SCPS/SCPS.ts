import {Login} from "../../login";
import puppeteer from "puppeteer";
import {ClientID} from "../../../../ClientID";
import {ClientIDS} from "../../../../main";
import serverConfig from "../../../../../../config.json";
import fs from "node:fs";
import request from "request";

export class SCPS extends Login {
    public async doLogin(clientID: string, StudentID: string, Password: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {

            // Launch the browser and open a new blank page
            const browser = await puppeteer.launch({
                headless: false,
                executablePath: "./browser/core/firefox.exe",
                product: "firefox",
                protocol: "webDriverBiDi"
            });
            const page = await browser.pages().then((pages) => {
                return pages[0]
            });

            // Navigate the page to a URL
            await page.goto('https://skyward.scps.k12.fl.us/scripts/wsisa.dll/WService=wsEAplus/fwemnu01.w');

            // Set screen size
            await page.setViewport({width: 640, height: 480});
            await page.type("#login", StudentID);
            await page.type("#password", Password);
            await page.click("#bLogin");
            const nav = new Promise(res => browser.on('targetcreated', res))
            await nav
            const page2 = await browser.pages().then((pages) => {
                return pages[1]
            });
            await page2.reload();
            // using timeout as waitforselector does not work for some reason
            await new Promise(r => setTimeout(r, 2000));
            await page2.click("#sf_navMenu > li:nth-child(3) > a");
            await new Promise(r => setTimeout(r, 4000));
            await page2.screenshot({encoding: "binary", path: "./screenshot.png"});

            const courseData = await page2.evaluate(() => {
                const elems = document.querySelectorAll("#showGradeInfo");

                class Data {
                    public stuId: string | null = null;
                    public entityId: string | null = null;
                    public corNumId: string | null = null;
                    public gbId: string | null = null;
                    public bucket: string | null = null;
                    public empty: boolean | null = null;
                }

                let result: Data[] = [];
                elems.forEach((elem) => {
                    let data = new Data();
                    data.stuId = elem.getAttribute("data-sid");
                    data.entityId = elem.getAttribute("data-eid");
                    data.corNumId = elem.getAttribute("data-cni");
                    data.gbId = elem.getAttribute("data-gid");
                    data.bucket = elem.getAttribute("data-bkt");
                    data.empty = elem.classList.contains("emptyGrade");
                    result.push(data);
                });


                return Promise.resolve(result)
            });

            //await console.log(courseData);

            await browser.close();


            setTimeout(() => {
                
                const options = {
                    method: 'POST',
                    url: 'https://skyward.scps.k12.fl.us/scripts/wsisa.dll/WService=wsEAplus/skyporthttp.w',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'insomnia/8.4.5'
                    },
                    form: {
                        requestAction: 'eel',
                        method: 'extrainfo',
                        codeType: 'tryLogin',
                        codeValue: StudentID,
                        login: StudentID,
                        password: Password,
                        SecurityMenuID: '0',
                        HomePageMenuID: '0',
                        nameid: '-1',
                        hNavSearchOption: 'all',
                        CurrentProgram: 'skyportlogin.w',
                        HomePage: 'sepadm01.w',
                        cUserRole: 'family/student',
                        fwtimestamp: Date.now()
                    }
                };
    
                request(options, (error, response, body) => {
                    if (error) throw new Error(error);
                    let session = body.split("^")[1] + "" + body.split("^")[2];
                    let otherSession = [];
                    otherSession.push(body.split("<li>")[1].split("</li>")[0].split("^")[0]);
                    otherSession.push(body.split("<li>")[1].split("</li>")[0].split("^")[3]);
                    let parsed: string[] = [];
                    body.split("<li>")[1].split("</li>")[0].split("^").forEach((str: string) => {parsed.push(str);});
                    const options = {
                        method: 'POST',
                        url: 'https://skyward.scps.k12.fl.us/scripts/wsisa.dll/WService=wsEAplus/httploader.p?file=sfgradebook001.w',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': 'insomnia/8.4.5'
                        },
                        form: {
                            action: "viewGradeInfoDialog",
                            gridCount: "1",
                            fromHttp: "yes",
                            stuId: parsed[4],
                            entityId: "0251",
                            corNumId: courseData[0].corNumId,
                            track: "0",
                            gbId: courseData[0].gbId,
                            bucket: courseData[0].bucket,
                            sessionid: session,
                            dwd: otherSession[0],
                            wfaacl: otherSession[1]
                        }
                    };
    
                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);
    
                        console.log(body);
                    });
    
    
                });
    

            }, 5000);

            

        });
        return promise;
    }

    public duplicate(): Login {
        return new SCPS();
    }
}