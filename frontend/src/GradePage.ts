import {Quarter} from "./Quarter";
import {Dialog} from "./Dialog";
import {StatusQuery} from "./StatusQuery";
import {DialogModal} from "./DialogModal";

export class GradePage{
    private dialog: DialogModal;
    public constructor(term: Quarter, courseID: string) {
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

        this.dialog = new DialogModal("" +
            "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>"+term.toString()+" | "+courseData.courseName+"" +
            "<button class='assignmentPage closeButton' onclick='window.closeAndDestrowAssignmentsWindow"+courseID+term.toString()+"();'>X</button>" +
            "</h1>" +
            "<hr style='color: white; margin-left: -10px; margin-right: -10px;'>" +
            "<p class='text' style='margin-left: 10px;'>Course Name: "+courseData.courseName+"</p>" +
            "<p class='text' style='margin-left: 10px;'>Teacher: "+courseData.teacher+"</p>" +
            "<p class='text' style='margin-left: 10px;'>Course ID: "+courseData.courseID+"</p>" +
            "<div class='assignmentPage body' style='width: 100%;'>" +
            "   <table style='color: white' class='assignmentPage table'>" +
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
        this.dialog.OpenDialog();



        quarterAssignments.forEach((assignment) => {
            let tbody = document.querySelector(".assignmentPage.table.body."+term.toString().toLowerCase()+courseID);
            if (tbody){
                tbody.innerHTML += "" +
                    "<tr>" +
                    "   <td>"+assignment.type.toUpperCase()+"</td>" +
                    "   <td>"+assignment.date+"</td>" +
                    "   <td>"+assignment.name+"</td>" +
                    "   <td>"+assignment.points+"</td>" +
                    "   <td></td>" +
                    "   <td></td>" +
                    "</tr>";

            }
        });
        this.dialog.GetHtmlDiv().style.paddingLeft = "10px";
        this.dialog.GetHtmlDiv().style.paddingRight = "10px";
        this.dialog.GetHtmlDiv().style.maxHeight = "90vh";
        this.dialog.GetHtmlDiv().style.overflowY = "auto"
    }



}