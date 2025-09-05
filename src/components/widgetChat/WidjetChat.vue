<template>
  <div class="widjet-chat">
    <transition name="chat">
      <div
        v-if="isOpen"
        class="chat"
        :style="{ '--scroll-color': widgetColor }"
      >
        <div class="chat__header" :style="{ backgroundColor: widgetColor }">
          <div class="chat__title">{{ chatTitle }}</div>
          <div
            v-if="chatTitleTwo && chatTitleTwo.length"
            class="chat__title chat__additional-header"
          >
            {{ chatTitleTwo }}
          </div>
          <div class="chat__subtitle-status">
            <div class="subtitle">{{ chatSubtitle }}</div>
            <div v-if="showOnlineStatus" class="status">
              {{ locale === "ru" ? "В сети" : "Online" }}
              <img src="./Union.svg" alt="check status" />
            </div>
          </div>
        </div>
        <div class="messages">
          <div class="chat__body" ref="messagesContainer">
            <transition-group
              name="message-list"
              tag="div"
              class="message-list"
            >
              <div
                ref="observerTrigger"
                v-if="messages.length"
                style="height: 1px"
              ></div>
              <WidjetDialogueMessage
                v-if="welcomeMessageText && welcomeMessageEnabled"
                :welcomeMessageText="welcomeMessageText"
                @mediaLoaded="handleMediaLoaded"
              />
              <WidjetDialogueMessage
                v-for="(message, index) in messages"
                :key="message.id"
                :message="message"
                :widgetColor="widgetColor"
                @mediaLoaded="handleMediaLoaded"
              />
              <WidjetDialogueMessage
                v-if="statusAnimation"
                :statusAnimation="statusAnimation"
                @mediaLoaded="handleMediaLoaded"
              />
            </transition-group>
            <div
              class="text-control"
              :style="{ color: widgetColor }"
              v-if="!messages.length"
            >
              {{
                locale === "ru"
                  ? "Под контролем ChatRex"
                  : "Controlled by ChatRex"
              }}
            </div>
          </div>
        </div>

        <div class="chat__send-message">
          <input
            type="text"
            v-model="value"
            :placeholder="
              locale === 'ru' ? 'Введите сообщение' : 'Enter your message'
            "
            @keypress="textareaKeypressHandler"
          />
          <img @click="sendMessage" src="./Promotion.svg" alt="" />
        </div>
      </div>
    </transition>
    <div @click="toggleChat" :class="['open-chat']">
      <span
        :style="{
          backgroundColor: !isOpen ? widgetColor : 'transparent',
          borderColor: widgetColor,
        }"
      >
        <svg
          v-if="isOpen"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.57492 4.57492C4.85621 4.29372 5.23768 4.13574 5.63542 4.13574C6.03317 4.13574 6.41463 4.29372 6.69592 4.57492L11.9999 9.87892L17.3039 4.57492C17.5868 4.30168 17.9657 4.15049 18.359 4.15391C18.7523 4.15733 19.1285 4.31508 19.4066 4.59319C19.6848 4.87131 19.8425 5.24752 19.8459 5.64082C19.8493 6.03412 19.6982 6.41302 19.4249 6.69592L14.1209 11.9999L19.4249 17.3039C19.6982 17.5868 19.8493 17.9657 19.8459 18.359C19.8425 18.7523 19.6848 19.1285 19.4066 19.4066C19.1285 19.6848 18.7523 19.8425 18.359 19.8459C17.9657 19.8493 17.5868 19.6982 17.3039 19.4249L11.9999 14.1209L6.69592 19.4249C6.41302 19.6982 6.03412 19.8493 5.64082 19.8459C5.24752 19.8425 4.87131 19.6848 4.59319 19.4066C4.31508 19.1285 4.15733 18.7523 4.15391 18.359C4.15049 17.9657 4.30168 17.5868 4.57492 17.3039L9.87892 11.9999L4.57492 6.69592C4.29372 6.41463 4.13574 6.03317 4.13574 5.63542C4.13574 5.23768 4.29372 4.85621 4.57492 4.57492Z"
            :fill="widgetColor"
          />
        </svg>
        <img v-else src="./ChatDotSquare.svg" alt="" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, watchEffect } from "vue";
import WidjetDialogueMessage from "./WidjetDialogueMessage.vue";

import type { Messages, Pagination } from "../../types/onChatTypes";

interface Chat {
  widgetColor: string;
  welcomeMessageEnabled: boolean;
  welcomeMessageText?: string;
  chatTitle: string;
  chatTitleTwo?: string;
  chatSubtitle: string;
  showOnlineStatus: boolean;
  locale: "ru" | "en";
  messages: Messages[];
  pagination: Pagination;
  statusAnimation: boolean;
}

