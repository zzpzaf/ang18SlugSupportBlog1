import { Component, effect, inject, OnInit, Type } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AddCompDynDirective } from './add-comp-dyn.directive';
import { HeaderComponent } from './header/header.component';
import { NavrowComponent } from './navrow/navrow.component';
import { LeftpaneComponent } from './leftpane/leftpane.component';
import { MainComponent } from './main/main.component';
import { RightpaneComponent } from './rightpane/rightpane.component';
import { FooterComponent } from './footer/footer.component';
import { ContentService } from './content.service';
import { Tile, TilesLarge, TilesMedium, TilesNoPosts, TilesSmall } from './dbObjects/blogObjects';

const ComponentName = 'AppComponent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatGridListModule,
    HeaderComponent,
    NavrowComponent,
    LeftpaneComponent,
    MainComponent,
    RightpaneComponent,
    FooterComponent,
    AddCompDynDirective,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private componentName = this.constructor.name.replace('_', '');
  public title = 'Angular18-Holy-Grail-repo1(Grid)';
  public tiles: Tile[] = [];

  private currentBreakpoint: string = '';

  private contentService = inject(ContentService);
  private noPostsPageNumber: number = 0;

  constructor() {
    effect(() => {
      this.noPostsPageNumber = this.contentService.$noPostsPageNr();
      // console.log("'>===>> ' + ComponentName + ' - ' + NoPosts Page Nr ? " + this.noPostsPageNumber);
      if (this.noPostsPageNumber === 0) {
        this.getBreakepoints();
        } else {
          this.tiles = TilesNoPosts;
        }
        // console.log('>===>> ' + ComponentName + ' - ' + "Tiles: " + JSON.stringify(this.tiles));
    });
  }

  private getBreakepoints(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => this.getTiles());
  }

  private getTiles(): void {
    if (this.noPostsPageNumber) return;
    if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.currentBreakpoint = Breakpoints.Medium;
      this.tiles = TilesMedium;
    } else if (
      this.breakpointObserver.isMatched(Breakpoints.Small) ||
      this.breakpointObserver.isMatched(Breakpoints.XSmall)
    ) {
      this.currentBreakpoint = Breakpoints.Small;
      this.tiles = TilesSmall;
    } else {
      this.tiles = TilesLarge;
    }
  }
}
