import {Injectable, OnModuleInit} from "@nestjs/common";
import * as cron from 'node-cron';
import {ScheduleService} from "../service/schedule.service";

@Injectable()
export class ScheduleProvider implements OnModuleInit {
    constructor(
        private readonly scheduleService: ScheduleService
    ) {}

    onModuleInit() {

        cron.schedule('0 23 * * *', () => {
            this.scheduleService.performScheduledTask().then(r => console.log(r.message));
        });

        // cron.schedule('*/10 * * * * *', () => {
        //     this.scheduleService.performScheduledTask().then(r => console.log(r.message));
        // });
    }
}