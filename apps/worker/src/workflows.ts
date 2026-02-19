import {
    proxyActivities,
    sleep,
    defineSignal,
    defineQuery,
    setHandler,
    log
} from "@temporalio/workflow";

import type { CadenceStep, WorkflowState } from "shared";

const { sendEmailMock } = proxyActivities<typeof import("./activities")>({
    startToCloseTimeout: "1 minute"
});

export const updateCadenceSignal =
    defineSignal<[CadenceStep[]]>("updateCadence");

export const getStateQuery =
    defineQuery<WorkflowState>("getState");

export async function emailCadenceWorkflow(
    cadenceId: string,
    contactEmail: string,
    initialSteps: CadenceStep[]
) {
    let steps = initialSteps;
    let currentStepIndex = 0;
    let stepsVersion = 1;
    let status: WorkflowState["status"] = "RUNNING";

    log.info(`Workflow started for cadence ${cadenceId} and contact ${contactEmail}`);

    setHandler(updateCadenceSignal, (newSteps) => {
        steps = newSteps;
        stepsVersion++;

        log.info(`Cadence updated. Version: ${stepsVersion} New Steps Count: ${newSteps.length}`);

        if (newSteps.length <= currentStepIndex) {
            status = "COMPLETED";
        }
    });

    setHandler(getStateQuery, () => ({
        currentStepIndex,
        stepsVersion,
        status
    }));

    while (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];

        log.info("Processing step", {
            index: currentStepIndex,
            type: step.type
        });

        if (step.type === "WAIT") {
            await sleep(step.seconds * 1000);
        }

        if (step.type === "SEND_EMAIL") {
            const result = await sendEmailMock({
                subject: step.subject,
                body: step.body,
                to: contactEmail
            });
            
            log.info("Email sent", result);
        }

        currentStepIndex++;
    }

    status = "COMPLETED";
}
