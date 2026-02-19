import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CadencesService } from "./cadences.service";
import type { Cadence } from "shared";

@Controller("cadences")
export class CadencesController {
    constructor(private readonly service: CadencesService) { }

    @Post()
    create(@Body() cadence: Cadence) {
        return this.service.create(cadence);
    }

    @Get(":id")
    get(@Param("id") id: string) {
        return this.service.findById(id);
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() cadence: Cadence) {
        return this.service.update(id, cadence);
    }
}
