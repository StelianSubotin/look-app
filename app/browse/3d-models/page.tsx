"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Box, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ThreeDModelsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Box className="h-24 w-24 text-muted-foreground" />
              <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">3D Models Coming Soon</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re working on bringing you an amazing collection of 3D models and assets.
          </p>
          <p className="text-muted-foreground mb-8">
            In the meantime, check out our growing library of Figma components.
          </p>
          <Link href="/browse/components">
            <Button size="lg">
              Browse Components
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

