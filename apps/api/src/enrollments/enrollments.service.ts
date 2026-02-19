import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "@temporalio/client";
import { randomUUID } from "crypto";
import { CadencesService } from "../cadences/cadences.service";
import type { CadenceStep, WorkflowState } from "shared";

@Injectable()
export class EnrollmentsService {
    constructor(
        private readonly client: Client,
        private readonly cadencesService: CadencesService
    ) { }

    async enroll(cadenceId: string, contactEmail: string) {
        const cadence = this.cadencesService.findById(cadenceId);

        const enrollmentId = randomUUID();

        await this.client.workflow.start("emailCadenceWorkflow", {
            taskQueue: "email-cadence-queue",
            workflowId: enrollmentId,
            args: [cadenceId, contactEmail, cadence.steps]
        });

        return { enrollmentId };
    }

    async getStatus(enrollmentId: string) {
        const handle = this.client.workflow.getHandle(enrollmentId);

        try {
            return await handle.query("getState");
        } catch {
            throw new NotFoundException("Enrollment not found");
        }
    }

    async updateCadence(enrollmentId: string, steps: CadenceStep[]) {
        const handle = this.client.workflow.getHandle(enrollmentId);

        const status = await handle.query<WorkflowState>("getState").catch(() => {
            throw new NotFoundException("Enrollment not found");
        });

        if (status?.status === "COMPLETED") {
            throw new ConflictException("Cannot update a completed enrollment");
        }

        await handle.signal("updateCadence", steps);

        return { success: true };
    }
}
