const { DebuggerConfig } = require('@jovotech/plugin-debugger');

const debuggerConfig = new DebuggerConfig({
  locales: ['en'],
  buttons: [
    {
      label: 'LAUNCH',
      input: {
        type: 'LAUNCH',
      },
    },
    {
      label: 'reserve a table',
      input: {
        intent: 'ReserveTableIntent',
      },
    },
    // ...
  ],
});

module.exports = debuggerConfig;
