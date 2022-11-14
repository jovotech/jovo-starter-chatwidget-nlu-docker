<template>
  <div class="carousel-display">
    <div v-if="carousel.title" class="px-4 pt-5 sm:pt-6 sm:px-6">
      <p class="font-thin text-2xl">{{ carousel.title }}</p>
    </div>
    <div ref="scrollContainer" class="overflow-x-auto" @wheel="scrollHorizontally">
      <!-- whitespace-nowrap allows padding in horizontal overflowing flex container -->
      <div class="px-4 py-5 sm:p-6 inline-flex whitespace-nowrap space-x-5">
        <card-display
          v-for="(card, index) in carousel.items"
          :key="index"
          class="flex-shrink-0 overflow-hidden"
          :card="card"
          @image-loaded="$emit('image-loaded')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CardDisplay from '@/components/CardDisplay.vue';
import { Carousel } from '@jovotech/output';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'carousel-display',
  components: { CardDisplay },
})
export default class CarouselDisplay extends Vue {
  @Prop({ required: true, type: Object })
  readonly carousel!: Carousel;
  scrollHorizontally(event: WheelEvent) {
    (this.$refs.scrollContainer as HTMLDivElement).scrollBy({
      left: event.deltaY,
    });
  }
}
</script>

<style>
.carousel-display {
  @apply bg-white flex flex-col shadow rounded-xl;
}
</style>