<h1 align=center> Nano Actions </h1>

I created `Nano Actions` for the Chrome Built-in Challenge. This Chrome extension helps you take real-time notes while browsing, with the support of Gemini Nano AI. Right now, it saves notes to `Google Docs`. I'm planning to add more Google Workspace integrations as new features become available.

In the future, you might find yourself using the Nano Actions extension to quickly put together reports, presentations, and take notes

## 🚀 Requirements
Developer or Canary version of Google Chrome

## 🛠 Quick Installation
Set up the Google Docs API:

- Go to the Google Cloud Console.

  - Add the Google Docs API.

  - Generate an OAuth token for it.

 - Replace `{YOUR TOKEN GOES HERE}` with your generated token in the following JSON snippet:

```json
{
    "oauth2": {
        "client_id": "{YOUR TOKEN GOES HERE}"
        ...
    }
}
```
- Enable the following flags in Chrome:

  - Optimization Guide on Device: Enable "BypassPerfRequirement"

  - Prompt API for Gemini Nano: Enable

  - Summarization API for Gemini Nano: Enable

  - Language Detection Web Platform API: Enable

- Then install Gemini Nano.

  - Open DevTools and send `await ai.languageModel.create();` in the console.
  
  - Relaunch Chrome and Open new tab then open `chrome://components` url.

  - Comfirm that Gemini Nano is either avaliable or is beign downloaded (Download process can take time).

  - Also, visit `chrome://on-device-translation-internals/` url and install languages which you want to support.

- Open Chrome extension tab and enable developed mode.

- Select `Load unpacked` option and select `manifest.json` from file manager.

