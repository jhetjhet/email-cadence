import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnrollmentsService } from "./enrollments.service";
import { CadenceStep } from "shared";

@Controller("enrollments")
export class EnrollmentsController {
    constructor(private readonly service: EnrollmentsService) { }

    @Post()
    enroll(@Body() body: { cadenceId: string; contactEmail: string }) {
        return this.service.enroll(body.cadenceId, body.contactEmail);
    }

    @Get(":id")
    getStatus(@Param("id") id: string) {
        return this.service.getStatus(id);
    }

    @Post(":id/update-cadence")
    update(
        @Param("id") id: string,
        @Body() body: { steps: CadenceStep[] }
    ) {
        return this.service.updateCadence(id, body.steps);
    }
}
