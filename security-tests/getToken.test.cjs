const test = require("node:test");
const assert = require("node:assert/strict");

async function getTokenWithMock(mockSupabase) {
  const {
    data: { session },
  } = await mockSupabase.auth.getSession();
  return session?.access_token || null;
}

test("returns access_token string when session exists", async () => {
  const mockSupabase = {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            access_token: "token-123",
          },
        },
      }),
    },
  };

  await assert.equal(await getTokenWithMock(mockSupabase), "token-123");
});

test("returns null when session is null", async () => {
  const mockSupabase = {
    auth: {
      getSession: async () => ({
        data: {
          session: null,
        },
      }),
    },
  };

  await assert.equal(await getTokenWithMock(mockSupabase), null);
});

test("returns null when session has no access_token", async () => {
  const mockSupabase = {
    auth: {
      getSession: async () => ({
        data: {
          session: {},
        },
      }),
    },
  };

  await assert.equal(await getTokenWithMock(mockSupabase), null);
});
