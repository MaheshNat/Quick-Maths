import { AfterViewInit, Component, OnInit, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { LeaderboardTableDataSource, LeaderboardTableItem } from './leaderboard-table-datasource';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leaderboard-table',
  templateUrl: './leaderboard-table.component.html',
  styleUrls: ['./leaderboard-table.component.css']
})
export class LeaderboardTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<LeaderboardTableItem>;
  dataSource: LeaderboardTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'atRank', 'atScore', 'ptRank', 'ptScore', 'nstRank', 'nstScore'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.dataSource = new LeaderboardTableDataSource(this.route);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
