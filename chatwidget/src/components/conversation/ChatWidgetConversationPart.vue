<template>
  <div class="max-w-3/4 inline" :class="isRequest ? 'self-end' : 'self-start'">
    <message-display
      v-if="isRequest"
      class="bg-primary text-white my-2"
      :message="part.data.text || part.data.type"
    />
    <output-template-display v-else :output="part.data" />
  </div>
</template>

<script lang="ts">
import { ConversationPart } from '@/types';
import { Input, InputType, QuickReplyValue } from '@jovotech/client-web-vue2';
import OutputTemplateDisplay from '@/components/output/OutputTemplateDisplay.vue';
import MessageDisplay from '@/components/output/MessageDisplay.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'chat-widget-conversation-part',
  components: {
    MessageDisplay,
    OutputTemplateDisplay,
  },
})
export default class ChatWidgetConversationPart extends Vue {
  @Prop({ required: true, type: Object })
  part!: ConversationPart;

  get isRequest(): boolean {
    return this.part.type === 'request';
  }

  onQuickReplyClick(quickReply: QuickReplyValue) {
    const input: Input =
      typeof quickReply === 'string'
        ? { type: InputType.Text, text: quickReply }
        : quickReply.intent
        ? {
            type: InputType.Intent,
            text: quickReply.value || quickReply.text,
            intent: quickReply.intent,
            entities: quickReply.entities,
          }
        : { type: InputType.Text, text: quickReply.value || quickReply.text };

    return this.$client.send(input); // @see https://www.jovo.tech/marketplace/client-web#send-a-request-to-jovo
  }
}
</script>
