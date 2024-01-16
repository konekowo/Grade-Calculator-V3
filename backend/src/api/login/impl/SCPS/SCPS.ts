import {Course, Grade, Login} from "../../login";
import puppeteer from "puppeteer";
import {Status} from "../../../../ClientID";
import {ClientIDS} from "../../../../main";
import request from "request";
import {parse} from 'node-html-parser';
import {JSDOM} from 'jsdom';
import os from "os";

export class SCPS extends Login {
    public async doLogin(clientID: string, StudentID: string, Password: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let clientObj = ClientIDS.getUsingClientID(clientID);
            if (clientObj === null){
                return Status.Failed;
            }

            clientObj.status = Status.LoggingIn;
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
                let parsed: string[] = [];
                body.split("<li>")[1].split("</li>")[0].split("^").forEach((str: string) => {parsed.push(str);});
                let session = parsed[1] + "" + parsed[2];
                const options2 = {
                    method: 'POST',
                    url: 'https://skyward.scps.k12.fl.us/scripts/wsisa.dll/WService=wsEAplus/sfhome01.w',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'insomnia/8.4.5'
                    },
                    form: {
                        cUserRole: "family/student",
                        dwd: parsed[0],
                        wfaacl: parsed[3],
                        encses: parsed[14],
                        nameid: parsed[4],
                        CurrentProgram: "skyportlogin.w",
                        duserid: StudentID,
                        HomePage: "sepadm01.w",
                        'web-data-recid': parsed[1],
                        'wfaacl-recid': parsed[2]
                    }
                };

                request(options2, function (error, response, body) {
                    if (error) throw new Error(error);
                    const gradePortalHome = parse(body);
                    let sessionIdElement = gradePortalHome.querySelector("#sessionid");
                    let encsesElement = gradePortalHome.querySelector("#encses");
                    if (sessionIdElement === null || encsesElement === null){
                        // @ts-ignore
                        clientObj.status = Status.Failed;
                    }
                    else {
                        // @ts-ignore
                        clientObj.status = Status.GrabbingGrades;

                        let allCoursesParsed: Course[] = [];
                        let requestCount = 0;
                        for (let i = 0; i < courseData.length; i++) {
                            if (i == 0){
                                let newCourse = new Course();
                                // @ts-ignore
                                newCourse.courseID = courseData[i].corNumId;
                                allCoursesParsed.push(newCourse);
                            }
                            if (i > 0) {
                                if (courseData[i - 1].corNumId != courseData[i].corNumId) {
                                    let newCourse = new Course();
                                    // @ts-ignore
                                    newCourse.courseID = courseData[i].corNumId;
                                    allCoursesParsed.push(newCourse);
                                }
                            }
                        }

                        for (let i = 0; i < courseData.length; i++) {

                            let sessionId = sessionIdElement.getAttribute("value");
                            let encses = encsesElement.getAttribute("value");
                            const options3 = {
                                method: 'POST',
                                url: 'https://skyward.scps.k12.fl.us/scripts/wsisa.dll/WService=wsEAplus/httploader.p?file=sfgradebook001.w',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'User-Agent': 'insomnia/8.4.5'
                                },
                                form: {
                                    action: "viewGradeInfoDialog",
                                    ishttp: "true",
                                    fromHttp: "yes",
                                    stuId: courseData[i].stuId,
                                    entityId: courseData[i].entityId,
                                    corNumId: courseData[i].corNumId,
                                    gbId: courseData[i].gbId,
                                    bucket: courseData[i].bucket,
                                    sessionid: sessionId,
                                    encses: encses,
                                    dwd: parsed[0],
                                    wfaacl: parsed[2]
                                }
                            }

                             request(options3, function (error, response, body) {
                                if (error) throw new Error(error);
                                let currentCourse = new Course();
                                allCoursesParsed.forEach((course) => {
                                    if (course.courseID == options3.form.corNumId){
                                        currentCourse = course;
                                    }
                                });
                                console.log("Course ID: "+options3.form.corNumId);
                                let gradesPage = new JSDOM(body);
                                // @ts-ignore
                                let courseName = gradesPage.window.document.querySelector(".gb_heading").children[0].children[0].textContent;
                                // @ts-ignore
                                let teacher = gradesPage.window.document.querySelector(".gb_heading").children[0].children[2].textContent;

                                // @ts-ignore
                                currentCourse.courseName = courseName;
                                // @ts-ignore
                                currentCourse.teacher = teacher;




                                let quarter = gradesPage.window.document.querySelectorAll(".sf_gridTableWrap")[1].children[0].children[0].children[0].children[0].textContent;



                                let elems = null;
                                // @ts-ignore
                                try {
                                    elems = gradesPage.window.document.querySelectorAll("table > tbody")[2].children;
                                } catch (e) {
                                    console.warn(e);
                                    console.log(body);
                                }
                                if (elems) {

                                    let section = "Not Set";

                                    for (let x = 0; x < elems.length; x++) {
                                        let elem = elems[x];
                                        if (elem.classList.contains("sf_Section")) {
                                            if (elem.children[1].textContent !== null) {
                                                if (elem.children[1].textContent.startsWith("Assignments")) {
                                                    section = "assignment";
                                                }
                                                if (elem.children[1].textContent.startsWith("EXAM")) {
                                                    section = "test";
                                                }
                                            }
                                        } else {
                                            // @ts-ignore
                                            if (!elem.children[0].textContent.startsWith("There are no")) {
                                                let grade = new Grade();
                                                // @ts-ignore
                                                grade.date = elem.children[0].textContent;
                                                // @ts-ignore
                                                grade.name = elem.children[1].children[0].textContent;
                                                // @ts-ignore
                                                grade.points = elem.children[4].textContent;
                                                // @ts-ignore
                                                grade.points = grade.points.split(" out of ")[0] + "/" + grade.points.split(" out of ")[1]
                                                grade.missing = elem.children[5].children[0] !== undefined;
                                                if (elem.children[2].children[0]) {
                                                    // @ts-ignore
                                                    grade.comment = elem.children[2].children[0].getAttribute("data-info");
                                                } else {
                                                    grade.comment = "";
                                                }
                                                grade.type = section;

                                                if (quarter !== null){
                                                    if (quarter.startsWith("Q1")){
                                                        currentCourse.Q1.push(grade);
                                                    }
                                                    if (quarter.startsWith("Q2")){
                                                        currentCourse.Q2.push(grade);
                                                    }
                                                    if (quarter.startsWith("S1")){
                                                        currentCourse.S1.push(grade);
                                                    }
                                                    if (quarter.startsWith("Q3")){
                                                        currentCourse.Q3.push(grade);
                                                    }
                                                    if (quarter.startsWith("Q4")){
                                                        currentCourse.Q4.push(grade);
                                                    }
                                                    if (quarter.startsWith("S2")){
                                                        currentCourse.S2.push(grade);
                                                    }

                                                    for (let n = 0; n < allCoursesParsed.length; n++){
                                                        if (allCoursesParsed[n].courseID == currentCourse.courseID){
                                                            allCoursesParsed[n] = currentCourse;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (requestCount + 1 == courseData.length){
                                        // @ts-ignore
                                        clientObj.status = Status.Success;
                                        // @ts-ignore
                                        clientObj.courseGrades = allCoursesParsed;
                                        console.log("Done with "+clientID+"!");
                                        return Status.Success;
                                    }

                                }
                                requestCount++;
                            });

                        }
                    }


                });
            });



            

        });
        return promise;
    }

    public duplicate(): Login {
        return new SCPS();
    }
}