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

  <main class=" pt-16 bg-gradient-night text-slate-200">
    <HeaderPage />
    <ToolBar />
    <slot />
    <FooterPage />
  </main>

</template>

