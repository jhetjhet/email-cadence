// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from "@nestjs/common";
import { EnrollmentsModule } from "./enrollments/enrollments.module";
import { TemporalModule } from "./temporal/temporal.module";
import { CadencesModule } from "./cadences/cadences.modules";

@Module({
  imports: [
    TemporalModule,
    CadencesModule,
    EnrollmentsModule
  ]
})
export class AppModule { }
