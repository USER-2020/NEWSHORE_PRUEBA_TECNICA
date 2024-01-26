export class Transport {
    flightCarrier: String;
    flightNumber: string;

    constructor(data: any) {
        this.flightCarrier = data.flightCarrier;
        this.flightNumber = data.flightNumber;
    }
}