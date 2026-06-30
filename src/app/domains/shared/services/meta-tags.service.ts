import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

export interface PageMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

const defaultMetadata: PageMetadata = {
  title: 'ng store',
  description: 'Angular store application',
  image: '',
  url: environment.domain,
};

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  titleService = inject(Title);
  metaService = inject(Meta);

  updateMetaTags(metadata: Partial<PageMetadata>): void {
    const metaDataToUpdate = { ...defaultMetadata, ...metadata };
    const tags = this.generateMetaDefinitions(metaDataToUpdate);

    tags.forEach(tag => this.metaService.updateTag(tag));

    this.titleService.setTitle(metaDataToUpdate.title);
  }

  private generateMetaDefinitions(metadata: PageMetadata): MetaDefinition[] {
    return [
      { name: 'title', content: metadata.title },
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:image', content: metadata.image },
      { property: 'og:url', content: metadata.url },
    ];
  }
}
