import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityColor'
})
export class PriorityColorPipe implements PipeTransform {

 transform(priority: 'high' | 'medium' | 'low' | 'none'): string {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  }

}
