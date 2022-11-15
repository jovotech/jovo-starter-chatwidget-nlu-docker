<template>
  <div class="p-6 bg-primary text-white flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <img class="h-10" src="@/assets/logo.svg" />
      <h3 class="text-base font-bold">Jovo Sample Bot</h3>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 cursor-pointer hover:text-gray-100"
      viewBox="0 0 20 20"
      fill="currentColor"
      @click="$emit('close')"
    >
      <path
        fill-rule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'chat-widget-window-header',
  components: {},
})
export default class ChatWidgetWindowHeader extends Vue {}
</script>
