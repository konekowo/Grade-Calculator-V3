import {Quarter} from "./Quarter";
import {Dialog} from "./Dialog";
import {StatusQuery} from "./StatusQuery";
import {DialogModal} from "./DialogModal";
import {CalculatorManager} from "./Calculator/CalculatorManager";
import {CoursePage} from "./CoursePage";
import config from "../../config.json";
import * as uuid from "uuid";

export class GradePage{
    private dialog: DialogModal;

    private quarterAssignments: any[] = [];
    private data: any[] = [];
    private courseData: any = "";
    private weights: any = "";
    private coursePage: CoursePage;
    private schoolDistrictCode: string;

    public constructor(term: Quarter, courseID: string, schoolDistrictCode: string, coursePage: CoursePage) {
        this.data = StatusQuery.courseGrades;
        this.coursePage = coursePage;
        this.schoolDistrictCode = schoolDistrictCode
        this.data.forEach((course) => {
            if (course.courseID == courseID){
                this.courseData = course;
            }
        });

        for (let key in this.courseData){
            if (key == term.toString()){
                this.quarterAssignments = this.courseData[key];
            }
        }
        console.log(this.quarterAssignments);


        // @ts-ignore
        window["closeAndDestrowAssignmentsWindow" + courseID + term.toString()] = () => {
            this.dialog.DestroyWithAnim();
        }

        config.SchoolDistricts.forEach((district) => {
           if (district.code == this.schoolDistrictCode){
               this.weights = district.weights;
           }
        });

        let weightsOptionElems: string = "";
        for (let weightsKey in this.weights) {
            weightsOptionElems += "<option value='"+weightsKey+"'>"+weightsKey.toUpperCase() + " ("+ this.weights[weightsKey].weight + "% of total Grade)</option>"
        }



        this.dialog = new DialogModal("" +
            "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>"+term.toString()+" | "+this.courseData.courseName+"" +
            "<button class='assignmentPage closeButton' onclick='window.closeAndDestrowAssignmentsWindow"+courseID+term.toString()+"();'>X</button>" +
            "</h1>" +
            "<hr style='color: white; margin-left: -10px; margin-right: -10px;'>" +
            "<p class='text' style='margin-left: 10px;'>Course Name: "+this.courseData.courseName+"</p>" +
            "<h2 class='text header2 assignmentPage"+term.toString().toLowerCase()+courseID+"' style='float: right;  margin-right: 10px;'>Grade: </h2>" +
            "<p class='text' style='margin-left: 10px;' style='float: left;'>Teacher: "+this.courseData.teacher+"</p>" +
            "<p class='text' style='margin-left: 10px;'>Course ID: "+this.courseData.courseID+"</p>" +
            "<br>" +
            "<button class='button assignmentPageReset' onclick='window.resetAssignments"+courseID + term.toString()+"();' style='float: left; width: 150px; padding-left: 0; margin-left: 10px; margin-bottom: 20px;'>" +
            "   <img src='./reset.svg' alt='Reset Assignment' style='float: left; width: 25px;'> " +
            "   <p class='text' style='float: right; transform: translateY(-1px);'>Reset Assignments</p>" +
            "</button>" +
            "<button class='button assignmentPageAdd' onclick='window.addAssignment"+courseID + term.toString()+"();' style='float: right; width: 150px; padding-left: 0; margin-right: 10px; margin-bottom: 20px;'>" +
            "   <img src='./add.svg' alt='Add Assignment' style='float: left; width: 25px; margin-right: 7px;'> " +
            "   <p class='text' style='float: right; transform: translateY(-1px);'>Add Assignment</p>" +
            "</button>" +
            "<div class='assignmentPage body' style='width: 100%;'>" +
            "   <table style='color: white; width: 100%;' class='assignmentPage table'>" +
            "       <thead class='assignmentPage table head'>" +
            "           <tr>" +
            "               <th>Type</th>" +
            "               <th>Date</th>" +
            "               <th>Name</th>" +
            "               <th>Points</th>" +
            "               <th>Info</th>" +
            "               <th>Actions</th>" +
            "           </tr>" +
            "       </thead>" +
            "       <tbody class='assignmentPage table body "+term.toString().toLowerCase()+courseID+"'>" +
            "           " +
            "       </tbody>" +
            "   </table>" +
            "</div>");
        this.calculateFinalGrades(this.data, term, courseID, this.schoolDistrictCode);
        this.dialog.OpenDialog();
        // @ts-ignore
        window["resetAssignments" + courseID + term.toString()] = () => {
            for (let i = 0; i < StatusQuery.courseGrades.length; i++){
                if (StatusQuery.courseGrades[i].courseID == courseID){
                    StatusQuery.courseGrades[i][term.toString()] = JSON.parse(JSON.stringify(StatusQuery.ogCourseGrades[i][term.toString()]));

                }

            }
            this.dialog.DestroyWithAnim();
            coursePage.UpdateGrades(courseID, this.schoolDistrictCode, term);
            setTimeout(() => {
                new GradePage(term, courseID, this.schoolDistrictCode, coursePage);
            }, 500);

        }
        // @ts-ignore
        window["addAssignment" + courseID + term.toString()] = () => {
            let assignmentsElems = document.querySelector(".assignmentPage.table.body."+term.toString().toLowerCase()+courseID);
            if (assignmentsElems){
                let isAnyAssignmentInEditMode = false;
                for (let n = 0; n < assignmentsElems.children.length; n++) {
                    //@ts-ignore
                    if (assignmentsElems.children[n].children[0].colSpan == "6"){
                        isAnyAssignmentInEditMode = true;
                    }
                }
                if (!isAnyAssignmentInEditMode){
                    let firstWeight = "";
                    for (let weightsKey in this.weights) {
                        firstWeight = weightsKey;
                        break;
                    }
                    let date = new Date();
                    let day = "";
                    let month = "";
                    if (date.getDate() < 10){
                        day = "0" + date.getDate();
                    }
                    else {
                        day = date.getDate().toString();
                    }
                    if (date.getMonth() < 10){
                        month = "0" + (date.getMonth() + 1);
                    }
                    else {
                        month = (date.getMonth() + 1).toString();
                    }
                    let dateStr = month + "/" + day + "/" + (date.getFullYear() - 2000);
                    const newData = {
                        type: firstWeight,
                        date: dateStr,
                        points: "25/25",
                        latePolicyApplied: false,
                        name: "New Assignment"
                    }
                    let newQuarterAssignments = [];
                    newQuarterAssignments.push(newData);
                    this.quarterAssignments.forEach((quarterAssignment) => {
                        newQuarterAssignments.push(quarterAssignment);
                    });
                    this.quarterAssignments = newQuarterAssignments;
                    this.courseData[term.toString()] = this.quarterAssignments;
                    for (let y = 0; y < StatusQuery.courseGrades.length; y++){
                        if (StatusQuery.courseGrades[y].courseID == courseID){
                            StatusQuery.courseGrades[y] = this.courseData;
                        }
                    }
                    let assignmentsHTML = "";
                    assignmentsHTML = assignmentsElems.innerHTML;
                    assignmentsElems.innerHTML = "";

                    const assignmentID = this.createAssignment(newData, term, weightsOptionElems, courseID);
                    assignmentsElems.innerHTML += assignmentsHTML;

                    let assignment = document.querySelector(".assignmentPage.table.body"+term.toString().toLowerCase()+courseID+".assignment.id"+assignmentID);
                    if (assignment){
                        // @ts-ignore
                        let editButton: HTMLButtonElement = assignment.querySelector(".button.assignmentEdit");
                        if (editButton){
                            editButton.click();
                        }
                    }
                }
                else {
                    let errorDialog =
                        new DialogModal("" +
                            "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>Error" +
                            "</h1>" +
                            "<hr style='margin-left: -10px; margin-right: -10px;'>" +
                            "<p class='text' style='text-align: center;'>An assignment is in edit mode. Please either save or cancel your edits to that assignment first before creating a new one.</p>" +
                            "<button class='button' style='color: white; margin: auto; width: 100px;'>Ok</button>"
                        );
                    errorDialog.GetHtmlDiv().style.paddingLeft = "10px";
                    errorDialog.GetHtmlDiv().style.paddingRight = "10px";
                    errorDialog.OpenDialog();
                    errorDialog.GetHtmlDiv().getElementsByTagName("button")[0].addEventListener("click", () => {
                       errorDialog.DestroyWithAnim();
                    });
                }

            }
        }


        for (let i = 0; i < this.quarterAssignments.length; i++) {
            this.createAssignment(this.quarterAssignments[i], term, weightsOptionElems, courseID);
        }
        this.dialog.GetHtmlDiv().style.paddingLeft = "10px";
        this.dialog.GetHtmlDiv().style.paddingRight = "10px";
        this.dialog.GetHtmlDiv().style.maxHeight = "90vh";
        this.dialog.GetHtmlDiv().style.overflowY = "auto";



    }

