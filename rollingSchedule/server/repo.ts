import { ObjectId } from "mongodb";
import { scheduleOptions } from "./models/schedule";


//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
let _clientDb:any = null;

const _initDb = (clientDb:any) =>{
    _clientDb = clientDb;

}
const _findScheduleItem:any = async (id:string)=> {
    var result= await _clientDb.collection("schedule").findOne({"_id":new ObjectId(id)});
    return result;
}
const getAll:any = async ()=> {
  var result= await _clientDb.collection("schedule").find({}).toArray((err:any,res:any)=>res);
  return result;
}

const _addSchedule = async (scheduleOptions:scheduleOptions ) =>{
  let newSchedule =   {
    _id:null,
    name: scheduleOptions.name,
    members : scheduleOptions.members //array
  };
   _clientDb.collection("schedule").insertOne(newSchedule).insertedId;
  return newSchedule._id;
}

export const repository = {
  initDb:_initDb ,
  addSchedule: _addSchedule ,
  findScheduleItem: _findScheduleItem ,
  getAll 
}