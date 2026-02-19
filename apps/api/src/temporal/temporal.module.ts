import { Module, Global } from "@nestjs/common";
import { Client, Connection } from "@temporalio/client";

@Global()
@Module({
    providers: [
        {
            provide: Client,
            useFactory: async () => {
                const connection = await Connection.connect({
                    address: process.env.TEMPORAL_ADDRESS || "localhost:7233"
                });

                return new Client({
                    connection,
                    namespace: process.env.TEMPORAL_NAMESPACE || "default"
                });
            }
        }
    ],
    exports: [Client]
})
export class TemporalModule { }
