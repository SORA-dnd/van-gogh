# Van Gogh - AI Icon Generator for Foundry VTT

**Van Gogh** is a Foundry VTT module that leverages AI to generate high-quality, style-consistent icons for your items, spells, and features directly within the game.

**Van Gogh** 是一个 Foundry VTT 模组，利用 AI 直接在游戏中为您的物品、法术和特性生成高质量、风格统一的图标。

工作台按钮位于右侧的“日志文本”
The Workbench button is located in the "Journal Entry" on the right.

## Features / 功能

- **AI-Powered Generation**: Uses OpenAI's DALL-E 3 or compatible APIs to create unique icons based on item descriptions.
  - **AI 驱动生成**：使用 OpenAI 的 DALL-E 3 或兼容 API，根据物品描述创建独特的图标。
- **Style Consistency**: Prompts are optimized for Baldur's Gate 3 style UI icons (dark fantasy, isometric, semi-realistic).
  - **风格统一**：提示词针对《博德之门 3》风格的 UI 图标进行了优化（黑暗奇幻、等距视角、半写实）。
- **Flexible API Support**: Supports both standard Image Generation endpoints (`/v1/images/generations`) and Chat Completion endpoints (`/v1/chat/completions`) for broader compatibility with various AI providers.
  - **灵活的 API 支持**：支持标准图像生成端点 (`/v1/images/generations`) 和对话补全端点 (`/v1/chat/completions`)，以广泛兼容各种 AI 提供商。
- **Batch Processing**: A dedicated workbench allows you to queue and generate icons for multiple items at once.
  - **批量处理**：专用的工作台允许您排队并一次性为多个物品生成图标。
- **Seamless Integration**: Generated images are automatically saved to your server and applied to the items.
  - **无缝集成**：生成的图像会自动保存到您的服务器并应用到物品上。

## Configuration / 配置

Go to `Game Settings` -> `Configure Settings` -> `Module Settings` -> `Van Gogh` to configure:
前往 `游戏设置` -> `配置设置` -> `模组设置` -> `Van Gogh` 进行配置：

1.  **API URL**: The base URL of your AI provider (e.g., `https://api.openai.com/v1` or a custom proxy like `http://xxxxx/v1`).
    - **API 地址**：您的 AI 提供商的基础 URL（例如 `https://api.openai.com/v1` 或自定义代理如 `http://xxxxx/v1`）。
2.  **API Key**: Your secret API key.
    - **API 密钥**：您的秘密 API 密钥。
3.  **API Type**: Choose between "Image Generation" (default) or "Chat Completion" depending on your provider's capabilities.
    - **API 类型**：根据您的提供商的功能，在“图像生成”（默认）或“对话补全”之间进行选择。
4.  **Model**: The model name to use (e.g., `dall-e-3`).
    - **模型**：要使用的模型名称（例如 `dall-e-3`）。


## Requirements / 需求

- Foundry VTT v13+
- An active internet connection
- Access to an OpenAI-compatible API service

---

*Disclaimer: This module sends item names and descriptions to a third-party AI service. Please ensure you comply with the service's terms of use.*
*免责声明：此模组会将物品名称和描述发送到第三方 AI 服务。请确保您遵守该服务的使用条款。*

