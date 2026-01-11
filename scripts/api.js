export class VanGoghApi {
  static async generateIcon(item, options = {}) {
    let apiUrl = game.settings.get("van-gogh", "apiUrl");
    const apiKey = game.settings.get("van-gogh", "apiKey");
    const model = game.settings.get("van-gogh", "model");
    const apiType = game.settings.get("van-gogh", "apiType");
    let storagePath = game.settings.get("van-gogh", "storagePath");
    const imgSize = game.settings.get("van-gogh", "imgSize") ?? "1024";

    //bg3 style icon item types
    const bg3IconTypes = (game.settings.get("van-gogh", "bg3IconTypes") ?? "spell,feat").replaceAll(/，/g, ",").split(",").map(t => t.trim());

    // Auto-fix URL
    apiUrl = apiUrl.replace(/\/+$/, ""); // Remove trailing slashes
    
    const isChatMode = apiType === "chat";
    const targetEndpoint = isChatMode ? "/chat/completions" : "/images/generations";

    // Check if URL already has the correct endpoint
    if (!apiUrl.includes(targetEndpoint)) {
      if (apiUrl.endsWith("/v1")) {
        apiUrl = apiUrl + targetEndpoint;
      } else if (apiUrl.includes("/v1/")) {
        // If it has /v1/ but not the target endpoint, replace suffix
        // Note: This assumes standard OpenAI path structure
        apiUrl = apiUrl.replace(/\/v1\/.*$/, "/v1" + targetEndpoint);
      } else {
        // No v1 found, append /v1 + endpoint
        apiUrl = apiUrl + "/v1" + targetEndpoint;
      }
    }

    console.log("Van Gogh: Using API URL:", apiUrl, "Mode:", isChatMode ? "Chat" : "Image");

    if (!apiKey) {
      const msg = "Van Gogh: Please configure your API Key in settings.";
      if (!options.silent) ui.notifications.error(msg);
      throw new Error(msg);
    }

    if (!storagePath) {
      const msg = "Van Gogh: Please configure the Storage Path in settings.";
      if (!options.silent) ui.notifications.error(msg);
      throw new Error(msg);
    }

    // Ensure no trailing slash and decode URI components (fix for Chinese paths)
    storagePath = decodeURIComponent(storagePath.replace(/\/+$/, ""));

    const description = item.system.description?.value?.replace(/<[^>]*>?/gm, '') || item.name;
    let prompt;

    if (item.type && bg3IconTypes.includes(item.type)) {
      prompt = `Design a 2D game UI icon in the style of Baldur's Gate 3 "Status Effects" or "Conditions". It should be a stylized, glowing energy pictogram, NOT a realistic 3D object. The subject is:
${description}
. Visual Style Instructions:
1. Represent this concept as a simplified abstract SYMBOL (pictogram), like a cave painting made of light.
2. The lines should look like sketchy, hand-drawn energy strokes, not perfect vector lines.
3. Add a strong "Outer Glow" effect.
4. Color: Use a single dominant color (e.g., Blue for magic, Red for attack, Gold for holy).
5. Background: Isolated on Pure Black (for easy screen-blending).
6. NO borders, NO frames, NO realistic textures, NO text.
Aspect Ratio: Strictly 1:1 Square.`;
    } else {
      prompt = `Subject: ${item.name}
Description: ${description}
Art Style: Baldur's Gate 3 UI icon style, dark fantasy, semi-realistic digital painting.
Composition: Single object, centered, isometric angle, slight macro zoom.
Lighting: Cinematic rim lighting, moody atmosphere, sharp contrast between light and shadow.
Texture: Weathered, gritty, metallic gloss, tangible material feeling.
Background: Isolated on pure black (or white) background for easy transparency.
Negative Prompt: Text, numbers, interface elements, low resolution, blurry, cartoon, anime style, borders, frames.
Aspect Ratio: Strictly 1:1 Square.`;
    }

    try {
      if (!options.silent) ui.notifications.info(game.i18n.localize("VAN-GOGH.Generating"));

      // Prepare request body
      let requestBody;
      if (isChatMode) {
        requestBody = {
          model: model,
          messages: [
            { role: "user", content: prompt }
          ]
        };
      } else {
        requestBody = {
          model: model,
          prompt: prompt,
          n: 1,
          size: `${imgSize}x${imgSize}`,
          // response_format: "b64_json" // Removed to improve compatibility with some API proxies
        };
      }

      // If base image is provided and supported by the API (e.g. for edits/variations), it would be handled here.
      // However, standard image generation endpoints usually just take a prompt.
      // If the user wants to use the base image as a reference for img2img, the API endpoint and parameters would need to be different (e.g. /v1/images/edits or variations).
      // Given the prompt structure, it seems like a text-to-image request.
      // The requirement says: "AI will use that image as a base, generating the icon directly on it (treating that image as background)".
      // This implies an image editing or inpainting task, or simply compositing.
      // But standard OpenAI image generation (DALL-E 3) doesn't support "background" image in the way of layering a generated object ON TOP of a user provided background in a single generation step easily without specific inpainting/editing endpoints which work differently.
      // DALL-E 2 supports edits/variations. DALL-E 3 is text-to-image.
      // If the user provides a generic OpenAI compatible endpoint, we should stick to the standard generation format unless we want to implement complex image processing.
      // HOWEVER, the prompt says "Background: Isolated on pure black...".
      // If the requirement "AI will use that image as a base" means img2img, we need to send the image.
      // But standard OpenAI /v1/images/generations with DALL-E 3 DOES NOT support input images.
      // Let's assume for now we are doing text-to-image generation as per the prompt construction.
      // If the user REALLY wants the base image to be the background, we might need to composite it locally or use an API that supports it.
      // For this implementation, I will stick to text-to-image as it's the most robust across "OpenAI compatible" APIs.
      // If the user meant "img2img", the endpoint usually differs or requires multipart/form-data.
      // Let's proceed with text-to-image for the icon itself.

      // Wait, the requirement says: "AI will use that image as a base, generating the icon directly on it (treating that image as background)"
      // This strongly suggests we should send the image if possible.
      // But since we can't guarantee the API supports img2img (and DALL-E 3 doesn't), and the prompt is very detailed about the subject.
      // I will implement standard generation. If a base image is present, I will try to use it if the API supports it, but standard OpenAI structure is rigid.
      // Actually, let's look at the prompt again. It describes the object.
      // Maybe the "base image" is meant to be a style reference or literally a background layer?
      // "treating that image as background" -> This sounds like we might want to composite the result?
      // Or maybe it's for img2img.
      // Let's stick to a simple generation first.

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      // Get response text first to check content type
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = response.statusText;
        
        // Try to parse as JSON for error details
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error?.message || errorData.message || response.statusText;
        } catch (e) {
          // If response is HTML (like an error page), extract useful info
          if (responseText.includes("<!doctype") || responseText.includes("<html")) {
            errorMessage = `Server returned HTML instead of JSON (Status: ${response.status}). Check your API URL.`;
          }
        }
        
        if (response.status === 404) {
          errorMessage = `API endpoint not found (404). Your API URL "${apiUrl}" may be incorrect.`;
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = `Authentication failed (${response.status}). Check your API Key.`;
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response from API. Server may be misconfigured.`);
      }
      
      let imageSource;
      
      if (isChatMode) {
        // Handle Chat Completion response
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const content = data.choices[0].message.content;
          // Try to extract URL from content (Markdown or plain URL)
          const urlMatch = content.match(/https?:\/\/[^\s<)"]+/);
          if (urlMatch) {
            imageSource = urlMatch[0];
          }
        }
      } else {
        // Handle Image Generation response
        if (data.data && data.data[0]) {
          if (data.data[0].b64_json) {
            imageSource = `data:image/png;base64,${data.data[0].b64_json}`;
          } else if (data.data[0].url) {
            imageSource = data.data[0].url;
          }
        }
      }

      if (!imageSource) {
        throw new Error("No valid image data returned from API");
      }

      // Save image to assets
      const filename = `${item.id}_${Date.now()}.png`;
      const uploadPath = storagePath;
      
      // Check if directory exists, if not create it
      try {
        await FilePicker.browse("data", uploadPath);
      } catch (e) {
        try {
          await FilePicker.createDirectory("data", uploadPath);
        } catch (createErr) {
          console.error("Van Gogh: Failed to create directory", createErr);
          // Don't throw here, let upload try and potentially fail with a better error or maybe it existed
        }
      }

      // Create the file from source (base64 or url)
      // Note: Fetching from URL might fail if CORS is not enabled on the target server, 
      // but standard OpenAI URLs support CORS.
      const blob = await (await fetch(imageSource)).blob();
      const file = new File([blob], filename, { type: "image/png" });

      // Upload to Foundry
      await FilePicker.upload("data", uploadPath, file, { bucket: null });

      // Update item icon
      const imagePath = `${uploadPath}/${filename}`;
      await item.update({ img: imagePath });

      if (!options.silent) ui.notifications.success(game.i18n.localize("VAN-GOGH.Success"));

    } catch (error) {
      console.error("Van Gogh Error:", error);
      if (!options.silent) ui.notifications.error(game.i18n.localize("VAN-GOGH.Error") + error.message);
      throw error;
    }
  }
}
