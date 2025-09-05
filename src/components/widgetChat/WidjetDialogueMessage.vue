<template>
  <div class="dialogues">
    <div v-if="messages" class="messages">
      <div class="content" :style="{ background: widgetColor }">
        <div class="message" v-html="messages"></div>

        <div class="meta-info">
          <div class="time">{{ timeMessage }}</div>
        </div>
      </div>
    </div>

    <div v-if="answer" class="answer">
      <div class="content">
        <div class="answer__text" v-html="answer"></div>
        <div class="time">{{ timeAnswer }}</div>
      </div>
    </div>
    <div v-if="welcome_message" class="answer">
      <div class="content">
        <div class="answer__text" v-html="welcome_message"></div>
        <!-- <div class="time">{{ timeAnswer }}</div> -->
      </div>
    </div>
    <div v-if="statusAnimation" class="answer">
      <div class="content">
        <div class="loader">
          <div class="dot dot_1"></div>
          <div class="dot dot_2"></div>
          <div class="dot dot_3"></div>
        </div>
      </div>
    </div>

    <div v-if="media" v-for="(value, index) in media" :key="index">
      <el-image
        style="width: 100px; height: 100px; border-radius: 3px"
        :preview-src-list="[...media.map((item) => item.url)]"
        :initial-index="index"
        :src="value.url"
        class="media-image"
        fit="cover"
        @load="onMediaLoad"
      >
        <template #progress="{ activeIndex, total }">
          <span>{{ activeIndex + 1 + "-" + total }}</span>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup lang="ts">
// Импортируем i18n для форматирования даты/времени

import moment from "moment-timezone";
import { computed, ref } from "vue";
import { ElImage } from "element-plus";

const emit = defineEmits<{ (e: "mediaLoaded"): void }>();
const onMediaLoad = () => {
  emit("mediaLoaded");
};

export interface DialogMessage {
  id: number;
  role?: "user" | "bot";
  created_at?: string | Date; // формат даты и времени
  updated_at?: string | Date; // формат даты и времени
  message_data?: string[] | null;
  gpt_answer?: string;
  media?: { url: string; type: string }[] | null;
}

// Определяем входные параметры (props)
const props = defineProps<{
  message?: DialogMessage;
  widgetColor?: string;
  welcomeMessageText?: string;
  statusAnimation?: boolean;
}>();
const media = computed(() => {
  if (props.message?.media) {
    return props.message.media;
  } else {
    return null;
  }
});
const timeMessage = computed(() => {
  if (props.message?.created_at) {
    return formattedTime(props.message.created_at);
  } else {
    return "Время отсутствует";
  }
});
const timeAnswer = computed(() => {
  if (props.message?.updated_at) {
    return formattedTime(props.message.updated_at);
  } else {
    return "Время отсутствует";
  }
});
// Форматирование времени с помощью moment.js
const formattedTime = (date: Date | string): string => {
  const inputMoment = moment(date);
  const todayStart = moment().startOf("day");
  const inputStart = inputMoment.clone().startOf("day");

  if (inputStart.isSame(todayStart)) {
    return inputMoment.format("HH:mm");
  } else {
    return inputMoment.format("D MMM YYYY, HH:mm");
  }
};

const answer = computed(() => {
  if (props.message?.gpt_answer) {
    return formattedMessage(props.message.gpt_answer);
  } else {
    return null;
  }
});
const welcome_message = computed(() => {
  if (props.welcomeMessageText) {
    return formattedMessage(props.welcomeMessageText);
  } else {
    return null;
  }
});
const messages = computed(() => {
  if (props.message?.message_data && props.message?.message_data.length) {
    let stringMessages = "";
    props.message.message_data.forEach((message, i) => {
      if (i === 0) {
        stringMessages = formattedMessage(message);
      } else {
        stringMessages += "<br/>" + formattedMessage(message);
      }
    });
    return stringMessages;
  } else {
    return null;
  }
});

// Вычисляемое свойство для форматирования сообщения
// - Экранируем HTML-тэги
// - Превращаем ссылки в кликабельные
// - Преобразуем **текст** в жирный <strong>текст</strong>
const formattedMessage = (message: string) => {
  return message
    ?.toString()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g,
      "<a href='$&'>$&</a>"
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
};
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
.dialogues {
  display: flex;
  flex-direction: column;
  gap: 5px;
  // margin-top: auto;
  transition: all 0.3s ease;
  .content {
    font-size: 14px;

    white-space: pre-line;
    overflow-wrap: break-word;

    &:deep(strong) {
      font-size: inherit;
      color: inherit;
      font-weight: 400;
    }

    &:deep(a) {
      font-size: inherit;
      color: inherit;
    }
  }
  .message {
    // padding-right: 21px;
    font-size: inherit;
    color: white;
  }
  .meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    .human,
    .time {
      color: white;
      font-size: inherit;
    }
  }
  .messages,
  .answer {
    width: auto;
    max-width: 95%;
    transition: all 0.3s ease;
  }
  .messages {
    text-align: end;
    align-self: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    .meta-info {
      align-self: flex-end;
    }
    .content {
      display: flex;
      flex-direction: column;
      background: #3f8cff;
      color: white;
      border-radius: 3px 3px 0px 3px;
      max-width: 100%;
      text-align: right;
      padding: 6px;
    }
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

  &.bot {
    background-color: var(--chatrex-message-bot);
    border-radius: 3px 3px 3px 0;
    align-self: flex-start;
  }

  &.user {
    background-color: var(--chatrex-message-user);
    border-radius: 3px 3px 0 3px;
    align-self: flex-end;
  }
}
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
}

.dot_1 {
  animation: dotAnimation 1s infinite;
}
.dot_2 {
  animation: dotAnimation 1s infinite 0.33s;
}
.dot_3 {
  animation: dotAnimation 1s infinite 0.66s;
}

@keyframes dotAnimation {
  0% {
    transform: translateY(2px);
  }

  50% {
    transform: translateY(-2px);
  }

  100% {
    transform: translateY(2px);
  }
}
</style>
