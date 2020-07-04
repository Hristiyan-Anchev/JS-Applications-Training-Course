function attachEvents() {
    let chatArea = document.querySelector("#messages");
    let name = document.querySelector("#author");
    let message = document.querySelector("#content");

    let send = document.querySelector("#submit");
    let refresh = document.querySelector("#refresh");
    let clear = document.querySelector("#clear");
    let url = "https://rest-messanger.firebaseio.com/messanger.json";

    send.addEventListener("click", sendMessage);
    refresh.addEventListener("click", displayMsg);
    clear.addEventListener("click", clearChat);

    function clearChat() {
        let promptSlot = document.querySelector("#prompt");
        let msgWindow = document.createElement("div");
        let buttons = document.querySelector(".buttons");
        msgWindow.setAttribute("class", "msg-window");
        msgWindow.appendChild(document.createTextNode("You are about to delete the entire chat history!\n"));
        msgWindow.appendChild(document.createTextNode("Are you sure?"));
        let yesBtn = document.createElement("input");
        yesBtn.type = "button";
        yesBtn.value = "YES";
        yesBtn.setAttribute("id", "clear");
        let noBtn = document.createElement("input");
        noBtn.type = "button";
        noBtn.value = "NO";
        let btnHolder = document.createElement("div");
        btnHolder.id = "btnContainer";
        btnHolder.appendChild(yesBtn);
        btnHolder.appendChild(noBtn);
        msgWindow.appendChild(btnHolder);
        noBtn.addEventListener("click", function () {
            promptSlot.removeChild(msgWindow);
            Array.from(buttons.children).forEach(b => {
                b.disabled = false;
            });
        });
        yesBtn.addEventListener("click", function () {
            Array.from(buttons.children).forEach(b => {
                b.disabled = false;
            });
            fetch(url, {
                method: "DELETE"
            }).then(response => {
                if (response.ok) {
                    console.log("Deleted: ", response.statusText);
                }
            });
            chatArea.textContent = "";
            noBtn.click();
        })

        promptSlot.appendChild(msgWindow);
        //disable buttons temporary
        Array.from(buttons.children).forEach(b => {
            b.disabled = true;
        });
    }

    function displayMsg() {
        chatArea.textContent = "";
        fetch("https://rest-messanger.firebaseio.com/messanger.json")
            .then(response => {
                if (response.ok) {
                    console.log("great success: ", response.statusText);
                    return response.json();
                }
            }).then(data => {
            if (data) {
                let chatContent = [];
                Object.entries(data).forEach(entry => {
                    chatContent.push(`${entry[1].author}: ${entry[1].content}`);
                });
                chatArea.textContent = chatContent.join("\n");
            }
        });
    }

    function sendMessage(evt) {
        let msg = {
            author: name.value,
            content: message.value
        }
        fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(msg)
        })
            .then(res => {
                if (res.ok) {
                    displayMsg();
                    console.log("great success: ", res.statusText);
                }
            });

        message.value = "";
    }
}

attachEvents();