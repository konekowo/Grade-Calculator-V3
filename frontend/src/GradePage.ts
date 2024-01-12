import {Quarter} from "./Quarter";
import {Dialog} from "./Dialog";
import {StatusQuery} from "./StatusQuery";

export class GradePage{
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

        let dialog = new Dialog("" +
            "<h1 class='text header' style='margin-top: 5px; margin-bottom: 5px; margin-left: 10px;'>"+term.toString()+" | "+courseData.courseName+"</h1>" +
            "<hr style='color: white'>" +
            "<div class='assignmentPage body' style='width: 100%; padding: 0px 5px 0px 5px;'>" +
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
            "       <tbody class='assignmentPage table body'>" +
            "           " +
            "       </tbody>" +
            "   </table>" +
            "</div>"
            , true);

        quarterAssignments.forEach((assignment) => {
            let tbody = document.querySelector(".assignmentPage.table.body");
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

        dialog.GetHtmlDiv().style.width = "70vw";
    }

}