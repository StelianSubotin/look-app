import { redirect } from "next/navigation"

// Redirect /components to / (homepage) for backwards compatibility
export default function ComponentsPage() {
  redirect("/")
}
