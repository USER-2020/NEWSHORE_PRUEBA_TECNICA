import { Transport } from "./transport.model";

export class Flight {
    transport: Transport | null;
    origin: string;
    destination: string;
    price: number;

    constructor(data: any) {
        this.transport = data.transport ? new Transport(data.transport) : null;
        this.origin = data.origin;
        this.destination = data.destination;
        this.price = data.price;
    }
}
