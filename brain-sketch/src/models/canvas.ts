import mongoose from "mongoose";

const CanvasSchemas = new mongoose.Schema({
    userId:{
        type:String,
        default:"default-user",
        index:true,

    },
    lines:{
        type:mongoose.Schema.Types.Mixed,
        default:[],
    }

},
{
    timestamps:true
})

const canvasModel = mongoose.model("Canvas" , CanvasSchemas);
export default mongoose.models.canvas || canvasModel;