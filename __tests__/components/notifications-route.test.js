jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/serverApi", () => ({
  getSupabaseServerClient: jest.fn(),
  jsonResponse: (data, status = 200) => ({
    status,
    json: jest.fn().mockResolvedValue(data),
  }),
  errorResponse: (error) => ({
    status: 500,
    json: jest
      .fn()
      .mockResolvedValue({ error: error.message || "Internal server error" }),
  }),
}));

import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/serverApi";
import { PATCH } from "@/app/api/notifications/route";

function createSupabaseMock(result) {
  const builder = {
    update: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    in: jest.fn(() => builder),
    select: jest.fn(() => Promise.resolve(result)),
  };

  return {
    builder,
    supabase: {
      from: jest.fn(() => builder),
    },
  };
}

function createPatchRequest(body) {
  return {
    json: jest.fn().mockResolvedValue(body),
  };
}

describe("notifications PATCH route", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    cookies.mockResolvedValue({
      getAll: jest.fn(() => []),
      set: jest.fn(),
    });

    getAuthenticatedUser.mockResolvedValue({
      success: true,
      user: { id: "student-123" },
    });
  });

  it("returns the number of rows updated for markAll requests", async () => {
    const { builder, supabase } = createSupabaseMock({
      data: [{ id: "n1" }, { id: "n2" }],
      error: null,
      count: null,
    });
    getSupabaseServerClient.mockReturnValue(supabase);

    const response = await PATCH(createPatchRequest({ markAll: true }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, updated: 2 });
    expect(supabase.from).toHaveBeenCalledWith("notifications");
    expect(builder.update).toHaveBeenCalledWith({ read: true });
    expect(builder.eq).toHaveBeenCalledWith("student_id", "student-123");
    expect(builder.in).not.toHaveBeenCalled();
    expect(builder.select).toHaveBeenCalledWith("id");
  });

  it("returns the number of rows updated for selected notification IDs", async () => {
    const { builder, supabase } = createSupabaseMock({
      data: [{ id: "n2" }],
      error: null,
      count: null,
    });
    getSupabaseServerClient.mockReturnValue(supabase);

    const response = await PATCH(
      createPatchRequest({ notificationIds: ["n2", "", 42, "   "] })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, updated: 1 });
    expect(builder.eq).toHaveBeenCalledWith("student_id", "student-123");
    expect(builder.in).toHaveBeenCalledWith("id", ["n2"]);
    expect(builder.select).toHaveBeenCalledWith("id");
  });
});
