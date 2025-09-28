import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/coming-soon?feature=settings");
}