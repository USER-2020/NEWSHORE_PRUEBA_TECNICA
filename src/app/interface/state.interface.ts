export interface State {
    items: any[];
    lastUpdated: Date;

    searchByPrecio(minPrecio: number, maxPrecio: number): any[];
}