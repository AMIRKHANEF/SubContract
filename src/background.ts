console.log('Background service worker loaded');

chrome.runtime.onInstalled.addListener(async () => {
    for (const cs of chrome.runtime.getManifest().content_scripts || []) {
        const tabs = await chrome.tabs.query({ url: cs.matches });
        for (const tab of tabs) {
            // Add this check before reloading
            if (tab.id !== undefined) {
                chrome.tabs.reload(tab.id);
            }
        }
    }
});

