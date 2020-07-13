import * as data from "./data.js";
import * as dom from "./dom-manipulator.js";


window.addEventListener("load", () => {
    document.querySelector("#loadBooks").addEventListener("click", displayBooks);
    document.querySelector("form > button").addEventListener("click", submitBook);

    async function submitBook(evt) {
        evt.preventDefault();
        let newBookEntry = dom.getBookInfo();
        try {
            if (newBookEntry) {
                let response = await data.createBook({
                    title: newBookEntry[0],
                    author: newBookEntry[1],
                    isbn: newBookEntry[2]
                });
                await displayBooks();
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    async function displayBooks(evt) {
        document.querySelector("tbody").textContent = "";
        try {
            let books = await data.getBooks().catch(console.log);
            books.forEach(b => {
                dom.appendToBody(
                    dom.createDomBook(b.title, b.author, b.isbn, b.objectId)
                );
            });
        }catch (e) {
            console.log(e.message);
        }

    }

});

