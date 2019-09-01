import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';

// TODO: Replace this with your own data model type
export interface LeaderboardTableItem {
  name: string;
  atRank: number,
  atScore: number;
  ptRank: number,
  ptScore: number;
  nstRank: number,
  nstScore: number;
}

// TODO: replace this with real data from your application
export const leaderboard: LeaderboardTableItem[] = [
  { name: 'Mahesh', atRank: 1, atScore: 100, ptRank: 1, ptScore: 200, nstRank: 2, nstScore: 399},
  { name: 'Mahesh 2', atRank: 3, atScore: 120, ptRank: 2, ptScore: 200, nstRank: 1, nstScore: 400},
  { name: 'Bujji', atRank: 2, atScore: 0, ptRank: 2, ptScore: 0, nstRank: 2, nstScore: 0}
];

/**
 * Data source for the LeaderboardTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LeaderboardTableDataSource extends DataSource<LeaderboardTableItem> {
  data: LeaderboardTableItem[];
  paginator: MatPaginator;
  sort: MatSort;
  
  constructor(private route: ActivatedRoute) {
    super();
    this.data = leaderboard;
    // this.sort.active = '';
    // this.data = this.sortData(this.data);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<LeaderboardTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    
    this.sort.active = 'atRank';
    this.sort.direction = 'asc';
    this.data = this.sortData(this.data);

    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: LeaderboardTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: LeaderboardTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }
    return this.sortData(data);
  }

  private sortData(data: LeaderboardTableItem[]) {
    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'atRank': return compare(+a.atRank, +b.atRank, isAsc);
        case 'atScore': return compare(+a.atScore, +b.atScore, isAsc);
        case 'ptRank': return compare(+a.ptRank, +b.ptRank, isAsc);
        case 'ptScore': return compare(+a.ptScore, +b.ptScore, isAsc);
        case 'nstRank': return compare(+a.nstRank, +b.nstRank, isAsc);
        case 'nstScore': return compare(+a.nstScore, +b.nstScore, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
