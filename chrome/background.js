chrome.runtime.onMessage.addListener(function (message) {
  if (message.messageName == 'extensionUninstall') {
    chrome.management.uninstallSelf();
  }
});