import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Journey } from '../models/journey.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Flight } from '../models/flight.model';
import { Transport } from '../models/transport.model';
import { InjectionToken } from '@angular/core';
import { StateManagerService } from '../services/state-manager.service';
import { MY_TOKEN } from '../environments/environments';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [StateManagerService,/*Manejo de estados*/ {
    provide: MY_TOKEN, useValue: "tokenperzonalizado"/* injectionToken */
  }],
})
export class HomeComponent implements OnInit {
  data1: any[] = [];
  data2: any[] = [];
  data3: any[] = [];
  dataNewRuta: Journey | null = null;
  formulario!: FormGroup;
  respuestaRuta: boolean = false;
  currency: string = 'USD';
  matchFields: boolean = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private stateManager: StateManagerService
  ) { }

  ngOnInit(): void {
    this.llenarData1();
    this.llenarData2();
    this.llenarData3();
    this.formulario = this.formBuilder.group({
      origin: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), this.uppercaseValidator]],
      destination: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), this.uppercaseValidator]]

    });
    this.getMyToken();

  }

  getMyToken() {
    console.warn(this.stateManager.getCustomValue());
  }

  uppercaseValidator(control: { value: string }) {
    const value = control.value;
    if (value && value !== value.toUpperCase()) {
      return { uppercase: true };
    }
    return null;
  }

  matchFieldsValidator(field1: string, field2: string) {
    console.log("entra a validator");
    if (field1 === field2) {
      console.log("Son iguales");
      this.matchFields = true;
    } else {
      this.matchFields = false;
    }
  }


  onInputChange(controlName: string) {
    let control = this.formulario.get(controlName);

    if (control) {
      control.setValue(control.value.toUpperCase());
      if (control.value.length > 3) {
        control.setValue(control.value.substr(0, 3));
      }
    }
  }

  public buscarRuta(origin: string, destination: string): Observable<Journey | null> {
    return of(this.construirRutaBFS(origin, destination)).pipe(delay(0));
  }

  //Utilzando la logica del metodo de grafos
  //Busqueda por amplitud
  private construirRutaBFS(origin: string, destination: string): Journey | null {
    const queue = [{ location: origin, route: { origin, destination, price: 0, flights: [] as Flight[] } }];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.location === destination) {
        return current.route;
      }

      visited.add(current.location);

      const flights = this.buscarVuelosDesde(current.location);

      for (const flight of flights) {
        if (!visited.has(flight.arrivalStation)) {
          const nextRoute: Journey = new Journey({
            origin: current.route.origin,
            destination: flight.arrivalStation,
            price: current.route.price + flight.price,
            flights: [
              ...current.route.flights,
              new Flight({
                origin: flight.departureStation,
                destination: flight.arrivalStation,
                price: flight.price,
                transport: new Transport({
                  flightCarrier: flight.flightCarrier,
                  flightNumber: flight.flightNumber
                })
              })
            ]
          });


          queue.push({ location: flight.arrivalStation, route: nextRoute });
        }
      }
    }

    console.log('No se puede construir la ruta completa.');
    alert('No se pudo construir la ruta completa');
    return null;
  }




  private buscarVuelosDesde(origin: string): any[] {
    return this.data3.filter(flight => flight.departureStation === origin);
  }

  onSubmit() {

    const matchFieldsState = this.stateManager.getMatchFields();
    console.log("Estado", matchFieldsState);

    this.matchFieldsValidator(this.formulario.value.origin, this.formulario.value.destination);

    // if (validationErrors) {
    //   console.error('Los campos no pueden ser iguales.');
    //   alert('los campos no pueden ser iguales');
    //   // Puedes mostrar un mensaje al usuario o realizar alguna acción adicional.
    //   return;
    // }
    if (this.formulario.valid && this.matchFields === false) {
      const origin = this.formulario.value.origin;
      const destination = this.formulario.value.destination;

      // Realiza la lógica de búsqueda de ruta aquí
      this.buscarRuta(origin, destination).subscribe(
        (data) => {
          if (data) {
            this.dataNewRuta = data;
            console.log('Ruta obtenida:', this.dataNewRuta);
            this.respuestaRuta = true;  // Establece la respuestaRuta a true si hay una ruta válida
          } else {
            console.error('No se encontró una ruta para los datos proporcionados.');
            alert("No se encontro una ruta para los datos proporcionados");
            this.respuestaRuta = false;  // Establece la respuestaRuta a false si no hay una ruta válida
          }
        },
        (error) => {
          console.error('Error al obtener la ruta:', error);
          this.respuestaRuta = false;  // Maneja el error y establece respuestaRuta a false
        }
      );
    } else {
      // Manejar el caso cuando el formulario no es válido
      console.error('Formulario no válido.');
      this.respuestaRuta = false;  // Establece respuestaRuta a false en caso de formulario inválido
    }
  }

  calcularTotal(): number {
    if (this.dataNewRuta && this.dataNewRuta.flights) {
      return this.dataNewRuta.flights.reduce((total, ruta) => total + ruta.price, 0);
    } else {
      return 0;
    }
  }

  calcularTotalCOP(): number {
    if (this.dataNewRuta && this.dataNewRuta.flights) {
      return this.dataNewRuta.flights.reduce((total, ruta) => total + (ruta.price * 3939.25), 0);
    } else {
      return 0;
    }
  }

  calcularTotalEUR(): number {
    if (this.dataNewRuta && this.dataNewRuta.flights) {
      return this.dataNewRuta.flights.reduce((total, ruta) => total + (ruta.price * 0.92), 0);
    } else {
      return 0;
    }
  }
  changueVisibility(event: Event) {
    event.preventDefault();
    console.log("boton clikeado");
    this.respuestaRuta = false;
  }

  onChangeCurrency(event: any) {
    const selectedCurrency = event.target.value;
    this.changuePrice(selectedCurrency);
  }

  changuePrice(currency: string) {
    if (this.dataNewRuta && this.dataNewRuta.flights) {
      return this.currency = currency;
    } else {
      return 0;

    }
  }



  llenarData1() {
    const cachedData = localStorage.getItem('data1');
    if (cachedData) {
      this.data1 = JSON.parse(cachedData);
      console.log("Informacion desde la caché (data1)", this.data1);
    } else {
      this.apiService.getData1().subscribe(data => {
        this.data1 = data;
        console.log("Informacion desde la api_1", this.data1);
        localStorage.setItem('data1', JSON.stringify(data));
      }, error => {
        console.log("Error al obtner datos", error);
      });
    }
  }

  llenarData2() {
    const cachedData = localStorage.getItem('data2');
    if (cachedData) {
      this.data2 = JSON.parse(cachedData);
      console.log("Informacion desde la caché (data2)", this.data2);
    } else {
      this.apiService.getData2().subscribe(data => {
        this.data2 = data;
        console.log("Informacion desde la api_2", this.data2);
        localStorage.setItem('data2', JSON.stringify(data));
      });
    }
  }

  llenarData3() {
    const cachedData = localStorage.getItem('data3');
    if (cachedData) {
      this.data3 = JSON.parse(cachedData);
      console.log("Informacion desde la caché (data3)", this.data3);
    } else {
      this.apiService.getData3().subscribe(data => {
        this.data3 = data;
        console.log("Informacion desde la api_3", this.data3);
        localStorage.setItem('data3', JSON.stringify(data));
      });
    }
  }
}
