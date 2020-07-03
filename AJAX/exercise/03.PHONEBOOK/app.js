function attachEvents() {
    let loadBtn = document.querySelector("#btnLoad");
    let createBtn = document.querySelector("#btnCreate");
    let phoneBookUl = document.querySelector("#phonebook");
    let inputFields = Array.from(document.querySelectorAll("input"));

    function createDOMEntry(person, phone, key, deleteEntry) {
        let li = document.createElement("li");
        li.setAttribute("id", "phonebook");
        li.textContent = `${person}: ${phone}`;
        let btn = document.createElement("button");
        if (key !== undefined) {
            btn.setAttribute("key", key);
        }
        btn.textContent = "DELETE";
        li.appendChild(btn);
        phoneBookUl.appendChild(li);
        btn.addEventListener("click", deleteEntry);
        return li;
    }

    function deleteEntry(evt) {
        //remove entry from server
        fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${evt.target.getAttribute("key")}.json`, {
            method: "DELETE"
        }).then(response => {
            console.log(response.statusText);
        });

        // remove entry from DOM
        evt.target.parentElement
            .parentElement.removeChild(evt.target.parentElement);
    }

    function createEntry() {
        // if input fields not empty
        if (inputFields[0].value.trim() && inputFields[1].value.trim()) {

            let entry = {
                // get input values
                person: inputFields[0].value,
                phone: inputFields[1].value
            };
            // send entry to server
            fetch(`https://phonebook-nakov.firebaseio.com/phonebook.json`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(entry)
            })
                .then(response => {
                    if (response.ok) {
                        //get updated entry list and render
                        getPhonebookEntries();
                        console.log("great success: ", response.statusText);
                    }
                });

            // clear input fields
            inputFields.forEach(f => {
                f.value = "";
            });
        }
    }

    function getPhonebookEntries() {
        phoneBookUl.innerHTML = "";
        let url = "https://phonebook-nakov.firebaseio.com/phonebook.json";
        fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            }).then(data => {
            if (data) {
                Object.entries(data).forEach(e => {
                    let obje = e[1];
                    let key = e[0];
                    createDOMEntry(obje.person, obje.phone, key, deleteEntry);
                });
            }
        });
    }

    createBtn.addEventListener("click", createEntry);
    loadBtn.addEventListener("click", getPhonebookEntries);


}

attachEvents();