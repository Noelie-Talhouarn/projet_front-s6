
<template>
  <div class="ly-aside">
    <aside class="ly-aside__sidebar">Sidebar</aside>
    <main class="ly-aside__main">Contenu de la page<slot /></main>
  </div>
</template>

<style lang="scss">
.ly-aside {
    display: flex;
    flex-flow: row wrap;

    &__sidebar {
        flex: 1;
    }

    &__main {
        flex: 4;
    }
}

</style>
