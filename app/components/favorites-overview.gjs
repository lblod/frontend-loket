import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { remapWebsiteUrl } from 'frontend-loket/utils/remap-website-url';
import StarFilled from 'frontend-loket/components/icons/star-filled';
import { getPublicServiceCta } from 'frontend-loket/utils/get-public-service-cta';
import { Await } from '@warp-drive/ember';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';

export default class FavoritesOverview extends Component {
  @service('bookmarks') bookmarksService;
  @service toaster;

  @cached
  get favoritesPromise() {
    return (async () => {
      await this.bookmarksService.load();

      let errorLoadingFavorite = false;
      let favoritesData = [];

      try {
        const favorites = this.bookmarksService.bookmarks
          .map((bookmark) => bookmark.object)
          .sort((a, b) => compare(a.name.default, b.name.default));

        favoritesData = await Promise.all(
          favorites.map(async (product) => {
            try {
              const callToAction = await getPublicServiceCta(product);
              return { product, website: callToAction };
            } catch (err) {
              console.error(err);
              errorLoadingFavorite = true;
              return {};
            }
          }),
        );
      } catch (err) {
        console.error(err);
        errorLoadingFavorite = true;
      }

      if (errorLoadingFavorite) {
        const errorMsg = `
      U kan het product of de dienst
        proberen terug te vinden via de reguliere zoekfunctie.
      Gelieve de helpdesk te contacteren
        indien u blijvende hinder ondervindt.
    `;
        const errorTitle = `Probleem bij
     het ophalen van minstens één favoriet.`;

        this.toaster.error(errorMsg, errorTitle);
      }

      return favoritesData;
    })();
  }

  <template>
    <div class="favorites-container au-u-margin-top-large" ...attributes>
      <AuHeading @level="2" @skin="3">Favoriete producten of diensten</AuHeading>
      <Await @promise={{this.favoritesPromise}}>
        <:pending>
          <AuLoader class="au-o-box">Favorieten aan het laden</AuLoader>
        </:pending>

        <:success as |favorites|>
          {{#if favorites.length}}
            <ul
              class="au-u-flex au-u-flex--wrap au-u-flex--spaced-tiny au-u-padding-top-tiny au-u-padding-bottom-large"
            >
              {{#each favorites as |favorite|}}
                <li class="favorite-card">
                  <AuIcon
                    @icon={{StarFilled}}
                    @alignment="left"
                    @size="large"
                  />
                  {{#if favorite.website.url}}
                    <AuLinkExternal
                      @skin="naked"
                      href={{remapWebsiteUrl favorite.website.url}}
                      class="favorite-title au-u-medium"
                      title={{favorite.product.name.default}}
                    >
                      {{favorite.product.name.default}}
                    </AuLinkExternal>
                    <AuLinkExternal
                      href={{remapWebsiteUrl favorite.website.url}}
                      class="c-link--icon-medium"
                      @skin="button-naked"
                      @icon="external-link"
                      @iconAlignment="right"
                    />
                  {{else}}
                    <AuLink
                      @skin="naked-button"
                      class="favorite-title au-u-medium"
                      {{on "click" (fn @onSelect favorite.product)}}
                    >
                      {{favorite.product.name.default}}
                    </AuLink>
                  {{/if}}
                </li>
              {{/each}}
            </ul>
          {{else}}
            <AuAlert
              @title="U heeft momenteel geen favorieten"
              @skin="info"
              @icon="circle-info"
              @size="small"
              class="au-u-margin-top-small"
            >
              <p>
                Bekijk al onze services en klik op de ster om uw eerste toe te
                voegen.
              </p>
              <AuLink
                @route="search"
                @skin="button"
                class="au-u-margin-top-small"
              >
                Alle diensten
              </AuLink>
            </AuAlert>
          {{/if}}
        </:success>
      </Await>
    </div>
  </template>
}
