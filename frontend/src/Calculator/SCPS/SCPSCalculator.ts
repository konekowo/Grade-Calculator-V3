import config from "../../../../config.json";
import {Quarter} from "../../Quarter";



export class SCPSCalculator {
    public static schoolDistrictCode = "SCPS";
    public static calculateQuarterGrade(gradesData: any[], quarter: Quarter, classID: string): number{


        let courseObj: any;
        gradesData.forEach((course) => {
           if (course.courseID == classID){
               courseObj = course;
           }
        });

        let quarterAssignments: any[];
        for (let key in courseObj){
            if (key == quarter.toString()){
                quarterAssignments = courseObj[key];
            }
        }

        // @ts-ignore
        return this.calculate(quarterAssignments);
    }

    public static calculate(quarterAssignments: any[]) {


        let weights: any;
        config.SchoolDistricts.forEach((schoolDistrict) => {
            if (schoolDistrict.code == this.schoolDistrictCode){
                weights = schoolDistrict.weights;
            }
        });

        // @ts-ignore
        for (let key in weights){
            let assignments: any[] = [];
            // @ts-ignore
            quarterAssignments.forEach((grade) => {

                if (grade.type == key){
                    assignments.push(grade);
                }
            });

            weights[key]["assignments"] = assignments;

        }

        let totalGrade: number = 0;

        for (let key in weights){
            let points: number = 0;
            let maxPoints: number = 0;
            weights[key]["assignments"].forEach((grade:any) => {
                let assignmentPoints = parseFloat(grade.points.split("/")[0]);
                let maxAssignmentPoints = parseFloat(grade.points.split("/")[1]);
                if (grade.points.split("/")[0] !=  "*"){
                    points += assignmentPoints;
                    maxPoints += maxAssignmentPoints;
                }
            });
            // @ts-ignore
            if (!weights[key]["assignments"].length == 0){
                totalGrade += ((points/maxPoints) * (weights[key]["weight"]/100)) * 100;
            }
            else{
                let otherKey = "";
                for (let key2 in weights){
                    if (key2 != key){
                        otherKey = key2;
                    }
                }
                weights[otherKey]["assignments"].forEach((grade:any) => {
                    let assignmentPoints = parseFloat(grade.points.split("/")[0]);
                    let maxAssignmentPoints = parseFloat(grade.points.split("/")[1]);
                    if (grade.points.split("/")[0] !=  "*"){
                        points += assignmentPoints;
                        maxPoints += maxAssignmentPoints;
                    }
                });
                totalGrade = (points/maxPoints) * 100;
                return (points/maxPoints) * 100;
            }

        }

        return totalGrade;
    }
}