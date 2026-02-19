import { Module } from "@nestjs/common";
import { EnrollmentsController } from "./enrollments.controller";
import { EnrollmentsService } from "./enrollments.service";
import { TemporalModule } from "../temporal/temporal.module";
import { CadencesModule } from "../cadences/cadences.modules";

@Module({
    imports: [CadencesModule, TemporalModule],
    controllers: [EnrollmentsController],
    providers: [EnrollmentsService]
})
export class EnrollmentsModule { }
