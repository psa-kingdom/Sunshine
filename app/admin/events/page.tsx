import { redirect } from "next/navigation";

export default function AdminEventsRedirect() {
  redirect("/admin/announcements");
}
