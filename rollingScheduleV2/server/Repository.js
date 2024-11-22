import { MongoClient} from 'mongodb';

export class Repository {
    static instance = undefined;
    client = null;
    database= null;
    constructor() {
        if (!!Repository.instance) {
            return Repository.instance;
        }
        //    //const uri = process.env.MONGODB_CONNECTION;

        this.client = new MongoClient("mongodb://localhost:27017/?directConnection=true");
        Repository.instance = this;
        this.database = this.client.db('rollingschedule');
        return this;
    }
    saveObjToCollection=async (obj, collectionName)=>{
        obj.updatedAt = new Date();
        const coll = this.database.collection(collectionName);
        try{
            const result = await coll.insertOne(obj);
            return result.insertedId;
        }
        catch(error){
            throw new Error("Username probably taken");
        }
    };
    findObj = async (collectionName, query)=>{
        const coll = this.database.collection(collectionName);
        var res = await coll.findOne(query);
        return res;
    }

}

