<template>
  <div class="app-root">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Invariant Telecom</span>
        <div class="md-toolbar-section-end">
            <md-tabs class="md-primary" md-alignment="right">
            <md-tab id="tab-home" md-label="Docs"></md-tab>
            <md-tab id="tab-pages" md-label="Collections"></md-tab>
            <md-tab id="tab-favorites" md-label="API Reference" to="/docs/a/reference"></md-tab>
            <md-tab id="tab-posts" md-label="Team"></md-tab>
          </md-tabs>
          <md-button class="md-icon-button"><md-icon>account_circle</md-icon></md-button>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>
