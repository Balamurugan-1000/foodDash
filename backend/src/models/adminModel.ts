import  { model, Schema } from "mongoose";
import { IAdmin } from "../utils/types";


const adminSchema = new Schema<IAdmin>({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
   
    
})


export default model("Admin", adminSchema)