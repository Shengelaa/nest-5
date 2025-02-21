import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Role } from "src/enums/roles.enum";
import { Subscription } from "src/enums/subscription.enum";

@Schema({timestamps: true})
export class User {

    @Prop({type: String})
    fullName: string

    @Prop({type: String})
    email: string

    @Prop({type: String})
    password: string

    @Prop({type: String, enum: Role, default: Role.USER})
    role: string

    @Prop({type: String, enum: Subscription, default: Subscription.FREE})
    subscriptionPlan: string

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'post', default: [] })
    posts: mongoose.Schema.Types.ObjectId[]

    @Prop({type: Boolean, default: false})
    isVerified: boolean

    @Prop({type: String})
    otpCode: string

    @Prop({type: Date})
    otpCodeValidateDate: Date

    @Prop({type: String})
    avatar: string
}

export const userSchema = SchemaFactory.createForClass(User)