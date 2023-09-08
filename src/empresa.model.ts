import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Empresa extends Document {

    @Prop() name: string;

}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);