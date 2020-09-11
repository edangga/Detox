const detox = require('detox');
const adapter = require('detox/runners/jest/adapter');
const specReporter = require('detox/runners/jest/specReporter');
const assignReporter = require('detox/runners/jest/assignReporter');

jasmine.getEnv().addReporter(adapter);

// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
jasmine.getEnv().addReporter(specReporter);

// This will post which device has assigned to run a suite, which can be useful in a multiple-worker tests run.
// This is strictly optional.
jasmine.getEnv().addReporter(assignReporter);

beforeAll(async () => {
  await detox.init();
}, 30000);

beforeEach(async () => {
  try {
    await adapter.beforeEach();
  } catch (err) {
    await detox.cleanup();
    throw err;
  }
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});

// simulate app-is-never-ready state

const DetoxServer = require('detox/src/server/DetoxServer');

const originalFn = DetoxServer.prototype.sendAction;
DetoxServer.prototype.sendAction = function (ws, action) {
  if (action.type !== 'ready') {
    originalFn.call(this, ws, action);
  }
};
