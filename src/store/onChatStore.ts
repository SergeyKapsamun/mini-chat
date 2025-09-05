import { defineStore } from "pinia";
import axios from "axios";
import { AxiosResponse } from "axios";
import moment from "moment-timezone";

import { Messages, Chat } from "@/types/onChatTypes";
import { v4 as uuidv4 } from "uuid";

export const useOnChatStore = defineStore("onChatStore", {
  state: () => ({
    chat: {
      chat_id: null,
      integration_id: null as number | null,
      messages: [] as Messages[],
      pagination: {
        total: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
      },
    } as Chat | null,
    user_id: "",
    welcomeMessageText: "",
    statusAnimation: false,
    socket: null as WebSocket | null,
  }),

  actions: {
    async createWebSocketConnection(integration_id: number) {
      let onChat_client_id = localStorage.getItem("onChat_client_id");
      if (!onChat_client_id) {
        // Генерируем новый идентификатор клиента, если его нет
        const newClientId = uuidv4();
        localStorage.setItem("onChat_client_id", newClientId);
        onChat_client_id = newClientId;
      } else {
        this.getMessage();
      }
      try {
        // Создаем одно подключение через WebSocket
        this.socket = new WebSocket(
          `wss://socket.test/onchat?integration_id=${integration_id}&client_id=${onChat_client_id}`
        );

        // Обработчик события открытия соединения
        this.socket.onopen = () => {
          console.log("WebSocket connection established");
        };

        // Обработчик для входящих сообщений
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data);
          this.chat?.messages.push(data);
          this.statusAnimation = false;
        };

        // Обработчик ошибок
        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        // Обработчик закрытия соединения
        this.socket.onclose = () => {
          console.log("WebSocket connection closed");
          this.statusAnimation = false;
        };
      } catch (error) {
        console.error("Ошибка при подключении WebSocket:", error);
      }
    },

    // Отправка сообщения в чат через одно WebSocket-соединение
    sendMessage(text: string) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const message = {
          id: Date.now(),
          bot_id: 0,
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          source: "user",
          connection_data: {
            contact_id: localStorage.getItem("onChat_client_id") || "",
            integration_id: this.chat?.chat_id || "",
          },
          message_data: [text],
          gpt_answer: "",
        };
        if (!this.chat) {
          this.chat = {
            messages: [message],
            chat_id: uuidv4(),
            pagination: {
              total: 0,
              per_page: 10,
              current_page: 1,
              last_page: 1,
            },
          };
        } else {
          this.chat?.messages.push(message);
        }
        this.statusAnimation = true;
        this.socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket connection is not established or not open");
      }
    },
    async getMessage(page: number = 1) {
      try {
        let onChat_client_id = localStorage.getItem("onChat_client_id");
        const response: AxiosResponse = await axios.get(
          "https://app.test/api/onchat/" + onChat_client_id,
          { params: { page, user_id: this.user_id } }
        );
        if (response.status !== 200) {
          throw new Error("Status code is not 200");
        }
        const data = response.data;
        if (!data || !data.chat_id) {
          throw new Error("Invalid response data");
        }

        if (page === 1) {
          // Если это первая страница, создаем новый объект чата

          this.chat = data as Chat;
        } else {
          // Если это не первая страница, добавляем сообщения к существующему чату
          if (this.chat) {
            this.chat.messages.push(...(data.messages || []));
            this.chat.pagination = data.pagination;
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching messages:", error);
      }
    },
  },
});
