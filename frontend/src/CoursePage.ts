import {StatusQuery} from "./StatusQuery";
import {CalculatorManager} from "./Calculator/CalculatorManager";
import {Quarter} from "./Quarter";

export class CoursePage {
    public constructor(schoolDistrictCode: string) {
        const page = document.createElement("div");
        page.innerHTML = "" +
            "<div class='gradespage tableContainer'>" +
            "   <table class ='gradespage table'>" +
            "      <thead>" +
            "        <tr>" +
            "          <th>Course</th>" +
            "          <th>Q1</th>" +
            "          <th>Q2</th>" +
            "          <th>S1</th>" +
            "          <th>Q3</th>" +
            "          <th>Q4</th>" +
            "          <th>S2</th>" +
            "        </tr>" +
            "      </thead>" +
            "      <tbody class='gradespage table body'>" +
            "      </tbody>" +
            "   </table>" +
            "</div>"
        document.body.appendChild(page);
        page.style.color = "white";
        // @ts-ignore
        console.log(CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q1, "309950"));
        for (let i = 0; i < StatusQuery.courseGrades.length; i++){
            // @ts-ignore
            document.querySelector(".gradespage.table.body").innerHTML += "" +
                "<tr class='gradespage table course "+StatusQuery.courseGrades[i].courseID+"'><td>"+ StatusQuery.courseGrades[i].courseName +"</td>" +
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
                // @ts-ignore
                Math.round((CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q1, StatusQuery.courseGrades[i].courseID) + CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q2, StatusQuery.courseGrades[i].courseID))/2
                )
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
                Math.round((CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q3, StatusQuery.courseGrades[i].courseID) + CalculatorManager[schoolDistrictCode].calculateQuarterGrade(StatusQuery.courseGrades, Quarter.Q4, StatusQuery.courseGrades[i].courseID))/2)
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
    }

}