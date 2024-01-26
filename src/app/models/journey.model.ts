import { Flight } from "./flight.model";

export class Journey {
    flights: Flight[];
    origin: string;
    destination: string;
    price: number;

    constructor(data: any) {
        // Inicializar flights con un arreglo vacío si data.flights no está definido
        this.flights = data.flights ? data.flights.map((flightData: any) => new Flight(flightData)) : [];
        this.origin = data.origin;
        this.destination = data.destination;
        this.price = data.price;
    }
}