import { Inject, Injectable } from '@angular/core';
import { State } from '../interface/state.interface';
import { MY_TOKEN } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService implements State {
  constructor(@Inject(MY_TOKEN) private myTokenPerzonalizasado: string) {

  }
  private matchFields: boolean = false;
  items: any[] = [];
  lastUpdated: Date = new Date;

  getCustomValue():string{
    return this.myTokenPerzonalizasado;
  }

  getMatchFields(): boolean {
    return this.matchFields;
  }

  setMatchFields(value: boolean): void {
    this.matchFields = value;
  }

  getItems(): any[] {
    return this.items;
  }

  getLastUpdated(): Date {
    return this.lastUpdated;
  }

  searchByPrecio(minPrecio: number, maxPrecio: number): any[] {
    return this.items.filter(item => item.precio >= minPrecio && item.precio <= maxPrecio);
  }
}
