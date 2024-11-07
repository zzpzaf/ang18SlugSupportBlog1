import { inject, Injectable, signal } from '@angular/core';
import { DataService } from './data.service';
import { IArticle, ICategory, Pages } from './dbObjects/blogObjects';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

const ComponentName = 'ContentService';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor() {
    if (this.$categories.length === 0) this.signalCategories();
    if (this.$categoryArticles().length === 0) this.signalCategoryArticles(1);

    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.currentPath = this.router.url; // Updates path on navigation changes
    //     console.log('>===>> ' + ComponentName + ' - ' +"Browser's URL path: " + this.currentPath);
    //   });

    // Capture the current browser's URL path
    this.currentPath = this.location.path();
    console.log('>===>> ' + ComponentName + ' - ' + "Initial path: " + this.currentPath);

    // Subscribe to URL changes reactively
    this.location.onUrlChange((url: string) => {
      console.log("URL changed to: " + this.currentPath);
      console.log('>===>> ' + ComponentName + ' - ' + "URL path: changed to:" + this.currentPath);
      // The url returned is normalized and it always begins with '/' - so we have to remove it
      // because we already use it in calling backend endpoint
      this.currentPath = url.slice(1);
      if (this.currentPath.trim().length > 1)  {
        this.signalArticle(this.currentPath);
      }
    });


  }

  private dataService = inject(DataService);
  // private router = inject(Router);
  // private activeRoute = inject(ActivatedRoute);
  private location = inject(Location);

  componentName = this.constructor.name.replace('_', '');

  public $noPostsPageNr = signal<number>(0);
  public $pageContent = signal<string>('');

  private currentPath: string;

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
      if (this.$category().categoryId === 0) this.signalCategory(1);
    });
  }

  public signalCategory(categoryId: number): void {
    this.dataService
      .getCategory(categoryId)
      .subscribe((category: ICategory) => {
        if (category) {
          this.$category.set(category);
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
        // let existArtcle: IArticle =this.$article();
        if (this.currentPath?.trim().length == 0) {
          this.signalArticle(this.$categoryArticles()[0].articleId);
        }
      });
  }

  public signalArticle(requestedArticle: number | string): void {
    console.log('>===>> ' + ComponentName + ' - ' + 'signalArticle()' + ' - ' +  requestedArticle);
    this.dataService.getArticle(requestedArticle).subscribe((article: IArticle) => {
      // console.log('>===>> ' + ComponentName + ' - ' + 'signalArticle()' + ' *-* ' +  JSON.stringify(article));
      console.log('>===>> ' + ComponentName + ' - ' + 'signalArticle()' + ' *-* ' +  article.articleId + ' *-* ' + article.articleSlug);
      if (article) {
        this.$article.set(article);
        
      } else {
        this.$article.set({
          articleId: -1,
          categoryId: -1,
          articleTitle: 'Not Found!',
          articleSubTitle: 'Article Not Found!',
          articleContent: 'Not Found!',
          articleSlug: 'Not Found!',
        });
        console.log('>===>> ' + ComponentName + ' - ' + 'signalArticle()' + ' - ' +  JSON.stringify(this.$article()));
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
