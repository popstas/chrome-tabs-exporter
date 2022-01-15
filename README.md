# tabs-exporter

Send info about opened tabs to websocket server. Group by domain.

Example of data receiver - [windows-mqtt/tabs](https://github.com/popstas/windows-mqtt/blob/master/src/modules/tabs.js)

### Defaults:
- Host: localhost
- Port: 5555

Example of sending data:

```
{
  tabs: 7,
  byDomain: {
    "www.youtube.com": 1,
    "element-plus.org": 2,
    "www.npmjs.com": 1,
    "localhost:9302": 1,
    "github.com": 1,
    extensions: 1,
  },
  type: "stat",
}
```