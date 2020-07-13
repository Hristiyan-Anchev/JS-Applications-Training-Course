import * as data from "./data.js";

export {renderTable,getFormData};

function getFormData(){
    let formData = Array.from(document.querySelector(".inputWrapper")
        .getElementsByTagName("input"));
    if(!formData.some(fd => {return fd.value.trim() === ""}) ||
        Number(formData[2].value) || Number(formData[3].value)){
        formData = formData.map(fd => {
            fd = fd.value;
            return fd;
        });
        formData[3] = Number(formData[3]).toFixed(2);
        return formData;
    }
    return undefined;
}

function createDomEntry(id, firstName, lastName, facultyNumber, grade){
    let tbody = document.querySelector("tbody");
    let tr = document.createElement("tr");
    tr.className = "studentData";
    let tdId = document.createElement("td");
    tdId.className = "studentId";
    let tdFirstName = document.createElement("td");
    let tdLastName = document.createElement("td");
    let tdFacultyNumber = document.createElement("td");
    let tdGrade = document.createElement("td");
    let tdDeleteBtn = document.createElement("td");
    let deleteBtn = document.createElement("button");
    deleteBtn.addEventListener("click",deleteEntry);

    tdId.textContent = id;
    tdFirstName.textContent = firstName;
    tdLastName.textContent = lastName;
    tdFacultyNumber.textContent = facultyNumber;
    tdGrade.textContent = grade;
    deleteBtn.textContent = "DELETE";
    tdDeleteBtn.appendChild(deleteBtn);

    tr.append(tdId,tdFirstName,tdLastName,tdFacultyNumber,tdGrade,tdDeleteBtn);
    tbody.appendChild(tr);

    async function deleteEntry(evt){
        let targetDomElement = evt.target.parentElement.parentElement;
        let tableId = targetDomElement.firstElementChild.textContent;
        let targetData = data.studentsCache.find(s => {
            return s.id === tableId;
        });
        document.querySelector("tbody").removeChild(targetDomElement);

        try{
            await data.deleteStudent(targetData.objectId);
        }catch (e) {
            console.log(e.message);
        }
    }
}

function renderTable(){
    document.querySelector("tbody").innerHTML = "";
data.studentsCache.forEach(s => {
    createDomEntry(s.id, s.firstName, s.lastName, s.facultyNumber, s.grade);
    }
);
}