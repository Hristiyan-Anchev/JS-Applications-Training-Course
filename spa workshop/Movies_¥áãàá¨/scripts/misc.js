export let init = function(httpMethod,bodyObject={},additionalHeaders = {}){
        let headers = {
                "Content-Type":"application/json",
        };
        Object.assign(headers,additionalHeaders);
        let result ={
                method:httpMethod.toUpperCase(),
                headers,
        }

        if(httpMethod.toUpperCase() !== "GET"){
                Object.assign(result,{body:JSON.stringify(bodyObject)})
        }
        return result
}











let appID = "4AA885C9-54CB-1CAF-FF3F-66F4EE2B7400"
let apiKey = "88E3851D-87ED-4EE2-BF65-43091A933E1F"
let baseURL = `https://api.backendless.com/${appID}/${apiKey}`;
export default  {
        registerUserURL:
            `${baseURL}/users/register`,
        loginUserURL:
            `${baseURL}/users/login`,
        logoutUserURL:
            `${baseURL}/users/logout`,
        allMoviesURL:
            `${baseURL}/data/movies`,

}