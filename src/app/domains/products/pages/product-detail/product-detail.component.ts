import {
  Component,
  inject,
  input,
  linkedSignal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment.staging';
import { MetaTagsService } from '@shared/services/meta-tags.service';
import { RelatedComponent } from '@products/components/related/related.component';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, RelatedComponent],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();

  productResource = rxResource({
    request: () => ({
      slug: this.slug(),
    }),
    loader: ({ request }) => {
      return this.productService.getOneBySlug(request.slug);
    },
  });

  $cover = linkedSignal({
    source: this.productResource.value,
    computation: (product, previousValue) => {
      if (product && product.images.length > 0) {
        return product.images[0];
      }
      return previousValue?.value;
    },
  });

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private metaTagsService = inject(MetaTagsService);

  constructor() {
    effect(() => {
      const product = this.productResource.value();
      if (product) {
        this.metaTagsService.updateMetaTags({
          title: product.title,
          description: product.description,
          image: `${environment.apiUrl}/${product.images[0]}`,
          url: `${environment.domain}/products/${product.slug}`,
        });
      }
    });
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productResource.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
