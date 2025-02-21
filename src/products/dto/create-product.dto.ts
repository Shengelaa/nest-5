import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        example: "apple",
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string


    @ApiProperty({
        example: 30,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    price: string

}
