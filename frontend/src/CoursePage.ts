import {StatusQuery} from "./StatusQuery";
import {CalculatorManager} from "./Calculator/CalculatorManager";
import {Quarter} from "./Quarter";
import {GradePage} from "./GradePage";
import gpa from "./gpa.json";

export class CoursePage {
    public constructor(schoolDistrictCode: string) {
        const page = document.createElement("div");
        // @ts-ignore
        window["resetCourses"] = () => {
            StatusQuery.courseGrades = JSON.parse(JSON.stringify(StatusQuery.ogCourseGrades));
            this.UpdateAllGrades(schoolDistrictCode);
        }
        page.innerHTML = "" +
            "<div class='gradespage tableContainer'>" +
            "<button class='button assignmentPageReset' onclick='window.resetCourses();' style=' width: 165px; padding-left: 0; margin: auto; margin-bottom: 15px; margin-top: 5px;'>" +
            "   <img src='./reset.svg' alt='Reset Assignment' style='float: left; width: 25px;'> " +
            "   <p class='text' style='float: right; transform: translateY(-1px);'>Reset All Assignments</p>" +
            "</button>" +
            "   <table class ='gradespage table' style='min-width: 75vw;'>" +
            "      <thead>" +
            "        <tr>" +
            "          <th>Course</th>" +
            "          <th class='gradespage head quarter q1'>Q1</th>" +
            "          <th class='gradespage head quarter q2'>Q2</th>" +
            "          <th class='gradespage head quarter s1'>S1</th>" +
            "          <th class='gradespage head quarter q3'>Q3</th>" +
            "          <th class='gradespage head quarter q4'>Q4</th>" +
            "          <th class='gradespage head quarter s2'>S2</th>" +
            "        </tr>" +
            "      </thead>" +
            "      <tbody class='gradespage table body'>" +
            "      </tbody>" +
            "   </table>" +
            "</div>" +
            "<table>" +
            "   <thead>" +
            "       <th>GPA Type</th>" +
            "       <th>GPA (Estimated, may not be accurate)</th>" +
            "       <th>Earned Credits</th>" +
            "   </thead>" +
            "   <tbody>" +
            "       <tr>" +
            "           <td>Unweighted</td>" +
            "           <td class='gpaTable gpa unweightedGPA'></td>" +
            "           <td class='gpaTable earnedCredits unweighted'></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td>Weighted</td>" +
            "           <td class='gpaTable gpa weightedGPA'></td>" +
            "           <td class='gpaTable earnedCredits weighted'></td>" +
            "       </tr>" +
            "   </tbody>" +
            "</table>"
        document.body.appendChild(page);
        page.style.color = "white";
        for (let i = 0; i < StatusQuery.courseGrades.length; i++){
            // @ts-ignore
            document.querySelector(".gradespage.table.body").innerHTML += "" +
            "<tr class='gradespage table course"+StatusQuery.courseGrades[i].courseID+"'>" +
                "<td class='gradespage table courseName'>"+ StatusQuery.courseGrades[i].courseName +" <br>" +
                "<span>Credits per semester:</span> <input type='number' class='courseCredit' placeholder='Credits per semester' value='0.5' style='width: 50px; position: unset; transform: unset; left: unset;'></td>" +
                    "<td class='gradespage table quarter q1'>"+
                        // @ts-ignore
                        Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q1, StatusQuery.courseGrades[i].courseID))
                    +
                    "</td>" +
                    "<td class='gradespage table quarter q2'>"+
                    // @ts-ignore
                    Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q2, StatusQuery.courseGrades[i].courseID))
                    +
                    "</td>" +
                    "<td class='gradespage table quarter s1'>"+
                    this.CalculateSemester(Quarter.S1, StatusQuery.courseGrades, StatusQuery.courseGrades[i].courseID, schoolDistrictCode)
                    +
                    "</td>" +
                    "<td class='gradespage table quarter q3'>"+
                    // @ts-ignore
                    Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q3, StatusQuery.courseGrades[i].courseID))
                    +
                    "</td>" +
                    "<td class='gradespage table quarter q4'>"+
                    // @ts-ignore
                    Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q4, StatusQuery.courseGrades[i].courseID))
                    +
                    "</td>" +
                    "<td class='gradespage table quarter s2'>"+
                    // @ts-ignore
                    this.CalculateSemester(Quarter.S2, StatusQuery.courseGrades, StatusQuery.courseGrades[i].courseID, schoolDistrictCode)
                    +
                    "</td>" +
                "</tr>";

        }
        // @ts-ignore
        let split = document.querySelector(".gradespage.table.body").innerHTML.split("NaN");
        let nanFree = "";
        split.forEach((str) => {
            if (str != "NaN"){
                nanFree += str;
            }
        });
        // @ts-ignore
        document.querySelector(".gradespage.table.body").innerHTML = nanFree;

        this.UpdateGPA(schoolDistrictCode);

        document.querySelectorAll(".gradespage.table.quarter").forEach((elem) => {
            elem.addEventListener("click", () => {
                if (elem.textContent != "" && elem.classList[3] != "s1" && elem.classList[3] != "s2"){
                    let Term: Quarter;
                    let termUnparsed = elem.classList[3];
                    switch (termUnparsed){
                        case "q1":
                            Term = Quarter.Q1;
                            break;
                        case "q2":
                            Term = Quarter.Q2;
                            break;
                        case "s1":
                            Term = Quarter.S1;
                            break;
                        case "q3":
                            Term = Quarter.Q3;
                            break;
                        case "q4":
                            Term = Quarter.Q4;
                            break;
                        case "s2":
                            Term = Quarter.S2;
                            break;
                    }
                    // @ts-ignore
                    let courseID = elem.parentElement.classList[2].split("course")[1];
                    // @ts-ignore
                    if (Term){
                        new GradePage(Term, courseID, schoolDistrictCode, this);
                    }
                    else {
                        throw new Error("Something wrong happened when parsing the TERM.")
                    }

                }
            });
        })
    }

    public UpdateGrades(courseID:string, schoolDistrictCode: string, term: Quarter) {
        let elem = document.querySelector(".gradespage.table.course"+courseID+" > .gradespage.table.quarter."+term.toString().toLowerCase());
        if (elem){
            // @ts-ignore
            elem.textContent = Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, term, courseID));
            if (term == Quarter.Q1 || term == Quarter.Q2){
                let semesterElem = document.querySelector(".gradespage.table.course"+courseID+" > .gradespage.table.quarter."+Quarter.S1.toString().toLowerCase());
                if (semesterElem){
                    // @ts-ignore
                    semesterElem.textContent = this.CalculateSemester(Quarter.S1, StatusQuery.courseGrades, courseID, schoolDistrictCode);
                }
            }
            if (term == Quarter.Q3 || term == Quarter.Q4){
                let semesterElem = document.querySelector(".gradespage.table.course"+courseID+" > .gradespage.table.quarter."+Quarter.S2.toString().toLowerCase());
                if (semesterElem){
                    // @ts-ignore
                    semesterElem.textContent = this.CalculateSemester(Quarter.S2, StatusQuery.courseGrades, courseID, schoolDistrictCode);
                }
            }
        }
        else{
            throw new Error("Table Element does not exist?!?");
        }
        this.UpdateGPA(schoolDistrictCode);
    }

    public UpdateGPA(schoolDistrictCode: string) {
        class CourseCredits {
            public credits: number;
            public courseID: string;
            public constructor(credits: number, courseID:string) {
                this.credits = credits;
                this.courseID = courseID;
            }

        }
        let courseCredits: CourseCredits[] = [];
        let courseCreditElems = document.querySelectorAll(".courseCredit");
        courseCreditElems.forEach((courseCreditElem) => {
            // @ts-ignore
            courseCredits.push(new CourseCredits(parseFloat(courseCreditElem.value), courseCreditElem.parentElement.parentElement.classList[2].split("course")[1]));
        });

        let totalEarnedCredits = 0;
        let unweightedGPAS: number[] = [];
        courseCredits.forEach((courseCredit) => {
            let gradeS1 = this.CalculateSemester(Quarter.S1, StatusQuery.courseGrades, courseCredit.courseID, schoolDistrictCode);
            if (gradeS1 > 59 && !isNaN(gradeS1)){
                totalEarnedCredits += courseCredit.credits;
            }
            let gradeS2 = this.CalculateSemester(Quarter.S2, StatusQuery.courseGrades, courseCredit.courseID, schoolDistrictCode);
            if (gradeS2 > 59 && !isNaN(gradeS2)){
                totalEarnedCredits += courseCredit.credits;
            }
            let final = this.CalculateFinal(StatusQuery.courseGrades, courseCredit.courseID, schoolDistrictCode);
            let unweightedGPA = 0;
            for (let i = gpa.unweighted.length - 1; i > -1; i--) {
                if (final > gpa.unweighted[i][0]){
                    unweightedGPA = gpa.unweighted[i][1];
                }
            }
            unweightedGPAS.push(unweightedGPA);

        });
        let unweightedGPA = 0;
        unweightedGPAS.forEach((unweightedgpa) => {
            unweightedGPA += unweightedgpa;
        })
        unweightedGPA /= unweightedGPAS.length;
        unweightedGPA = Math.round(unweightedGPA*1000)/1000


        // @ts-ignore
        document.querySelector(".gpaTable.earnedCredits.weighted").textContent = totalEarnedCredits;
        // @ts-ignore
        document.querySelector(".gpaTable.earnedCredits.unweighted").textContent = totalEarnedCredits;
        // @ts-ignore
        document.querySelector(".gpaTable.gpa.unweightedGPA").textContent = unweightedGPA;



    }

    private CalculateFinal(data: any[], courseID: string, schoolDistrictCode: string){
        let s1 = this.CalculateSemester(Quarter.S1, data, courseID, schoolDistrictCode);
        let s2 = this.CalculateSemester(Quarter.S2, data, courseID, schoolDistrictCode);
        if (isNaN(s1) && isNaN(s2)){
            return NaN;
        }
        if (isNaN(s1)){
            return s2;
        }
        if (isNaN(s2)){
            return s1;
        }
        return Math.round((s1 + s2)/2);
    }

    public UpdateAllGrades(schoolDistrictCode: string) {
        StatusQuery.courseGrades.forEach((course) => {
            for (let quarter in Quarter) {
                // @ts-ignore
                let elem = document.querySelector(".gradespage.table.course"+course.courseID+" > .gradespage.table.quarter."+Quarter[quarter].toString().toLowerCase());
                if (elem){
                    // @ts-ignore
                    if (Quarter[quarter] != Quarter.S1 || Quarter[quarter] != Quarter.S2){
                        // @ts-ignore
                        elem.textContent = Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter[quarter], course.courseID));
                    }
                    else {
                        // @ts-ignore
                        elem.textContent = this.CalculateSemester(Quarter[quarter], StatusQuery.courseGrades, course.courseID, schoolDistrictCode);
                    }

                }
                else{
                    throw new Error("Table Element does not exist?!?");
                }
            }

        });

        let elems = document.querySelectorAll(".gradespage.table.body > tr > td");
        elems.forEach((elem) => {
           if (elem.textContent == "NaN"){
               elem.textContent = "";
           }
        });

        this.UpdateGPA(schoolDistrictCode);

    }

    private CalculateSemester(semester: Quarter, data: any[], courseID: string, schoolDistrictCode: string){
        switch (semester){
            case Quarter.Q1:
                throw new Error("Quarters are NOT supposed to be used in this function!");
            case Quarter.Q2:
                throw new Error("Quarters are NOT supposed to be used in this function!");
            case Quarter.Q3:
                throw new Error("Quarters are NOT supposed to be used in this function!");
            case Quarter.Q4:
                throw new Error("Quarters are NOT supposed to be used in this function!");
        }

        if (semester == Quarter.S1){
            // @ts-ignore
            let q1 = CalculatorManager[schoolDistrictCode].calculateQuarterGrade(data, Quarter.Q1, courseID);
            // @ts-ignore
            let q2 = CalculatorManager[schoolDistrictCode].calculateQuarterGrade(data, Quarter.Q2, courseID);
            if (isNaN(q1) && isNaN(q2)){
                return NaN
            }
            if (isNaN(q1)){
                return Math.round(q2);
            }
            if (isNaN(q2)){
                return Math.round(q1);
            }
            return Math.round((q1+q2)/2);
        }

        if (semester == Quarter.S2){
            // @ts-ignore
            let q3 = CalculatorManager[schoolDistrictCode].calculateQuarterGrade(data, Quarter.Q3, courseID);
            // @ts-ignore
            let q4 = CalculatorManager[schoolDistrictCode].calculateQuarterGrade(data, Quarter.Q4, courseID);
            if (isNaN(q3) && isNaN(q4)){
                return NaN
            }
            if (isNaN(q3)){
                return Math.round(q4);
            }
            if (isNaN(q4)){
                return Math.round(q3);
            }
            return Math.round((q3+q4)/2);
        }

        return NaN;

    }


}