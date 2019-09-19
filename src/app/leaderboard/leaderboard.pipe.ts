import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'leaderboard'
})
export class LeaderboardPipe implements PipeTransform {
  transform(value: any) {
    switch (value) {
      case 'arithmetic':
        return 'Arithmetic';
      case 'powers':
        return 'Powers';
      case 'number-sense':
        return 'Number Sense';
    }
    return value;
  }
}
