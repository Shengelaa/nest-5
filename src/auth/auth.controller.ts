import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './guards/auth.guard';
import { User } from 'src/users/users.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { GoogleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @ApiCreatedResponse({
    schema: {
      example: 'user registerd successfully'
    }
  })
  @ApiBadRequestResponse({
    schema: {
      example: 'user already exists'
    }
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto){
    return this.authService.signUp(signUpDto)
  }


  @Get('google')
  @UseGuards(GoogleGuard)
  async signInWithGoogle(){}


  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req, @Res() res){
    const token = await this.authService.signInWithGoogle(req.user)
    res.redirect(`${process.env.FRONT_URL}/sign-in?token=${token}`)
  }

  @Post('verify')
  verifyEmail(@Body() body){
    const {email, otpCode} = body

    return this.authService.verifyEmail(email, otpCode)
  }

  @Post('resend-verification-code')
  resendVerificationCode(@Body('email') email){

    return this.authService.resendVerificationCode(email)
  }

  @ApiBadRequestResponse({
    schema: {
      example: 'Email or password is invalid'
    }
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2EzOGQwNmE1YWIxYjBhZWZhYzA3MDgiLCJyb2xlIjoidXNlciIsInN1YnNjcmlwdGlvbiI6ImZyZWUiLCJpYXQiOjE3Mzg3NzIyMzEsImV4cCI6MTczODc3NTgzMX0.haQiuvAoUGMfKC-duyPot2MUxYgnWDm6sTVDta60_yc"
      }
    }
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto){
    return this.authService.signin(signInDto)
  }


  @ApiBearerAuth()
  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@User() userId){
    return this.authService.getCurrentUser(userId)
  }
}
