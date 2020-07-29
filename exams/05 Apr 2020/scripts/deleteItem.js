import * as data from "./data.js";

export default async function deleteItem(){
      await data.deleteData(this.params.objectId);
      this.redirect("#/home");

}