<template>
  <div
    :class="[
      'flex-grow flex flex-col space-y-4 px-6 py-4 overflow-y-scroll scrollbar-invisible hover:scrollbar',
    ]"
  >
    <chat-widget-conversation-part
      v-for="(part, index) in conversationParts"
      :key="index"
      :part="part"
    />
    <div v-if="quickReplies" class="self-end space-x-2 space-y-2">
        <quick-reply-display
          v-for="(quickReply, index) in quickReplies"
          :key="index"
          :quick-reply="quickReply"
          @click="onQuickReplyClick"
        />
    </div>
  </div>
</template>

<script lang="ts">
import ChatWidgetConversationPart from '@/components/conversation/ChatWidgetConversationPart.vue';
import QuickReplyDisplay from '@/components/output/QuickReplyDisplay.vue';
import { ConversationPart } from '@/types';
import { Input, InputType, QuickReplyValue, ClientEvent, ClientRequest, NormalizedOutputTemplate } from '@jovotech/client-web-vue2';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'chat-widget-conversation',
  components: { ChatWidgetConversationPart, QuickReplyDisplay },
})
export default class ChatWidgetConversation extends Vue {
  conversationParts: ConversationPart[] = [];

  get quickReplies() {
    const lastPart = this.conversationParts[this.conversationParts.length -1];
    if (lastPart && lastPart.type === 'response') {
      return lastPart.data.quickReplies;
    }
    return undefined;
  }

  mounted() {
    this.$client.on(ClientEvent.Request, this.onRequest);
    this.$client.on(ClientEvent.Output, this.onOutput);
  }

  beforeDestroy() {
    this.$client.off(ClientEvent.Request, this.onRequest);
    this.$client.off(ClientEvent.Output, this.onOutput);
  }

  scrollToBottom() {
    if (!(this.$el instanceof HTMLDivElement)) return;
    this.$el.scrollTop = this.$el.scrollHeight;
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

  private async onRequest(req: ClientRequest) {
    // LAUNCH request should not be shown as a chat bubble
    if (req.input?.type === 'LAUNCH') {
      return;
    }

    // Display the user input as a chat bubble
    this.conversationParts.push({
      type: 'request',
      data: req.input || {},
    });
    await this.$nextTick();
    this.scrollToBottom();
  }

  private async onOutput(output: NormalizedOutputTemplate) {
    this.conversationParts.push({
      type: 'response',
      data: output,
    });
    await this.$nextTick();
    this.scrollToBottom();
  }
}
</script>
