'use server'

import mongoose, {Document, Schema} from "mongoose";
import connectDB from "../db";

export interface ITranslation extends Document {
    //_id :string;
    timestamp : Date;
    fromText : string;
    from : string; //auto
    toText :string;
    to : string; //en
}

interface IUser extends Document{
    userId : string;
    translations : Array<ITranslation>;
}

const translationSchema = new Schema<ITranslation>({
    timestamp : {type : Date, default: Date.now}, 
    fromText : String,
    from : String,
    toText :String,
    to : String,
});

const userSchema = new Schema<IUser>({
    userId : String,
    translations : [translationSchema],
});

//check if model already exists, if not init a user instance of UserSchema
const User = mongoose.models.User || mongoose.model<IUser>('User',userSchema);

export async function addOrUpdateUser(
    userId : string, 
    translation: 
    {fromText : string;
    from : string; 
    toText :string;
    to : string; }) 
    : Promise<IUser> {
    //filteration for checking userID
    const filter = {userId : userId};
    //goes wherever userId is, and pushes the translation to it
    const update = {
        $set : {userId : userId},
        $push : {translations : translation}
    };

    await connectDB();

    //upsert option ensures document is created if it doesnt exist
    //new: true - method returns updated document after operation is complete, if not (True) method returns original document before update
    //if userId available, update exisiting user coument, if not newDoc with userId and translation is saved to db
    
    const options = {upsert : true, new : true, setDefaultsOnInsert : true};
    try{
        const user : IUser | null = await User.findOneAndUpdate(
            filter,
            update,
            options,
        );
        console.log('User added or updated ', user);
        if (!user) {
            throw new Error('User not found or created ');
        }

        return user;
    }
    catch(error){
        console.log('Error adding or updating ', error);
        throw error;
    }
}



export async function removeTranslation(userId:string, translationId : string):Promise<IUser> {
    await connectDB();

    
    try {
        const user:IUser | null = await User.findOneAndUpdate(
            {userId : userId}, //find user with given userId
            {$pull :{translations : { _id : translationId}}}, //go into translation collection and pull it then remove translation with given id
            {new: true} //return updated document
        );

    if (!user){ //if no user
        throw new Error('User not found');
    }
    console.log ('translation removed : ',user);
    return user;

    } catch (error) {
        console.log('Error removing translation from DB ',error)
        throw error;
    }
}
    
//return an array of translations
export async function getTranslations(userId:string): Promise<Array<ITranslation>> {
    await connectDB();

    try{
        const user : IUser | null = await User.findOne({userId : userId});

        if (user){
            //sort translations by timestamp in descending order 
            user.translations.sort(
                (a: ITranslation, b: ITranslation) => b.timestamp.getTime() - a.timestamp.getTime());

             //return translations after sort
             return user.translations;
        }

        else{
            console.log('User with userId ${userId} is not found ');
            return[];
        }
    }
    catch(err){
        console.log('Error retreiving translations  ',err);
        throw(err);
    }
}

export default User;