const props = defineProps<Chat>();
const emit = defineEmits<{
  (e: "nextPage"): void;
  (e: "sendMessage", message: string): void;
}>();
const isOpen = ref(false);
const value = ref("");
const loadingMessages = ref(false);
const observerTrigger = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const prevScrollHeightRef = ref(0);
const nextPage = async () => {
  if (props.pagination.current_page < props.pagination.last_page) {
    emit("nextPage");
  }
};
const scrollMessagesToEnd = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: "auto",
    });
  }
};
const handleMediaLoaded = async () => {
  await nextTick();
  // scroll again after images have actually loaded and resized the container
  scrollMessagesToEnd();
};
const toggleChat = async () => {
  isOpen.value = !isOpen.value;
  await nextTick();
  scrollMessagesToEnd();
};
const sendMessage = async () => {
  if (!value.value.trim()) {
    return; // Не отправляем пустое сообщение
  }
  emit("sendMessage", value.value);

  value.value = "";
  await nextTick();
  scrollMessagesToEnd();
};
const textareaKeypressHandler = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};
const observeScroll = () => {
  if (observer.value) {
    observer.value.disconnect(); // Очищаем старый observer
  }
  if (!observerTrigger.value || props.messages.length === 0) {
    return;
  }

  observer.value = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        loadingMessages.value = true;

        if (props.pagination.total > props.messages.length) {
          try {
            prevScrollHeightRef.value =
              messagesContainer.value?.scrollHeight || 0;
            await nextPage();
            // loadingMessages will be handled in the watch below
          } catch (error) {
            console.error("❌ Ошибка при загрузке сообщений:", error);
          }
        }
      }
    },
    { root: messagesContainer.value, rootMargin: "100px 0px", threshold: 1 }
  );

  observer.value.observe(observerTrigger.value);
};

watchEffect(async () => {
  if (props.pagination?.current_page) {
    await nextTick();
    if (props.pagination.current_page === 1) {
      scrollMessagesToEnd();
    }

    observeScroll();
  }
});

watch(
  () => props.messages.length,
  async () => {
    if (loadingMessages.value) {
      await nextTick();
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight - prevScrollHeightRef.value;
      }
      loadingMessages.value = false;
    }
  }
),
  { immediate: true };
watch(
  () => props.statusAnimation,
  async (newValue) => {
    if (!newValue) {
      await nextTick();
      scrollMessagesToEnd();
    }
  }
);
</script>

<style lang="scss" scoped>
.widjet-chat,
.chat,
.dialogues,
.message,
.answer,
.content {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif !important;
}
.widjet-chat {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
  transform-origin: bottom right;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.chat {
  width: 271px;
  min-height: 385px;
  color: white;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #00000040;
  overflow: hidden;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 13px 18px 20px;
    cursor: default;
  }

  &__title {
    font-weight: 500;
    font-size: 12px;
  }

  &__subtitle-status {
    display: flex;
    justify-content: space-between;

    .subtitle {
      font-weight: 300;
      font-size: 10px;
    }

    .status {
      display: flex;
      gap: 5px;
      font-weight: 500;
      font-size: 10px;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    height: 288px;
    overflow-y: auto;
    .text-control {
      font-weight: 500;
      font-size: 8px;
      text-align: center;
      margin-bottom: 9px;
    }
    .message-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: auto;
      padding: 10px 5px;
    }
    .answer {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-self: flex-start;
      .time {
        align-self: flex-start;
        font-size: 10px;
        color: white;
      }
      .content {
        display: flex;
        flex-direction: column;
        background: #3f8cff;
        background: #999999;
        color: white;
        max-width: 100%;
        width: auto;
        text-align: left;
        border-radius: 3px 3px 3px 0px;
        // padding: 7px 6px 3px 11px;
        padding: 6px;
      }
      &__text {
        color: inherit;
        font-size: 14px;
      }
    }
  }

  &__send-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    border-top: 1px solid #7480944d;
    padding: 15px 22px 19px 14px;

    input {
      font-size: 12px;
      width: 100%;
      border: none;

      &:focus {
        outline: none;
      }
    }

    img {
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.25);
      }
    }
  }
}

.open-chat {
  display: flex;
  justify-content: flex-end;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    width: 47px;
    height: 42px;
    border-width: 3px;
    border-style: solid;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
<style>
.chat__body::-webkit-scrollbar {
  width: 6px;
}
.chat__body::-webkit-scrollbar-thumb {
  background-color: var(--scroll-color);
  border-radius: 3px;
}
.chat__body {
  scrollbar-color: var(--scroll-color) transparent;
  scrollbar-width: thin;
}
</style>

<style lang="scss" scoped>
.message-list-enter-active,
.message-list-leave-active {
  transition: all 0.3s ease;
}

.message-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.message-list-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.message-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
