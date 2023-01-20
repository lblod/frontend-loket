<template>
  <dl class="data-list" data-test-data-list ...attributes>
    {{yield Data}}
  </dl>
</template>

const Data = <template>
  <div class="data-list__data" ...attributes>
    <dt class="au-u-h6 au-u-medium">{{yield to="title"}}</dt>
    <dd>{{yield to="content"}}</dd>
  </div>
</template>;
