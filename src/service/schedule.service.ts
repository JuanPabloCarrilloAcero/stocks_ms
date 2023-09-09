import {Injectable} from "@nestjs/common";
import {CustomResponse} from "../interface/app.interface";
import {Empresa} from "../model/empresa.model";
import {EmpresaService} from "./empresa.service";
import {HistoricoService} from "./historico.service";

@Injectable()
export class ScheduleService {

    constructor(private empresaService: EmpresaService, private historicoService: HistoricoService) {
    }

    async performScheduledTask(): Promise<CustomResponse> {

        try {
            let empresas: Empresa[];

            await this.empresaService.getAll().then((response) => empresas = response.data);

            for (const empresa of empresas) {
                try {
                    await this.historicoService.saveDataCurrentDay(empresa.ticker, empresa);
                } catch (e) {
                    console.log(e.message + ' for ticker ' + empresa.ticker);
                }
            }

            return {message: 'Task performed ' + new Date(), data: null};
        } catch (e) {
            throw {message: 'Error performing task, ' + e.message, data: null};
        }
    }
}