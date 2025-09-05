<template>
  <div class="wrapper-chat-widjet">
    <WidjetChat
      :widgetColor="config.primary_color"
      :chatTitle="config.title"
      :chatTitleTwo="config.title_two"
      :showOnlineStatus="config.show_status ?? true"
      :welcomeMessageEnabled="config.welcome_message_enabled"
      :welcomeMessageText="welcome_message"
      :chatSubtitle="config.subtitle ?? ''"
      :locale="config.locale"
      :messages="messages"
      :pagination="pagination"
      :statusAnimation="statusAnimation"
      @nextPage="nextPage"
      @sendMessage="sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from "vue";
import WidjetChat from "./WidjetChat.vue";
import { useOnChatStore } from "@/store/onChatStore";
interface Config {
  integration_id: string;
  user_id: string;
  primary_color: string;
  title: string;
  title_two?: string;
  subtitle?: string;
  welcome_message_enabled: boolean;
  welcome_message?: string;
  show_status?: boolean;
  locale: "ru" | "en";
}

const onChatStore = useOnChatStore();

const config = (window as any).ChatRexConfig as Config;

const welcome_message = computed(() => {
  return onChatStore.welcomeMessageText || "";
});
const messages = computed(() => {
  return onChatStore.chat?.messages || [];
});
const pagination = computed(() => {
  return (
    onChatStore.chat?.pagination || {
      total: 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
    }
  );
});
const nextPage = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    onChatStore.getMessage(pagination.value.current_page + 1);
  }
};
const sendMessage = (message: string) => {
  if (!onChatStore.socket) {
    console.error("WebSocket connection is not established");
    return;
  }
  onChatStore.sendMessage(message);
};
const statusAnimation = computed(() => {
  return onChatStore.statusAnimation;
});
onBeforeMount(() => {
  if (config.user_id) {
    onChatStore.user_id = config.user_id;
  }
  console.log(onChatStore.user_id);
});
onMounted(() => {
  if (!onChatStore.socket) {
    const integrationId =
      Number(config.integration_id) || Number(config.user_id);
    onChatStore.createWebSocketConnection(integrationId);
  }
  if (config.welcome_message) {
    onChatStore.welcomeMessageText = config.welcome_message;
  }
});
</script>
<style scoped lang="scss">
.wrapper-chat-widjet {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  max-width: 300px;
}
</style>
