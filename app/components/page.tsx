import { redirect } from "next/navigation"

// Redirect /components to /browse/components for backwards compatibility
export default function ComponentsPage() {
  redirect("/browse/components")
}
