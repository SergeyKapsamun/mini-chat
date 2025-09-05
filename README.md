# 📦 Mini-Chat

**Mini-Chat** — это лёгкий виджет чата, который можно встроить на любой сайт.  
Он написан на **Vue 3 + Vite** и позволяет быстро добавить онлайн-чат для поддержки или общения с пользователями.

## ✨ Возможности
- 🔌 Простая интеграция в любой сайт  
- 💬 Компоненты чата: окно диалога, сообщения, кнопка открытия  
- 🎨 Адаптивный дизайн и SVG-иконки  
- ⚡️ Быстрая сборка на Vite  
- 🌐 Подключение API через `axios`

## 🚀 Установка и запуск

```bash
# Клонирование проекта
git clone https://github.com/your-repo/mini-chat.git
cd mini-chat/mini-chat

# Установка зависимостей
npm install

# Запуск для разработки
npm run dev

# Сборка для продакшена
npm run build

# Локальный предпросмотр сборки
npm run preview
```

## 📂 Структура проекта
```
mini-chat/
├── public/               # Статические ресурсы
├── src/
│   ├── api/              # Работа с API (axios)
│   ├── components/       # Vue-компоненты виджета
│   │   └── widgetChat/   # Основные файлы чата
│   ├── style.css         # Стили
│   └── main.ts           # Точка входа
├── test/                 # Тестовая интеграция
├── dist/                 # Скомпилированные файлы (готовые к встраиванию)
├── package.json          # Зависимости и скрипты
└── vite.config.ts        # Конфигурация Vite
```

## 🔧 Использование на сайте
После сборки (`npm run build`) у вас появится файл:

```
dist/chatrex-widget.js
```

Подключите его в вашем HTML:
```html
<script src="chatrex-widget.js"></script>
```

И виджет появится на сайте 🚀

## 🛠 Технологии
- [Vue 3](https://vuejs.org/)  
- [Vite](https://vitejs.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Axios](https://axios-http.com/)  

## 📜 Лицензия
MIT — используйте свободно.
