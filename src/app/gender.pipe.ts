import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      default: return 'unknown';
    }
  }

}
