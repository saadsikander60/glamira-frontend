import { redirect } from "next/navigation";

/** Legacy contact-messages admin route — use Live Chat instead. */
export default function AdminMessagesRedirectPage() {
  redirect("/admin/chat");
}
