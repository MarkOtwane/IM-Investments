import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }
    return `$${value.toFixed(2)}`;
  }
}