    private calculateFinalGrades(data: any[], term: Quarter, courseID: string, schoolDistrictCode: string){
        // @ts-ignore
        document.querySelector(".text.header2.assignmentPage"+term.toString().toLowerCase()+courseID).textContent =
            "Total Grade: "+
            // @ts-ignore
            Math.round(CalculatorManager[this.schoolDistrictCode].calculateQuarterGrade(data, term, courseID)*10)/10
            + "%";
    }

    private replaceAssignment(assignment: Element, term: Quarter, courseID: string, assignmentID: string, editData:any){
        assignment.innerHTML = "" +
            this.getAssignmentHTML(term, courseID, assignmentID, editData);
    }
    private addAssignment(assignment: Element, term: Quarter, courseID: string, assignmentID: string, editData:any){
        assignment.innerHTML +=
            this.getAssignmentHTML(term, courseID, assignmentID, editData);
    }

    private getAssignmentHTML(term: Quarter, courseID: string, assignmentID: string, editData:any) {
        let commentElem = "";
        if (editData.comment != ""){
            // @ts-ignore
            window["comment"+term.toString().toLowerCase()+courseID + assignmentID] = () => {
                let commentWindow = new DialogModal("" +
                    "<h2 class='text header2' style='margin-left: 10px; margin-top: 5px; margin-bottom: 5px;'>Comment</h2>" +
                    "<hr style='color: white;'>" +
                    "<p class='text' style='text-align: center'>"+editData.comment+"</p>" +
                    "<button class='button' style='color: white; position: relative; left: 50%; transform: translateX(-50%); padding-left: 25px; padding-right: 25px;' onclick='window[\"closeAndDestroyCommentWindow"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'>Done</button>"
                );
                // @ts-ignore
                window["closeAndDestroyCommentWindow"+term.toString().toLowerCase()+courseID + assignmentID] = () => {
                    commentWindow.DestroyWithAnim();
                }
                commentWindow.OpenDialog();


            }
            commentElem = "<button class='button' onclick='window[\"comment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./comment.svg' alt='View Comments'></button>"
        }
        return "<tr class='assignmentPage table body"+term.toString().toLowerCase()+courseID+" assignment id"+assignmentID+"'>" +
        "   <td>"+editData.type.toUpperCase()+"</td>" +
        "   <td>"+editData.date+"</td>" +
        "   <td>"+editData.name+"</td>" +
        "   <td>"+editData.points+"</td>" +
        "   <td>"+commentElem+"</td>" +
        "   <td>" +
        "       <button class='button assignmentEdit' style='float: left;' onclick='window[\"editAssignment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./edit.svg' alt='Edit Assignment'></button>" +
        "       <button class='button assignmentDelete' style='float: right;' onclick='window[\"deleteAssignment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./delete.svg' alt='Delete Assignment'></button>" +
        "   </td>" +
        "</tr>";
    }

