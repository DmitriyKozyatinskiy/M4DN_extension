import API from './API';

const NEW_TAB_URL = 'https://www.google.com.ua/_/chrome/newtab';
const api = new API();

chrome.webRequest.onCompleted.addListener(request => {
  const tokenPromise = api.getToken();
  const activeDevicePromise = api.getActiveDevice();
  Promise.all([ tokenPromise, activeDevicePromise ]).then(data => {
    if (!data[0]
      || !data[1]
      || !request.tabId
      || request.tabId === -1
      || request.type !== 'main_frame'
      || request.url.search(NEW_TAB_URL) !== -1) {
      return;
    }

    chrome.tabs.get(request.tabId, tab => {
      const data = {
        url: request.url,
        title: tab.title
      };
      api.saveVisit(data);
    });
  });
}, { urls: ['<all_urls>'] });

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.runtime.openOptionsPage();
  }
});
