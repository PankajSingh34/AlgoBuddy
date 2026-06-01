import { supabase } from "@/lib/supabase";

const getLocalISODate = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const trackActivity = async (userId, type = "site_visit") => {
  const today = getLocalISODate();

  const { error } = await supabase
    .from("user_activity")
    .upsert(
      { user_id: userId, activity_date: today, type },
      { onConflict: "user_id, activity_date", ignoreDuplicates: true }
    );

  if (error) {
    console.error("trackActivity upsert failed:", error);
  }
};

export { trackActivity };
