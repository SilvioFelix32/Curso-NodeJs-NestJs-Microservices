import { IsString, IsArray, ArrayMinSize, IsOptional } from "class-validator";

export class UpdateCategoryDto {

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>
}
interface Event {
    name: string;
    operation: string;
    value: number;
}