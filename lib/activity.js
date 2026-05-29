import { supabase } from "@/lib/supabase";

const getLocalISODate = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const trackActivity = async (userId, type = "site_visit") => {
  const today = getLocalISODate();

  const { data, error } = await supabase
    .from("user_activity")
    .select("id")
    .eq("user_id", userId)
    .eq("activity_date", today);

  if (!error && data.length === 0) {
    await supabase.from("user_activity").insert([
      { user_id: userId, activity_date: today, type }
    ]);
  }
};

export { trackActivity };
