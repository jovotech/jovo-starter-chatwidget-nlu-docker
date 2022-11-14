<template>
  <button class="quick-reply-display inline-flex items-center border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed ml-auto rounded-full border-transparent text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 px-4 py-2 text-sm rounded-md" @click="$emit('click', quickReply)">
    <p>
      {{ text }}
    </p>
  </button>
</template>

<script lang="ts">
import { QuickReplyValue } from '@jovotech/output';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'quick-reply-display',
  components: {},
})
export default class QuickReplyDisplay extends Vue {
  @Prop({ required: true, type: [Object, String] })
  readonly quickReply!: QuickReplyValue;
  get text(): string {
    return typeof this.quickReply === 'string' ? this.quickReply : this.quickReply.text;
  }
}
</script>

<style>
</style>
Footer
