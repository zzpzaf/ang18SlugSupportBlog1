import { inject, Injectable, signal } from '@angular/core';
import { DataService } from './data.service';
import { IArticle, ICategory, Pages } from './dbObjects/blogObjects';
import { Location } from '@angular/common';

const ComponentName = 'ContentService';

@Injectable({
  providedIn: 'root',
})
export class ContentService {

  constructor() {
    const initialPath: string =  this.location.path().trim();
    this.signalArticle(initialPath);
    if (this.$categories.length === 0) {
      // console.log('>=== uuu >> ' + ComponentName + ' *** No Categories ! ***' );
      this.signalCategories();
    }
  }

  componentName = this.constructor.name.replace('_', '');

  private dataService = inject(DataService);
  private location = inject(Location);

  public $noPostsPageNr = signal<number>(0);
  public $pageContent = signal<string>('');

  public $categories = signal<ICategory[]>([]);
  public $category = signal<ICategory>({ categoryId: 0, categoryTitle: '' });
  public $article = signal<IArticle>({
    articleId: -1,
    categoryId: -1,
    articleTitle: '',
    articleSubTitle: '',
    articleContent: '',
    articleSlug: '',
  });
  public $categoryArticles = signal<IArticle[]>([]);



  public signalCategories(): void {
    this.dataService.getCategories().subscribe((categories: ICategory[]) => {
      this.$categories.set(categories);
      // if (this.$category().categoryId === 0) this.signalCategory(1);
    });
  }

  public signalCategory(categoryId: number): void {
    this.dataService
      .getCategory(categoryId)
      .subscribe((category: ICategory) => {
        if (category) {
          this.$category.set(category);
          // console.log('>=== ccc >> ' + ComponentName + ' - ' + 'signalCategory()' + ' *  Category: * ' +  this.$category().categoryId + ' **-** ' );
          this.signalCategoryArticles(this.$category().categoryId);
        } else {
          this.$category.set({
            categoryId: 0,
            categoryTitle: 'Category Not Found!',
          });
        }
      });
  }

  public signalCategoryArticles(categoryId: number): void {
    this.dataService
      .getCategoryArticles(categoryId)
      .subscribe((categoryarticles: IArticle[]) => {
        this.$categoryArticles.set(categoryarticles);
        // console.log('>=== --- >> ' + ComponentName + ' - ' + 'signalCategoryArticles()' + ' * Before ifs * ' +  this.$article().articleId + ' **-** ' + this.$article().articleSlug);
        if (this.$article().categoryId != categoryId) this.signalArticle(this.$categoryArticles()[0].articleId);
        // console.log('>=== --- >> ' + ComponentName + ' - ' + 'signalCategoryArticles()' + '* After ifs * ' +  this.$article().articleId + ' **-** ' + this.$article().articleSlug);
      });
  }


  public signalArticle(requestedArticle: number | string): void {
    // console.log('>=== aaa >> ' + ComponentName + ' - ' + 'signalArticle()' + ' - we are going to fetch the article with id: ' +  requestedId);
    this.dataService.getArticle(requestedArticle).subscribe((article: IArticle) => {
      // console.log('>=== aaa >> ' + ComponentName + ' - ' + 'signalArticle() 1' + ' article fetched: ' + article.articleId + ' * article category ID * ' +  article.categoryId + ' * before Categoy category ID * ' + this.$category().categoryId);
      if (article) {
        this.$article.set(article);
        if (typeof(requestedArticle) === 'number' ) {
          // !!!! Update address bar with article's slug !!!!
          this.location.replaceState(this.$article().articleSlug);
        }
        this.signalCategory(this.$article().categoryId);
        // console.log('>=== aaa >> ' + ComponentName + ' - ' + 'signalArticle() 2' + ' article fetched: ' + this.$article().articleId  + ' * article category ID * ' +  this.$article().categoryId + ' * Categoy category ID * ' + this.$category().categoryId);
      } else {
        this.$article.set({
          articleId: -1,
          categoryId: -1,
          articleTitle: 'Not Found!',
          articleSubTitle: 'Article Not Found!',
          articleContent: 'Not Found!',
          articleSlug: 'Not Found!',
        });
        // console.log('>=== aaa >> ' + ComponentName + ' - ' + 'signalArticle()' + ' - ' +  JSON.stringify(this.$article()));
      }
    });
  }

 
  public signalPageContent(pageId: number): void {
    if (pageId === 0) {
      this.$noPostsPageNr.set(0);
      // console.log('>===>> ' + ComponentName + ' - ' + 'NO Page Content');
      return;
    }

    const page = Pages.find((p) => p.PageId === pageId);
    if (page) {
      this.dataService
        .getPage(page.PageTitle)
        .subscribe((htmlContent: string) => {
          if (htmlContent) {
            this.$pageContent.set(htmlContent);
            this.$noPostsPageNr.set(pageId);
          } else {
            this.$pageContent.set('HTML Page Not Found!');
          }
        });
    } else {
      this.$pageContent.set('Unknown HTML Page!');
    }
    // console.log('>===>> ' + ComponentName + ' - ' + 'Page Id: ' + this.$noPostsPageNr() + ' Content: ' + this.$pageContent());
  }
}

