"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface Component {
  id: string
  name: string
  description?: string
  image_url: string
  clipboard_string: string
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [components, setComponents] = React.useState<Component[]>([])
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (open) {
      // Fetch components when dialog opens
      fetch("/api/components")
        .then((res) => res.json())
        .then((data) => setComponents(data))
        .catch(() => setComponents([]))
    }
  }, [open])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-block">Search components...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search components..." />
        <CommandList>
          <CommandEmpty>No components found.</CommandEmpty>
          {components.length > 0 && (
            <CommandGroup heading="Components">
              {components.map((component) => (
                <CommandItem
                  key={component.id}
                  value={`${component.name} ${component.description || ""}`}
                  keywords={[component.name, component.description || ""]}
                  onSelect={() => {
                    runCommand(() => {
                      router.push("/components")
                      // Scroll to component on the page after navigation
                      setTimeout(() => {
                        const element = document.querySelector(
                          `[data-component-id="${component.id}"]`
                        )
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "center" })
                          // Highlight the component briefly
                          element.classList.add("ring-2", "ring-primary")
                          setTimeout(() => {
                            element.classList.remove("ring-2", "ring-primary")
                          }, 2000)
                        }
                      }, 300)
                    })
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{component.name}</span>
                    {component.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {component.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

