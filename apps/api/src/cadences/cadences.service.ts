import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Cadence } from "shared";

@Injectable()
export class CadencesService {
    private cadences = new Map<string, Cadence>();

    create(cadence: Cadence) {
        if (this.cadences.has(cadence.id)) {
            throw new ConflictException("Cadence with this ID already exists");
        }

        this.cadences.set(cadence.id, cadence);
        return cadence;
    }

    findById(id: string) {
        const cadence = this.cadences.get(id);
        if (!cadence) {
            throw new NotFoundException("Cadence not found");
        }
        return cadence;
    }

    update(id: string, cadence: Cadence) {
        if (!this.cadences.has(id)) {
            throw new NotFoundException("Cadence not found");
        }

        this.cadences.set(id, cadence);
        return cadence;
    }
}
