import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class Empresa extends Document {

    @Prop() ticker: string;
    @Prop() nombre: string;
    @Prop() descripcion: string;
    @Prop() sector: string;
    @Prop() industria: string;
    @Prop() direccion: string;

}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);