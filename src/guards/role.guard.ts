import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        try{
            const request = context.switchToHttp().getRequest()
            const token = this.getTokenFromHeader(request.headers)
            if(!token) throw new BadRequestException('token is not provided')
            
            const payLoad = await this.jwtService.verify(token)
            request.role = payLoad.role

            return true
        }catch(e){
            throw new UnauthorizedException('permition dined')
        }
        
    }

    getTokenFromHeader(headers){
        const authorization = headers['authorization']
        if(!authorization) return null

        const [type, token] = authorization.split(' ')
        
        return type === 'Bearer' ? token : null 
    }
}

