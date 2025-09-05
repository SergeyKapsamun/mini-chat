// src/main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import WrapperChatWidjet from "./components/widgetChat/WrapperChatWidjet.vue";

// Создаем Pinia ДО создания приложения
const pinia = createPinia();

// Подготовка DOM
const mountNode = document.createElement("div");
mountNode.id = "mini-widget-vue";
document.body.appendChild(mountNode);

// Создаем и настраиваем приложение
const app = createApp(WrapperChatWidjet);

// Подключаем Pinia ПЕРЕД монтированием
app.use(pinia);
app.use(ElementPlus);

// Монтируем
app.mount("#mini-widget-vue");
