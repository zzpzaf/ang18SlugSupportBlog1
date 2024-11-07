import { Type } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavrowComponent } from '../navrow/navrow.component';
import { LeftpaneComponent } from '../leftpane/leftpane.component';
import { MainComponent } from '../main/main.component';
import { RightpaneComponent } from '../rightpane/rightpane.component';
import { FooterComponent } from '../footer/footer.component';

export interface Tile {
  cols: number;
  rows: number;
  text: string;
  color: string;
}

export const TilesLarge: Tile[] = [
  { text: 'header', cols: 12, rows: 2, color: 'dodgerblue' },
  { text: 'navrow', cols: 12, rows: 2, color: 'lightblue' },
  { text: 'leftpane', cols: 2, rows: 16, color: 'lightpink' },
  { text: 'main', cols: 9, rows: 16, color: 'lightgray' },
  { text: 'rightpane', cols: 1, rows: 16, color: 'lightgoldenrodyellow' },
  { text: 'footer', cols: 12, rows: 2, color: 'lightseagreen' },
];

export const TilesMedium: Tile[] = [
  { text: 'header', cols: 12, rows: 2, color: 'dodgerblue' },
  { text: 'navrow', cols: 12, rows: 2, color: 'lightblue' },
  { text: 'leftpane', cols: 2, rows: 14, color: 'lightpink' },
  { text: 'main', cols: 10, rows: 14, color: 'lightgray' },
  { text: 'rightpane', cols: 12, rows: 2, color: 'lightgoldenrodyellow' },
  { text: 'footer', cols: 12, rows: 2, color: 'lightseagreen' },
];

export const TilesSmall: Tile[] = [
  { text: 'header', cols: 12, rows: 3, color: 'dodgerblue' },
  { text: 'navrow', cols: 12, rows: 2, color: 'lightblue' },
  { text: 'leftpane', cols: 12, rows: 4, color: 'lightpink' },
  { text: 'main', cols: 12, rows: 10, color: 'lightgray' },
  { text: 'rightpane', cols: 12, rows: 2, color: 'lightgoldenrodyellow' },
  { text: 'footer', cols: 12, rows: 2, color: 'lightseagreen' },
];

export const TilesNoPosts: Tile[] = [
  { text: 'header', cols: 12, rows: 2, color: 'dodgerblue' },
  { text: 'navrow', cols: 12, rows: 2, color: 'lightblue' },
  { text: 'main', cols: 12, rows: 16, color: 'lightgray' },
  { text: 'footer', cols: 12, rows: 2, color: 'lightseagreen' },
];

interface DynLayOutComponentsType {
  [key: string]: Type<any>;
}

export const DynLayOutComponents: DynLayOutComponentsType = {
  header: HeaderComponent,
  navrow: NavrowComponent,
  leftpane: LeftpaneComponent,
  main: MainComponent,
  rightpane: RightpaneComponent,
  footer: FooterComponent,
};

export interface ICategory {
  categoryId: number;
  categoryTitle: string;
}

export interface IArticle {
  articleId: number;
  categoryId: number;
  articleTitle: string;
  articleSubTitle: string;
  articleContent: string;
  articleSlug: string;
}

export interface ISiteMenu {
  siteMenuId: number;
  siteMenuTitle: string;
}

export interface IPage {
  PageId: number;
  PageTitle: string;
  // PageContent: string
}
export const Pages: IPage[] = [
  { PageId: 1, PageTitle: 'Home' },
  { PageId: 2, PageTitle: 'About' },
  { PageId: 3, PageTitle: 'Contact' },
  // { PageId: 11, PageTitle: 'External' },
];
