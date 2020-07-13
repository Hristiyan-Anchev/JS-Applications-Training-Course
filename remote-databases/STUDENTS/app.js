import * as data from "./data.js";
import * as dom from "./dom.js";

    //init function
    window.addEventListener("load",main);


    async function main(){
        document.getElementById("submit").addEventListener("click",registerNewStudent);

        await data.getAllStudents().catch(console.log);
        dom.renderTable();

        async function registerNewStudent() {
            try{
                let studentDetails =  dom.getFormData();
                if(studentDetails){
                    await data.addNewStudent(...studentDetails);
                    await data.getAllStudents()
                    dom.renderTable();
                }
            }catch (e) {
                console.log(e.message);
            }
        }
    }