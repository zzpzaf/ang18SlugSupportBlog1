import { inject, Injectable, signal } from '@angular/core';
import { DataService } from './data.service';
import { IArticle, ICategory, Pages } from './dbObjects/blogObjects';

const ComponentName = 'ContentService';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor() { 
    if (this.$categories.length === 0) this.signalCategories();
    if (this.$categoryArticles().length === 0) this.signalCategoryArticles(1);
  }

  private dataService = inject(DataService);

  componentName = this.constructor.name.replace('_', '');

  public $noPostsPageNr = signal<number>(0);
  public $pageContent = signal<string>('');

  public $categories = signal< ICategory[]>([]); 
  public $category = signal< ICategory>({categoryId: 0, categoryTitle: ''});
  public $article = signal< IArticle>({articleId: 0, categoryId: 0, articleTitle: '', articleSubTitle: '', articleContent:  ''});
  public $categoryArticles = signal< IArticle[]>([]); 



  public signalCategories(): void {
    this.dataService.getCategories().subscribe((categories: ICategory[]) => {
      this.$categories.set(categories);
      if (this.$category().categoryId === 0) this.signalCategory(1);
    });
  }

  public signalCategory(categoryId:number): void {
    this.dataService.getCategory(categoryId).subscribe((category: ICategory) => {
      if (category) {
        this.$category.set(category);
        this.signalCategoryArticles( this.$category().categoryId);
      } else {
        this.$category.set({categoryId: 0, categoryTitle: "Category Not Found!"});
      }
    });   
  }

  public signalCategoryArticles(categoryId: number): void {
    this.dataService.getCategoryArticles(categoryId).subscribe((categoryarticles: IArticle[]) => {
      this.$categoryArticles.set(categoryarticles);
      this.signalArticle(this.$categoryArticles()[0].articleId);
    });
  }

  public signalArticle(articleId:number): void {
    this.dataService.getArticle(articleId).subscribe((article: IArticle) => {
      if (article) {
        this.$article.set(article);
      } else {
        this.$article.set({articleId: 0, categoryId: 0, articleTitle: "Not Found!", articleSubTitle: "Article Not Found!", articleContent: "Not Found!"});
      }
    });   
  }

  public signalPageContent(pageId: number): void {
    if (pageId === 0) {
      this.$noPostsPageNr.set(0);
      console.log('>===>> ' + ComponentName + ' - ' + 'NO Page Content');
      return;
    }

    // if (pageId > 10) {
    //   this.$noPostsPageNr.set(pageId);
    //   console.log('External HTML Page');
    //   return;
    // }

    const page = Pages.find((p) => p.PageId === pageId);
    // if (page) {
    //   this.$pageContent.set(page.PageContent);
    //   this.$noPostsPageNr.set(pageId);
    // } else {
    //   this.$pageContent.set('Unknown Page!');
    // }

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
