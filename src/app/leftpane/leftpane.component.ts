import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { ContentService } from '../content.service';
import { IArticle, ICategory } from '../dbObjects/blogObjects';

const ComponentName = 'LeftpaneComponent';

@Component({
  selector: 'app-leftpane',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './leftpane.component.html',
  styleUrl: './leftpane.component.scss'
})
export class LeftpaneComponent {

  constructor() {
    effect(() => {
      this.category = this.contentService.$category();
      this.listItems = this.contentService.$categoryArticles();
      if (LeftpaneComponent.prevSelectedItem >= 0 && LeftpaneComponent.prevCategoryId === this.category.categoryId ) {
        this.selectedItem = LeftpaneComponent.prevSelectedItem;
      } else {
        this.selectedItem = 0;
        LeftpaneComponent.prevSelectedItem = 0;
      }
    });
  }

  private contentService = inject(ContentService);
  // componentName = this.constructor.name.replace('_', '');

  category: ICategory = {categoryId: 0, categoryTitle: ''};
  selectedItem: number | null = null;
  listItems: IArticle[] = []; 

  static prevSelectedItem: number = -1;
  static prevCategoryId: number = -1;

  itemClicked(item: IArticle, i: number): void {
    this.selectedItem = i;
    LeftpaneComponent.prevSelectedItem = i ;
    LeftpaneComponent.prevCategoryId = item.categoryId;
    this.contentService.signalArticle(item.articleId);
  }

}
