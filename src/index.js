console.log('tabs-exporter init');

const config = {
  interval: 60000,
  excludePinned: true,
};
let ws;

//chrome.runtime.onInstalled.addListener();
setTimeout(start, 500);

function initWebsocket() {
  connect();
  ws.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(connect, 1000);
  };
}

function connect() {
  ws = new WebSocket('ws://localhost:5555');
}

function log(msg, msg2) {
  console.log(msg, msg2);
}

function start() {
  initWebsocket();

  // alarms
  chrome.alarms.create('tabs-exporter', { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener(sendWindowsInfo);

  setTimeout(sendWindowsInfo, 500);
  // should use chrome.alarms
  // setInterval(sendWindowsInfo, config.interval);
  // setTimeout(sendWindowsInfo, 60000);
}

async function sendWindowsInfo() {
  const tabs = chrome.tabs;
  let allTabs = await tabs.query({});
  if(config.excludePinned) allTabs = allTabs.filter(tab => !tab.pinned);
  log('allTabs', allTabs);

  const byDomain = {};
  for (let tab of allTabs) {
    const domain = new URL(tab.url).host;
    if (!byDomain[domain]) byDomain[domain] = 0
    byDomain[domain]++;
  }

  const data = {
    tabs: allTabs.length,
    byDomain: byDomain,
    type: 'stat',
  };

  const send = () => ws.send(JSON.stringify(data));

  if (ws.readyState !== ws.OPEN) {
    connect();
    setTimeout(send, 1000);
  }
  else {
    send();
  }
}
