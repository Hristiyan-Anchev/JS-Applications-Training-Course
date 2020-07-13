export {getBookInfo, createDomBook, appendToBody};
import * as dataModule from "./data.js";

/**
 *
 *
 *
 *
 *
 * !!! ATTENTION !!!
 *
 * The code in this file is badly written and it causes serious
 * headache for the reader!
 * Save yourself the troubles and skip it - this is just DOM manipulation script.
 *
 *  YOU HAVE BEEN WARNED!
 *
 *
 *
 * !!! ATTENTION !!!
 */
function appendToBody(tableRow) {
    document.querySelector("tbody").appendChild(tableRow);
}
function getBookInfo() {
    let title = document.getElementById("title");
    let author = document.getElementById("author");
    let isbn = document.getElementById("isbn");
    if ([title, author, isbn].find(x => {
        return x.value.trim() === ""
    })) {
        return undefined;
    }

    return [title.value.trim(), author.value.trim(), isbn.value.trim()]
}

function createDomBook(title, author, isbn, objectId) {
    let tr = document.createElement("tr");
    let tdTitle = document.createElement("td");
    tdTitle.textContent = title;
    let tdAuthor = document.createElement("td");
    tdAuthor.textContent = author;
    let tdIsbn = document.createElement("td");
    tdIsbn.textContent = isbn;

    tr.setAttribute("object-id", objectId);

    let tdButtons = document.createElement("td");
    tdButtons.className = "buttons";
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    editBtn.addEventListener("click", handleEdit);
    deleteBtn.addEventListener("click", handleDelete);
    [tdTitle, tdAuthor, tdIsbn].forEach(t => {
        t.className = "data";
    });
    tdButtons.append(editBtn, deleteBtn);
    tr.append(tdTitle, tdAuthor, tdIsbn, tdButtons);

    return tr;
}

function handleEdit(evt) {

    let saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", handleSave);
    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", handleCancel);

    let data = Array.from(evt.target.parentElement.parentElement.querySelectorAll(".data"));
    let oldData = data.reduce((ac, cur) => {
        ac.push(cur.textContent);
        return ac;
    }, []);
    data.map(d => {
        let curVal = d.textContent;
        let inputEl = document.createElement("input");
        inputEl.value = curVal;
        d.textContent = "";
        d.appendChild(inputEl);
        return d;
    });

    let tdEditModeBtns = document.createElement("td");
    tdEditModeBtns.className = "edit-buttons";
    tdEditModeBtns.append(saveBtn, cancelBtn);

    evt.target.parentElement.parentElement.appendChild(tdEditModeBtns);
    evt.target.parentElement.style.display = "none";

    async function handleSave(evt) {
        let objectId = evt.target.parentElement.parentElement.getAttribute("object-id");

        let bookData = Array.from(evt.target.parentElement.parentElement.querySelectorAll(".data"));
        if (bookData.every(e => {
            return oldData.includes(e.children[0].value.trim())
        })) {
            //do not update if the new values are the same as the old ones
            handleCancel(evt);
        } else// save changes if no empty edit fields
        if (!bookData.some(e => {
            return e.children[0].value.trim() === ""
        })) {

            try {//  UPDATE DB
                let title = bookData[0].firstChild.value;
                let author = bookData[1].firstChild.value;
                let isbn = bookData[2].firstChild.value;
                let response = await dataModule.updateBook({
                    title,
                    author,
                    isbn,
                    objectId
                });
                //DRY
                bookData.map(x => {
                    x.textContent = x.children[0].value;
                    return x;
                });
            } catch (e) {
                console.log(e.message);
            }
            //DRY
            evt.target.parentElement.parentElement.querySelector(".buttons").style = "";
            evt.target.parentElement.parentElement.removeChild(
                evt.target.parentElement.parentElement.querySelector(".edit-buttons")
            );
        }
    }

    function handleCancel(evt) {
        Array.from(evt.target.parentElement.parentElement.querySelectorAll(".data"))
            .map((d, idx) => {
                d.textContent = oldData[idx];
                return d;
            });
        //DRY
        evt.target.parentElement.parentElement.querySelector(".buttons").style = "";
        evt.target.parentElement.parentElement.removeChild(
            evt.target.parentElement.parentElement.querySelector(".edit-buttons")
        );
    }
}

async function handleDelete(evt) {

    let id = evt.target.parentElement.parentElement.getAttribute("object-id");


    await dataModule.deleteBook(id);
    document.querySelector("tbody").removeChild(evt.target.parentElement.parentElement);

}