<template>
  <div class="card-display">
    <div v-if="card.imageUrl" class="px-4 pt-5 sm:pt-6 sm:px-6">
      <img
        class="mx-auto rounded-xl w-full h-auto"
        :src="card.imageUrl"
        :alt="card.imageAlt || card.title"
        @load="$emit('image-loaded')"
      />
    </div>
    <div class="px-4 py-5 sm:p-6">
      <p class="font-semibold text-xl">{{ card.title }}</p>
      <p v-if="card.subtitle" class="text-gray-700">{{ card.subtitle }}</p>
      <p v-if="card.content" class="mt-2 text-sm">{{ card.content }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Card } from '@jovotech/output';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'card-display',
  components: {},
})
export default class CardDisplay extends Vue {
  @Prop({ required: true, type: Object })
  readonly card!: Card;
}
</script>

<style>
.card-display {
  @apply bg-white inline-flex flex-col shadow rounded-xl;
}
</style>
