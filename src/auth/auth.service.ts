import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('user') private userModel: Model<User>,
        private jwtService: JwtService,
        private emailSender: EmailSenderService,
    ){}

    async signUp({email, fullName, password}: SignUpDto){

        const existUser = await this.userModel.findOne({email})
        if(existUser) throw new BadRequestException('user already exists')
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const otpCode = Math.random().toString().slice(2, 8)
        const otpCodeValidateDate = new Date()
        otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000)

        await this.userModel.create({email, fullName, password: hashedPassword, otpCode, otpCodeValidateDate})
        await this.emailSender.sendEmailText(email, 'Verification Code', otpCode)
        
        return 'Verify Email'
    }

    async verifyEmail(email, otpCode){
        const existUser = await this.userModel.findOne({email})
        if(!existUser) throw new BadRequestException('User not Found')

        if(existUser.isVerified) throw new BadRequestException('User already verified')
        
        if(existUser.otpCodeValidateDate < new Date()) throw new BadRequestException('Otp Code is Outdated')
        
        if(otpCode !== existUser.otpCode) throw new BadRequestException('wrong otp code')

        await this.userModel.findByIdAndUpdate(existUser._id, {
            $set: {isVerified: true, otpCode: '', otpCodeValidateDate: ''}
        })

        const payLoad = {
            userId: existUser._id,
            role: existUser.role,
            subscription: existUser.subscriptionPlan
        }
        
        const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})

        return {
            message: 'user verified successfully',
            accessToken
        }
    }

    async resendVerificationCode(email){
        const existUser = await this.userModel.findOne({email})
        if(!existUser) throw new BadRequestException('User not Found')

        if(existUser.isVerified) throw new BadRequestException('User already verified')

        const otpCode = Math.random().toString().slice(2, 8)
        const otpCodeValidateDate = new Date()
        otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000)

        await this.userModel.findByIdAndUpdate(existUser._id, {
            $set: {otpCode, otpCodeValidateDate}
        })
        await this.emailSender.sendEmailText(email, 'Verification Code', otpCode)

        return 'Check Email'
    }


    async signin({email, password}: SignInDto){
        const existUser = await this.userModel.findOne({email})
        if(!existUser) throw new BadRequestException('Email or Password is invalid')

        const isPassEqual = await bcrypt.compare(password, existUser.password)
        if(!isPassEqual) throw new BadRequestException('Email or Password is invalid')

        if(!existUser.isVerified) throw new BadRequestException('Verify User') 

        const payLoad = {
            userId: existUser._id,
            role: existUser.role,
            subscription: existUser.subscriptionPlan
        }
        
        const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})

        return {accessToken}
    }

    async signInWithGoogle(user){
        let existUser = await this.userModel.findOne({email: user.email})
        if(!existUser) existUser = await this.userModel.create({...user, isVerified: true})
        
        const payLoad = {
            userId: existUser._id,
            role: existUser.role,
            subscription: existUser.subscriptionPlan
        }
        
        const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})
        
        return accessToken
    }

    async getCurrentUser(userId){
        const user = await this.userModel.findById(userId).select('-password')
        return user
    }


}
