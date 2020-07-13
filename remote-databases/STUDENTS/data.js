export {studentsCache, getAllStudents, addNewStudent,deleteStudent};

function host() {
    let url = "https://api.backendless.com/85D7403D-5400-E838-FF10-44BF352C2600/4F9CB30D-3237-428D-882F-292FC9DD8207/data/";
    return {
        students: url + "students"
    }
}

let uid = 0;
let studentsCache = [];

async function getAllStudents() {
    let response = await fetch(host().students);
    if (response.ok) {
        let data = await response.json();

        studentsCache = Array.from(data);
        studentsCache = studentsCache.sort((s1, s2) => {
            return s1.id - s2.id;
        });
        if (studentsCache[studentsCache.length - 1]) {
            uid = studentsCache[studentsCache.length - 1].id;
        }

        return data;
    }
    throw new Error(response.statusText);
}

async function addNewStudent(firstName, lastName, facultyNumber, grade) {
    grade = parseFloat(grade);
    uid++;
    let response = await fetch(host().students, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id:uid, firstName, lastName, facultyNumber, grade})
    });
    if (response.ok) {
        return response.statusText;
    }
    throw new Error(response.statusText);

}

async function deleteStudent(objectId){
     let response = await fetch(host().students + `/${objectId}`,{
        method:"DELETE"
    });
    if(response.ok){
        studentsCache = studentsCache.reduce((ac,cur)=>{
            if(cur.objectId !== objectId){
                ac.push(cur);
            }
            return ac;
        },[]);

        return response.statusText;
    }

    throw new Error (response.statusText);
}