export {host,getBooks,createBook,updateBook,getBook,deleteBook};

function host (endpoint){
    let appId= "85D7403D-5400-E838-FF10-44BF352C2600";
    let apiKey = "4F9CB30D-3237-428D-882F-292FC9DD8207";

return `https://api.backendless.com/${appId}/${apiKey}/data/${endpoint}`;
}

async function getBooks(){
    let response = await fetch(host("books"));
    let data = await response.json();
    return data;
}

async function createBook(book){
    // console.log(host("books"));
    let response = await fetch(host("books"),
        {
            method: "POST",
            body: JSON.stringify(book),
            headers:{
                "Content-Type":"application/json"
            }
        });
    return response
}

async function updateBook(book){
await fetch(host("books/" + book.objectId), {
    method:"PUT",
    headers:{
        "Content-Type":"application/json"
    }
    ,body:JSON.stringify(book)
});

}

 async function getBook(id){
    let response = await fetch(host("books/" + id));
    return  response.json();
}

async function deleteBook(id){
    console.log(host("books/" + id));
    return await fetch(host("books/" + id), {method:"DELETE"});

}