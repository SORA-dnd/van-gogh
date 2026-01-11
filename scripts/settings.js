import * as swade from "./systems/swade.js";

const systemHandlers = {
  swade: swade,
};

export const registerSettings = () => {
  const bg3IconTypes = systemHandlers[game.system.id]?.bg3IconTypes || ["spell", "feat"];

  game.settings.register("van-gogh", "apiUrl", {
    name: "VAN-GOGH.Settings.ApiUrl.Name",
    hint: "VAN-GOGH.Settings.ApiUrl.Hint",
    scope: "world",
    config: true,
    type: String,
    default: "https://api.openai.com/v1/images/generations",
  });

  game.settings.register("van-gogh", "apiKey", {
    name: "VAN-GOGH.Settings.ApiKey.Name",
    hint: "VAN-GOGH.Settings.ApiKey.Hint",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  game.settings.register("van-gogh", "apiType", {
    name: "VAN-GOGH.Settings.ApiType.Name",
    hint: "VAN-GOGH.Settings.ApiType.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "image": "VAN-GOGH.Settings.ApiType.Image",
      "chat": "VAN-GOGH.Settings.ApiType.Chat"
    },
    default: "image",
  });

  game.settings.register("van-gogh", "model", {
    name: "VAN-GOGH.Settings.Model.Name",
    hint: "VAN-GOGH.Settings.Model.Hint",
    scope: "world",
    config: true,
    type: String,
    default: "dall-e-3",
  });

  game.settings.register("van-gogh", "storagePath", {
    name: "VAN-GOGH.Settings.StoragePath.Name",
    hint: "VAN-GOGH.Settings.StoragePath.Hint",
    scope: "world",
    config: true,
    type: String,
    filePicker: "folder",
    default: "",
  });

  game.settings.register("van-gogh", "imgSize", {
    name: "VAN-GOGH.Settings.ImgSize.Name",
    hint: "VAN-GOGH.Settings.ImgSize.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "256": "256x256",
      "512": "512x512",
      "1024": "1024x1024"
    },
    default: "1024",
  });

  game.settings.register("van-gogh", "bg3IconTypes", {
    name: "VAN-GOGH.Settings.BG3IconTypes.Name",
    hint: "VAN-GOGH.Settings.BG3IconTypes.Hint",
    scope: "world",
    config: true,
    type: String,
    default: bg3IconTypes.join(","),
  });
};
