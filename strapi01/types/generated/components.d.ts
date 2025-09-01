import type { Schema, Struct } from '@strapi/strapi';

export interface CategoryCategory extends Struct.ComponentSchema {
  collectionName: 'components_category_categories';
  info: {
    displayName: 'Category';
    icon: 'chartPie';
  };
  attributes: {
    category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
  };
}

export interface ReviewsReviews extends Struct.ComponentSchema {
  collectionName: 'components_reviews_reviews';
  info: {
    displayName: 'Reviews';
    icon: 'chartCircle';
  };
  attributes: {
    Content: Schema.Attribute.Text & Schema.Attribute.Required;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
    icon: 'apps';
  };
  attributes: {
    SeoDescription: Schema.Attribute.Text;
    SeoTitle: Schema.Attribute.String;
  };
}

export interface TitleTitle extends Struct.ComponentSchema {
  collectionName: 'components_title_titles';
  info: {
    displayName: 'Title';
    icon: 'archive';
  };
  attributes: {
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'category.category': CategoryCategory;
      'reviews.reviews': ReviewsReviews;
      'seo.seo': SeoSeo;
      'title.title': TitleTitle;
    }
  }
}
