(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = require('process');
(window as any).process = {
  env: { DEBUG: undefined },
};