    private getEditAssignmentHTML(weightsOptionElems: string, term: Quarter, courseID: string, assignmentID: string){
        let subDate = new Date();
        let month: string | number = subDate.getMonth() +1;
        if (month < 10){
            month = "0" + month;
        }
        let day: string | number = subDate.getDate();
        if (day < 10){
            day = "0" + day;
        }
        return "" +
        "<td colspan='6'>" +
        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Name:</span>" +
        "   <input type='text' class='assignmentPage table editAssignmentName' placeholder='Assignment Name' style='position: unset; transform: unset; float: left;'> <br><br>" +
        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Points:</span>" +
        "   <input type='number' class='assignmentPage table editAssignmentGradeValue' placeholder='Points' style='position: unset; transform: unset; width: 100px; float: left;'>" +
        "   <span class='text' style='font-size: 25px;float: left;'>/</span>" +
        "   <input type='number' class='assignmentPage table editAssignmentGradeMax' placeholder='Max Points' style='position: unset; transform: unset; width: 100px; float: left;'>" +
        "   <br><br>" +
        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Type:</span>" +
        "   <select style='position: unset; transform: unset; float: left;' class='assignmentPage table editAssignmentType'>" +
        "       "+weightsOptionElems+
        "   </select> <br><br>" +
        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Due Date:</span>" +
        "   <input type='date' class='assignmentPage table editAssignmentDate' placeholder='Assignment Due Date' style='position: unset; transform: unset; color-scheme: dark; float: left;'> <br><br>" +
        "   <hr>" +
        "   <span class='text'>Late policy (this will only apply if the assignment's due date is before the current date:</span><br><br>" +
        "   <label class='text' for='assignmentPageTableEditAssignmentDoLateGrade"+term.toString().toLowerCase()+courseID + assignmentID+"' style='font-size: 15px; float: left;'>Apply Late Policy (make sure the assignments due date is before today)?</label>" +
        "   <input type='checkbox' id='assignmentPageTableEditAssignmentDoLateGrade"+term.toString().toLowerCase()+courseID + assignmentID+"' class='assignmentPage table editAssignmentDoLateGrade' style='position: unset; width: 25px; float: left; transform: translateY(-10px);'> <br> <br>" +
        "   <span class='text' style='font-size: 15px; float: left;'>% of grade taken off:</span>" +
        "   <input type='number' class='assignmentPage table editAssignmentLateGradePercent' placeholder='% taken off' style='position: unset; transform: unset; width: 100px; float: left;'> <br> <br>" +
        "   <span class='text' style='font-size: 15px; float: left;'>% should be taken off per:</span>" +
        "   <select style='position: unset; transform: unset; float: left;' class='assignmentPage table editAssignmentLateGradeFrequency'>" +
        "       <option>Day</option>" +
        "       <option>Week</option>" +
        "       <option>Month</option>" +
        "   </select> <br><br>" +
        "   <label class='text' for='assignmentPageTableEditAssignmentLateGradeIncludeWeekends"+term.toString().toLowerCase()+courseID + assignmentID+"' style='font-size: 15px; float: left;'>Include Weekends when taking off late grade %?</label>" +
        "   <input type='checkbox' id='assignmentPageTableEditAssignmentLateGradeIncludeWeekends"+term.toString().toLowerCase()+courseID + assignmentID+"' class='assignmentPage table editAssignmentLateGradeIncludeWeekends' style='position: unset; width: 25px; float: left; transform: translateY(-10px);' checked> <br> <br>" +
        "   <label class='text' for='assignmentPageTableEditAssignmentLateGradeStartAfterDueDate"+term.toString().toLowerCase()+courseID + assignmentID+"' style='font-size: 15px; float: left;'>Start taking off % from the due date (enable this if assignment is not due at midnight or is due before the current time)?</label>" +
        "   <input type='checkbox' id='assignmentPageTableEditAssignmentLateGradeStartAfterDueDate"+term.toString().toLowerCase()+courseID + assignmentID+"' class='assignmentPage table editAssignmentLateGradeStartAfterDueDate' style='position: unset; width: 25px; float: left; transform: translateY(-10px);'> <br> <br>" +
        "   <span class='text' style='font-size: 15px; float: left;'>Submission Date:</span>" +
        "   <input type='date' class='assignmentPage table editAssignmentSubDate' placeholder='Submission Date' style='position: unset; transform: unset; color-scheme: dark; float: left;' value='"+subDate.getFullYear() +"-"+ month + "-" + day +"'> <br><br>" +
        "   <span class='text' id='latePercentTakenOff'>Percent taken off: </span> <br> <br>" +
        "   <span class='text' id='pointsAfterLatePolicy'>Points after late policy is applied: </span> <br> <br>" +
        "   <hr>" +
        "   <h2 class='text header2' id='assignmentPageTableEditAssignmentPredictedGrade'>Predicted Total Grade (before Late Grade Policy is applied):</h2>" +
        "   <h2 class='text header2' id='assignmentPageTableEditAssignmentPredictedGradeLate'>Predicted Total Grade:</h2>" +
        "   <hr>" +
        "   <button class='button editAssignmentApply' style='float: right; width: 150px; padding-left: 0; margin-bottom: 20px;'>" +
        "       <img src='./apply.svg' alt='Add Assignment' style='float: left; width: 25px; margin-right: 7px;'> " +
        "       <p class='text' style='float: right; transform: translateY(-1px);'>Apply changes</p>" +
        "   </button>" +
        "   <button class='button editAssignmentCancel' style='float: left; width: 150px; padding-left: 0; margin-bottom: 20px;'>" +
        "       <img src='./cancel.svg' alt='Add Assignment' style='float: left; width: 25px; margin-right: 7px;'> " +
        "       <p class='text' style='float: right; transform: translateY(-1px);'>Cancel changes</p>" +
        "   </button>" +
        "</td>";
    }

