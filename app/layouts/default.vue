<script setup lang="ts">


// useHead({
//   title: data.value?.title ?? 'Titre du site',
//   meta: [
//     {
//       name: 'description',
//       content: data.value?.description ?? 'Description du site'
//     }
//   ]
// })
// </script>

<template>

  <main class="pt-16 bg-night-900 text-white min-h-screen">
    <HeaderPage />
    <ToolBar />
    <slot />
    <FooterPage />
  </main>

</template>

