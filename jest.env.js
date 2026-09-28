process.env.NODE_ENV = 'test';
// CI sets NOTIFY_STUB for the unit test step; unit tests assert the real Notify path explicitly
delete process.env.NOTIFY_STUB;
