<template>
  <div v-if="isLoading" class="loading-indicator">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'chat-widget-conversation-loading-indicator',
})
export default class ChatWidgetConversationLoadingIndicator extends Vue {
  @Prop({ required: true, type: Boolean })
  isLoading!: boolean;
}
</script>

<style>
@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.loading-indicator {
  @apply inline-block;
}

.loading-indicator > div {
  @apply inline-block bg-primary w-4 h-4 opacity-50 rounded-full;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.loading-indicator .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.loading-indicator .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
</style>
