import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import BreadCrumb from './shared/bread-crumb';
import CompactMenu from './shared/compact-menu';

<template>
  <AuToolbar @size="medium" @skin="tint" @border="bottom" as |Group|>
    <Group>
      <ul class="au-c-list-horizontal au-c-list-horizontal--small">
        <li class="au-c-list-horizontal__item">
          <AuLink @icon="arrow-left" @route="index">
            Overzicht modules
          </AuLink>
        </li>
        <li class="au-c-list-horizontal__item">
          <CompactMenu />
        </li>
        <BreadCrumb />
      </ul>
    </Group>
  </AuToolbar>
</template>
