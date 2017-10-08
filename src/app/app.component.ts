import { Component } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx'; // For methods for Observables
import {GenderPipe} from './gender.pipe';
import {PersonService} from './person.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  server = 'http://localhost:8081';
  people = [];
  private predicate;

  private currentSortColumn = '';
  private reverse = false;

  constructor(private personService:PersonService,
              private http: Http) {
  }

  /* checkSearch(term) {
    if (term.length < 2) {
      this.people = [];
    } else {
      this.https.get(this.server + '/people/' + term)
        .map((res) => res.json())
        .subscribe((response) => {
          this.people = response.people;
        });
    }
  } */

  checkSearch(term) {
    if (term.length < 2)
      this.people = [];
    else {
      this.personService.getPeople(term)
          .subscribe(people => this.people = people);
    }
  }

/*  toggleSortOrder(column) {
    if (column !== this.predicate) {
      this.predicate = column;
      this.people.sort((itemOne, itemTwo) =>
          (itemOne[column] < itemTwo[column]) ? -1 :
              (itemOne[column] > itemTwo[column]) ? 1 : 0
      );
    }
  } */

  toggleSortOrder(column: string) {
    if (column === this.currentSortColumn) {
      this.people.reverse();
      this.reverse = !this.reverse;
    } else {
      this.currentSortColumn = column;
      this.reverse = false;
      this.people.sort((itemOne, itemTwo) =>
          (itemOne[column] < itemTwo[column]) ? -1 :
              (itemOne[column] > itemTwo[column]) ? 1 : 0
      );
    }
  }

/*  arrow(column: string) {
    if (this.predicate === column) {
      return this.reverse ? '▲' : '▼';
    }
  } */

  arrow(column: string) {
    if (this.currentSortColumn === column) {
      return this.reverse ? '▲' : '▼';
    }
  }
}
