export interface Messages {
  id: number;
  bot_id: number;
  created_at: string;
  updated_at: string;
  source: string;
  connection_data: {
    contact_id: string;
    integration_id: string | number;
  };
  message_data?: string[];
  gpt_answer?: string;
  role?: "user" | "bot";
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
export interface Chat {
  chat_id: string | null;
  messages: Messages[];
  pagination: Pagination;
}