    private createAssignment(quarterAssignment: any, term: Quarter, weightsOptionElems: string, courseID: string) {
        const assignmentID = uuid.v4();
        quarterAssignment["assignmentID"] = assignmentID;
        // @ts-ignore
        window["deleteAssignment" +term.toString().toLowerCase()+courseID + assignmentID] = () => {
            let assignment = document.querySelector('.assignmentPage.table.body'+term.toString().toLowerCase()+courseID+'.assignment.id'+assignmentID+'');
            // @ts-ignore
            assignment.remove();
            const newQuarterAssignments = this.quarterAssignments;
            for (let j = 0; j < this.quarterAssignments.length; j++) {
                // @ts-ignore
                let assignmentIDelem = assignment.classList[4].split("id")[1];
                if (this.quarterAssignments[j].assignmentID == assignmentIDelem){
                    console.log("Deleting", this.quarterAssignments[j]);
                    this.quarterAssignments.splice(j, 1);
                }
            }
            const newCourseData = this.courseData;
            newCourseData[term.toString()] = newQuarterAssignments;
            for (let y = 0; y < StatusQuery.courseGrades.length; y++){
                if (StatusQuery.courseGrades[y].courseID == courseID){
                    StatusQuery.courseGrades[y] = newCourseData;
                }
            }
            this.quarterAssignments = newQuarterAssignments;
            this.courseData = newCourseData;
            this.data = StatusQuery.courseGrades;
            console.log(this.quarterAssignments);
            this.calculateFinalGrades(StatusQuery.courseGrades, term, courseID, this.schoolDistrictCode);
            this.coursePage.UpdateGrades(courseID, this.schoolDistrictCode, term);
        }

        // @ts-ignore
        window["editAssignment" +term.toString().toLowerCase()+courseID + assignmentID] = () => {
            console.log(quarterAssignment);
            let assignment = document.querySelector('.assignmentPage.table.body'+term.toString().toLowerCase()+courseID+'.assignment.id'+assignmentID+'');
            if (assignment){
                assignment.innerHTML = "" +
                    this.getEditAssignmentHTML(weightsOptionElems, term, courseID, assignmentID);

                // @ts-ignore
                assignment.querySelector(".assignmentPage.table.editAssignmentName").value = quarterAssignment.name;
                // @ts-ignore
                assignment.querySelector(".assignmentPage.table.editAssignmentGradeValue").value = quarterAssignment.points.split("/")[0];
                // @ts-ignore
                assignment.querySelector(".assignmentPage.table.editAssignmentGradeMax").value = quarterAssignment.points.split("/")[1];

                // @ts-ignore
                assignment.querySelector(".assignmentPage.table.editAssignmentType").value = quarterAssignment.type;


                let year = "20" + quarterAssignment.date.split("/")[2];
                let month = quarterAssignment.date.split("/")[0];
                let day = quarterAssignment.date.split("/")[1];
                let assignmentDueDate = year + "-" + month + "-" + day;

                // @ts-ignore
                assignment.querySelector(".assignmentPage.table.editAssignmentDate").value = assignmentDueDate;

                if (quarterAssignment.latePolicyApplied){
                    console.log(quarterAssignment.latePolicyApplied);
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentDoLateGrade").checked =
                        quarterAssignment.latePolicyApplied.doLateGrade;
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentLateGradePercent").value =
                        quarterAssignment.latePolicyApplied.lateGradePercent;
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeFrequency").selectedIndex =
                        quarterAssignment.latePolicyApplied.lateGradeFrequency;
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeIncludeWeekends").checked =
                        quarterAssignment.latePolicyApplied.includeWeekends;
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeStartAfterDueDate").checked =
                        quarterAssignment.latePolicyApplied.startOnDueDate;

                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentGradeValue").value =
                        quarterAssignment.latePolicyApplied.originalPoints.split("/")[0];
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentGradeMax").value =
                        quarterAssignment.latePolicyApplied.originalPoints.split("/")[1];

                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentSubDate").value =
                        quarterAssignment.latePolicyApplied.submissionDate;
                }

                let inputs = document.getElementsByTagName("input");
                let selects = document.getElementsByTagName("select");


                const calculatePredictedScore = (save: boolean) => {
                    // @ts-ignore
                    let name = assignment.querySelector(".assignmentPage.table.editAssignmentName").value;
                    // @ts-ignore
                    let gradeValue = assignment.querySelector(".assignmentPage.table.editAssignmentGradeValue").value;
                    // @ts-ignore
                    let gradeMax = assignment.querySelector(".assignmentPage.table.editAssignmentGradeMax").value;
                    // @ts-ignore
                    let type = assignment.querySelector(".assignmentPage.table.editAssignmentType").value;
                    // @ts-ignore
                    let date = assignment.querySelector(".assignmentPage.table.editAssignmentDate").value;
                    // @ts-ignore
                    let doLateGrade = assignment.querySelector(".assignmentPage.table.editAssignmentDoLateGrade").checked;

                    let points = gradeValue + "/" + gradeMax;

                    let year = date.split('-')[0].split('20')[1];
                    let month = date.split('-')[1];
                    let day = date.split('-')[2];

                    date = month + "/" + day + "/" + year;

                    let editData: any = {
                        type: type,
                        name: name,
                        date: date,
                        points: points,
                        assignmentID: assignmentID,
                        latePolicyApplied: false
                    }



                    // @ts-ignore
                    let assignmentIDelem = assignment.classList[4].split("id")[1];
                    let newQuarterAssignments = JSON.parse(JSON.stringify(this.quarterAssignments));
                    for (let j = 0; j < newQuarterAssignments.length; j++) {
                        if (newQuarterAssignments[j].assignmentID == assignmentIDelem){
                            newQuarterAssignments[j] = editData;
                        }
                    }

                    // @ts-ignore
                    assignment.querySelector("#assignmentPageTableEditAssignmentPredictedGrade").textContent =
                        // @ts-ignore
                        "Predicted Total Grade (before Late Grade Policy is applied): "+ Math.round(CalculatorManager[this.schoolDistrictCode].calculate(newQuarterAssignments)*10)/10
                        + "%";

                    // @ts-ignore
                    let latePercentTakenOff = assignment.querySelector("#latePercentTakenOff");
                    // @ts-ignore
                    let predictedLatePoints = assignment.querySelector("#pointsAfterLatePolicy");
                    if (!doLateGrade) {
                        // @ts-ignore
                        latePercentTakenOff.textContent = "Percent taken off: ";
                        // @ts-ignore
                        predictedLatePoints.textContent = "Points after late policy is applied: ";
                    }

                    if (doLateGrade){
                        // @ts-ignore
                        let lateGradePercent = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradePercent").value;
                        // @ts-ignore
                        let lateGradeFrequency = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeFrequency").selectedIndex;
                        // @ts-ignore
                        let includeWeekends = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeIncludeWeekends").checked;
                        // @ts-ignore
                        let startOnDueDate = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeStartAfterDueDate").checked;
                        // @ts-ignore
                        let subDate = assignment.querySelector(".assignmentPage.table.editAssignmentSubDate").value;


                        let currentDate = new Date(subDate);
                        let dueDate = new Date(month + '/' + day + '/' + + '20' + year);
                        // @ts-ignore
                        let dayDifference = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));

                        function monthDiff(d1: Date, d2: Date) {
                            let months;
                            months = (d2.getFullYear() - d1.getFullYear()) * 12;
                            months -= d1.getMonth();
                            months += d2.getMonth();
                            return months <= 0 ? 0 : months;
                        }

                        function calculateWeekendDays(fromDate: Date, toDate: Date){
                            let weekendDayCount = 0;

                            while(fromDate < toDate){
                                fromDate.setDate(fromDate.getDate() + 1);
                                if(fromDate.getDay() === 0 || fromDate.getDay() == 6){
                                    ++weekendDayCount ;
                                }
                            }

                            return weekendDayCount ;
                        }

                        let monthDifference = monthDiff(currentDate, dueDate);

                        let lateMultiplier = 0;
                        if (startOnDueDate && dayDifference >= 0){
                            lateMultiplier = 1;
                        }

                        if (lateGradeFrequency == 0){
                            lateMultiplier += dayDifference;
                            if (!includeWeekends){
                                lateMultiplier -= calculateWeekendDays(dueDate, currentDate);
                            }
                        }
                        if (lateGradeFrequency == 1){
                            if (dayDifference % 7 == 0){
                                lateMultiplier += (dayDifference/7);
                            }
                        }
                        if (lateGradeFrequency == 2){
                            lateMultiplier += monthDifference;
                        }
                        if (lateMultiplier >= 0){
                            // @ts-ignore
                            latePercentTakenOff.textContent = "Percent taken off: "+ (parseFloat(lateGradePercent) * lateMultiplier) + "%";
                            if ((parseFloat(lateGradePercent) * lateMultiplier) > 100){
                                // @ts-ignore
                                latePercentTakenOff.textContent = "Percent taken off: 100%";
                            }


                            let latePoints = parseFloat(points.split("/")[0]) - (parseFloat(points.split("/")[0]) * ((parseFloat(lateGradePercent) * lateMultiplier)/100));
                            if (latePoints < 0){
                                latePoints = 0;
                            }
                            let latePointsFinal = latePoints + "/" + points.split("/")[1];

                            // @ts-ignore
                            predictedLatePoints.textContent = "Points after late policy is applied: "+ latePointsFinal;

                            editData = {
                                type: type,
                                name: name,
                                date: date,
                                points: latePointsFinal,
                                assignmentID: assignmentID,
                                latePolicyApplied: {
                                    doLateGrade: doLateGrade,
                                    lateGradePercent: lateGradePercent,
                                    lateGradeFrequency: lateGradeFrequency,
                                    startOnDueDate: startOnDueDate,
                                    includeWeekends: includeWeekends,
                                    originalPoints: points,
                                    submissionDate: subDate
                                }
                            }
                            for (let j = 0; j < newQuarterAssignments.length; j++) {
                                if (newQuarterAssignments[j].assignmentID == assignmentIDelem){
                                    newQuarterAssignments[j] = editData;
                                }
                            }


                        }




                    }

                    // @ts-ignore
                    assignment.querySelector("#assignmentPageTableEditAssignmentPredictedGradeLate").textContent =
                        // @ts-ignore
                        "Predicted Total Grade: "+ Math.round(CalculatorManager[this.schoolDistrictCode].calculate(newQuarterAssignments)*10)/10
                        + "%";

                    if (save){
                        for (let j = 0; j < this.quarterAssignments.length; j++) {
                            if (this.quarterAssignments[j].assignmentID == assignmentIDelem){
                                this.quarterAssignments[j] = editData;
                            }
                        }
                        quarterAssignment = editData;
                        this.courseData[term.toString()] = this.quarterAssignments;
                        for (let y = 0; y < StatusQuery.courseGrades.length; y++){
                            if (StatusQuery.courseGrades[y].courseID == courseID){
                                StatusQuery.courseGrades[y] = this.courseData;
                            }
                        }
                        this.data = StatusQuery.courseGrades;
                        // @ts-ignore
                        this.replaceAssignment(assignment, term, courseID, assignmentID, editData);
                        this.calculateFinalGrades(this.data, term, courseID, this.schoolDistrictCode);
                        this.coursePage.UpdateGrades(courseID, this.schoolDistrictCode, term);
                    }

                }
                for (let j = 0; j < inputs.length; j++) {
                    inputs[j].addEventListener("input", () => {
                        calculatePredictedScore(false);
                    });
                }

                for (let j = 0; j < selects.length; j++) {
                    selects[j].addEventListener("change", () => {
                        calculatePredictedScore(false);
                    });
                }

                calculatePredictedScore(false);
                // @ts-ignore
                assignment.querySelector(".button.editAssignmentApply").addEventListener("click", () => {
                    calculatePredictedScore(true);
                });
                // @ts-ignore
                assignment.querySelector(".button.editAssignmentCancel").addEventListener("click", () => {
                    // @ts-ignore
                    this.replaceAssignment(assignment, term, courseID, assignmentID, quarterAssignment);
                });
            }

        }

        let tbody = document.querySelector(".assignmentPage.table.body."+term.toString().toLowerCase()+courseID);
        if (tbody){
            this.addAssignment(tbody, term, courseID, assignmentID, quarterAssignment);
        }

        return assignmentID;
    }

}