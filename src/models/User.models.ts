import mongoose, { Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date,
}

const MessageSchema: Schema<Message>  = new Schema({
    content: {
        type: String,
        required: true
        },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }    
});


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: number,
    isVerified: boolean,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema:Schema<User> = new Schema({
      username:{
        type: String,
        required: [true, 'username is requried'],
        trim: true,
        unique: true
      },
      email: {
        type: String,
        required: [true, 'Email is requried'],
        lowercase: true,
        unique: true,
        trim: true,
        match: [emailRegex, 'Invalid email address format']
      },
      password: {
        type: String,
        required: [true, 'passaword is must be requried'],
      },
      verifyCode: {
        type: Number,
        required: true,
      },
      verifyCodeExpiry: {
        type: Date,
        required: true
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      isAcceptingMessage: {
        type: Boolean
      },
      messages: [MessageSchema]

});

const userModel = (mongoose.models.User as mongoose.Model<User>) 
                   || (mongoose.model<User>("User", userSchema));
export default userModel;