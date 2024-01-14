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
    public constructor(term: Quarter, courseID: string, schoolDistrictCode: string, coursePage: CoursePage) {
        let data = StatusQuery.courseGrades;
        let courseData: any;
        data.forEach((course) => {
            if (course.courseID == courseID){
                courseData = course;
            }
        });
        // @ts-ignore
        let quarterAssignments: any[] = "";

        for (let key in courseData){
            if (key == term.toString()){
                quarterAssignments = courseData[key];
            }
        }
        console.log(quarterAssignments);


        // @ts-ignore
        window["closeAndDestrowAssignmentsWindow" + courseID + term.toString()] = () => {
            this.dialog.DestroyWithAnim();
        }


        let weights: any;
        config.SchoolDistricts.forEach((district) => {
           if (district.code == schoolDistrictCode){
               weights = district.weights;
           }
        });

        let weightsOptionElems: string = "";
        for (let weightsKey in weights) {
            weightsOptionElems += "<option>"+weightsKey.toUpperCase() + " ("+ weights[weightsKey].weight + "% of total Grade)</option>"
        }



        this.dialog = new DialogModal("" +
            "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>"+term.toString()+" | "+courseData.courseName+"" +
            "<button class='assignmentPage closeButton' onclick='window.closeAndDestrowAssignmentsWindow"+courseID+term.toString()+"();'>X</button>" +
            "</h1>" +
            "<hr style='color: white; margin-left: -10px; margin-right: -10px;'>" +
            "<p class='text' style='margin-left: 10px;'>Course Name: "+courseData.courseName+"</p>" +
            "<h2 class='text header2 assignmentPage"+term.toString().toLowerCase()+courseID+"' style='float: right;  margin-right: 10px;'>Grade: </h2>" +
            "<p class='text' style='margin-left: 10px;' style='float: left;'>Teacher: "+courseData.teacher+"</p>" +
            "<p class='text' style='margin-left: 10px;'>Course ID: "+courseData.courseID+"</p>" +
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
        this.calculateFinalGrades(data, term, courseID, schoolDistrictCode);
        this.dialog.OpenDialog();
        // @ts-ignore
        window["resetAssignments" + courseID + term.toString()] = () => {
            for (let i = 0; i < StatusQuery.courseGrades.length; i++){
                if (StatusQuery.courseGrades[i].courseID == courseID){
                    StatusQuery.courseGrades[i][term.toString()] = JSON.parse(JSON.stringify(StatusQuery.ogCourseGrades[i][term.toString()]));

                }

            }
            this.dialog.DestroyWithAnim();
            coursePage.UpdateGrades(courseID, schoolDistrictCode, term);
            setTimeout(() => {
                new GradePage(term, courseID, schoolDistrictCode, coursePage);
            }, 500);

        }
        // @ts-ignore
        window["addAssignment" + courseID + term.toString()] = () => {

        }


        for (let i = 0; i < quarterAssignments.length; i++) {
            const assignmentID = uuid.v4();
            quarterAssignments[i]["assignmentID"] = assignmentID;
            // @ts-ignore
            window["deleteAssignment" +term.toString().toLowerCase()+courseID + assignmentID] = () => {
                let assignment = document.querySelector('.assignmentPage.table.body'+term.toString().toLowerCase()+courseID+'.assignment.id'+assignmentID+'');
                // @ts-ignore
                assignment.remove();
                const newQuarterAssignments = quarterAssignments;
                for (let j = 0; j < quarterAssignments.length; j++) {
                    // @ts-ignore
                    let assignmentIDelem = assignment.classList[4].split("id")[1];
                    if (quarterAssignments[j].assignmentID == assignmentIDelem){
                        console.log("Deleting", quarterAssignments[j]);
                        quarterAssignments.splice(j, 1);
                    }
                }
                const newCourseData = courseData;
                newCourseData[term.toString()] = newQuarterAssignments;
                for (let y = 0; y < StatusQuery.courseGrades.length; y++){
                    if (StatusQuery.courseGrades[y].courseID == courseID){
                        StatusQuery.courseGrades[y] = newCourseData;
                    }
                }
                quarterAssignments = newQuarterAssignments;
                courseData = newCourseData;
                data = StatusQuery.courseGrades;
                console.log(quarterAssignments);
                this.calculateFinalGrades(StatusQuery.courseGrades, term, courseID, schoolDistrictCode);
                coursePage.UpdateGrades(courseID, schoolDistrictCode, term);
            }

            // @ts-ignore
            window["editAssignment" +term.toString().toLowerCase()+courseID + assignmentID] = () => {
                let assignment = document.querySelector('.assignmentPage.table.body'+term.toString().toLowerCase()+courseID+'.assignment.id'+assignmentID+'');
                if (assignment){
                    assignment.innerHTML = "" +
                        "<td colspan='6'>" +
                        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Name:</span>" +
                        "   <input type='text' class='assignmentPage table editAssignmentName' placeholder='Assignment Name' style='position: unset; transform: unset; float: left;'> <br><br>" +
                        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Points:</span>" +
                        "   <input type='number' class='assignmentPage table editAssignmentGradeValue' placeholder='Points' style='position: unset; transform: unset; width: 100px; float: left;'>" +
                        "   <span class='text' style='font-size: 15px;float: left;'>/</span>" +
                        "   <input type='number' class='assignmentPage table editAssignmentGradeMax' placeholder='Max Points' style='position: unset; transform: unset; width: 100px; float: left;'>" +
                        "   <br><br>" +
                        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Type:</span>" +
                        "   <select style='position: unset; transform: unset; float: left;' class='assignmentPage table editAssignmentType'>" +
                        "       "+weightsOptionElems+
                        "   </select> <br><br>" +
                        "   <span class='text' style='font-size: 15px; float: left;'>Assignment Due Date:</span>" +
                        "   <input type='date' class='assignmentPage table editAssignmentDate' placeholder='Assignment Name' style='position: unset; transform: unset; color-scheme: dark; float: left;'> <br><br>" +
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
                        "   <input type='checkbox' id='assignmentPageTableEditAssignmentLateGradeIncludeWeekends"+term.toString().toLowerCase()+courseID + assignmentID+"' class='assignmentPage table editAssignmentLateGradeIncludeWeekends' style='position: unset; width: 25px; float: left; transform: translateY(-10px);'> <br> <br>" +
                        "   <label class='text' for='assignmentPageTableEditAssignmentLateGradeStartAfterDueDate"+term.toString().toLowerCase()+courseID + assignmentID+"' style='font-size: 15px; float: left;'>Start taking off % right after due date?</label>" +
                        "   <input type='checkbox' id='assignmentPageTableEditAssignmentLateGradeStartAfterDueDate"+term.toString().toLowerCase()+courseID + assignmentID+"' class='assignmentPage table editAssignmentLateGradeStartAfterDueDate' style='position: unset; width: 25px; float: left; transform: translateY(-10px);'> <br> <br>" +
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
                        "</td>"

                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentName").value = quarterAssignments[i].name;
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentGradeValue").value = quarterAssignments[i].points.split("/")[0];
                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentGradeMax").value = quarterAssignments[i].points.split("/")[1];

                    let assignmentTypeIndex = 0;
                    if (quarterAssignments[i].type == "assignment"){
                        assignmentTypeIndex = 0;
                    }
                    if (quarterAssignments[i].type == "test"){
                        assignmentTypeIndex = 1;
                    }

                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentType").selectedIndex = assignmentTypeIndex;


                    let year = "20" + quarterAssignments[i].date.split("/")[2];
                    let month = quarterAssignments[i].date.split("/")[0];
                    let day = quarterAssignments[i].date.split("/")[1];
                    let assignmentDueDate = year + "-" + month + "-" + day;

                    // @ts-ignore
                    assignment.querySelector(".assignmentPage.table.editAssignmentDate").value = assignmentDueDate;

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
                        let type = assignment.querySelector(".assignmentPage.table.editAssignmentType").selectedIndex;
                        // @ts-ignore
                        let date = assignment.querySelector(".assignmentPage.table.editAssignmentDate").value;
                        // @ts-ignore
                        let doLateGrade = assignment.querySelector(".assignmentPage.table.editAssignmentDoLateGrade").checked;

                        let points = gradeValue + "/" + gradeMax;
                        if (type == 0){
                            type = "assignment";
                        }
                        if (type == 1){
                            type = "test";
                        }

                        let year = date.split('-')[0].split('20')[1];
                        let month = date.split('-')[1];
                        let day = date.split('-')[2];

                        date = month + "/" + day + "/" + year;

                        let editData = {
                            type: type,
                            name: name,
                            date: date,
                            points: points,
                            assignmentID: assignmentID
                        }



                        // @ts-ignore
                        let assignmentIDelem = assignment.classList[4].split("id")[1];
                        let newQuarterAssignments = JSON.parse(JSON.stringify(quarterAssignments));
                        for (let j = 0; j < newQuarterAssignments.length; j++) {
                            if (newQuarterAssignments[j].assignmentID == assignmentIDelem){
                                newQuarterAssignments[j] = editData;
                            }
                        }

                        // @ts-ignore
                        assignment.querySelector("#assignmentPageTableEditAssignmentPredictedGrade").textContent =
                            // @ts-ignore
                            "Predicted Total Grade (before Late Grade Policy is applied): "+ Math.round(CalculatorManager[schoolDistrictCode].calculate(newQuarterAssignments)*10)/10
                            + "%";

                        if (doLateGrade){
                            // @ts-ignore
                            let lateGradePercent = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradePercent").value;
                            // @ts-ignore
                            let lateGradeFrequency = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeFrequency").selectedIndex;
                            // @ts-ignore
                            let includeWeekends = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeIncludeWeekends").checked;
                            // @ts-ignore
                            let startAfterDueDate = assignment.querySelector(".assignmentPage.table.editAssignmentLateGradeStartAfterDueDate").checked;

                            let currentDate = new Date();
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

                            let monthDifference = monthDiff(currentDate, dueDate);

                            let lateMultiplier = 0;
                            if (startAfterDueDate && dayDifference >= 1){
                                lateMultiplier = 1;
                            }

                            if (lateGradeFrequency == 0){
                                lateMultiplier += dayDifference;
                            }
                            if (lateGradeFrequency == 1){
                                if (!includeWeekends){
                                    if (dayDifference % 5 == 0){
                                        lateMultiplier += (dayDifference/5);
                                    }
                                }
                                else {
                                    if (dayDifference % 7 == 0){
                                        lateMultiplier += (dayDifference/7);
                                    }
                                }
                            }
                            if (lateGradeFrequency == 2){
                                lateMultiplier += monthDifference;
                            }
                            console.log(doLateGrade);
                            if (lateMultiplier >= 0){
                                let latePoints = parseFloat(points.split("/")[0]) - (parseFloat(points.split("/")[0]) * ((parseFloat(lateGradePercent) * lateMultiplier)/100));
                                let latePointsFinal = latePoints + "/" + points.split("/")[1];

                                editData = {
                                    type: type,
                                    name: name,
                                    date: date,
                                    points: latePointsFinal,
                                    assignmentID: assignmentID
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
                            "Predicted Total Grade: "+ Math.round(CalculatorManager[schoolDistrictCode].calculate(newQuarterAssignments)*10)/10
                            + "%";

                        if (save){
                            for (let j = 0; j < quarterAssignments.length; j++) {
                                if (quarterAssignments[j].assignmentID == assignmentIDelem){
                                    quarterAssignments[j] = editData;
                                }
                            }
                            courseData[term.toString()] = quarterAssignments;
                            for (let y = 0; y < StatusQuery.courseGrades.length; y++){
                                if (StatusQuery.courseGrades[y].courseID == courseID){
                                    StatusQuery.courseGrades[y] = courseData;
                                }
                            }
                            data = StatusQuery.courseGrades;
                            // @ts-ignore
                            assignment.innerHTML = "" +
                                "<tr class='assignmentPage table body"+term.toString().toLowerCase()+courseID+" assignment id"+assignmentID+"'>" +
                                "   <td>"+editData.type.toUpperCase()+"</td>" +
                                "   <td>"+editData.date+"</td>" +
                                "   <td>"+editData.name+"</td>" +
                                "   <td>"+editData.points+"</td>" +
                                "   <td></td>" +
                                "   <td>" +
                                "       <button class='button assignmentEdit' style='float: left;' onclick='window[\"editAssignment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./edit.svg' alt='Edit Assignment'></button>" +
                                "       <button class='button assignmentDelete' style='float: right;' onclick='window[\"deleteAssignment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./delete.svg' alt='Delete Assignment'></button>" +
                                "   </td>" +
                                "</tr>";
                            this.calculateFinalGrades(data, term, courseID, schoolDistrictCode);
                            coursePage.UpdateGrades(courseID, schoolDistrictCode, term);
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
                    })

                }

            }

            let tbody = document.querySelector(".assignmentPage.table.body."+term.toString().toLowerCase()+courseID);
            if (tbody){
                tbody.innerHTML += "" +
                    "<tr class='assignmentPage table body"+term.toString().toLowerCase()+courseID+" assignment id"+assignmentID+"'>" +
                    "   <td>"+quarterAssignments[i].type.toUpperCase()+"</td>" +
                    "   <td>"+quarterAssignments[i].date+"</td>" +
                    "   <td>"+quarterAssignments[i].name+"</td>" +
                    "   <td>"+quarterAssignments[i].points+"</td>" +
                    "   <td></td>" +
                    "   <td>" +
                    "       <button class='button assignmentEdit' style='float: left;' onclick='window[\"editAssignment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./edit.svg' alt='Edit Assignment'></button>" +
                    "       <button class='button assignmentDelete' style='float: right;' onclick='window[\"deleteAssignment"+term.toString().toLowerCase()+courseID + assignmentID+"\"]();'><img src='./delete.svg' alt='Delete Assignment'></button>" +
                    "   </td>" +
                    "</tr>";
            }

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
            Math.round(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(data, term, courseID)*10)/10
            + "%";
    }



}