import {SalesRecordModel} from "../Interface.js"
import mongoose, {Schema} from "mongoose";

const SalesRecordSchema = new Schema<SalesRecordModel>({
  date:{
    required:true,
    type: Date,
    unique:true
  },
  totalRevenue:{
    required:true,
    type:Number,
     default:0,
  },
  totalSales:{
    required:true,
    type:Number,
    default:0,
  },{
  timestamps:true
}
})


const SalesRecord = mongoose.model<SalesRecordModel>('SalesRecord', SalesRecordSchema)
export default SalesRecord;
