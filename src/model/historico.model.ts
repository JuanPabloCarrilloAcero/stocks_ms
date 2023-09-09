import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import {Empresa} from "./empresa.model";
import mongoose from "mongoose";


@Schema()
export class Historico {

    @Prop({type: Date}) relatedDate: Date;

    @Prop({type: Number}) high: number;

    @Prop({type: Number}) low: number;

    @Prop({type: Number}) open: number;

    @Prop({type: Number}) close: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Empresa'}) empresaTicker: string;

}

export const HistoricoSchema = SchemaFactory.createForClass(Historico);