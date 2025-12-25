"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, ArrowLeft, Wrench, FileText } from "lucide-react"
import { getArticleBySlug, getRelatedArticles } from "@/data/academy-articles"
import { categories } from "@/data/academy-articles"

interface PageProps {
  params: {
    slug: string
  }
}

export default function ArticlePage({ params }: PageProps) {
  const router = useRouter()
  const article = getArticleBySlug(params.slug)
  
  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button onClick={() => router.push('/academy')}>
            Back to Academy
          </Button>
        </div>
      </div>
    )
  }

  const category = categories.find(c => c.id === article.category)
  const relatedArticles = getRelatedArticles(article.id)

  // Convert markdown-style content to HTML-safe paragraphs
  const renderContent = (content: string) => {
    const sections = content.split('\n\n')
    return sections.map((section, index) => {
      // Heading detection
      if (section.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {section.replace('## ', '')}
          </h2>
        )
      }
      if (section.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
            {section.replace('### ', '')}
          </h3>
        )
      }
      
      // Bold text detection
      const hasBold = section.includes('**')
      if (hasBold) {
        const parts = section.split('**')
        return (
          <p key={index} className="mb-4 leading-relaxed text-muted-foreground">
            {parts.map((part, i) => (
              i % 2 === 0 ? part : <strong key={i} className="font-semibold text-foreground">{part}</strong>
            ))}
          </p>
        )
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 leading-relaxed text-muted-foreground">
          {section}
        </p>
      )
    })
  }

  const toolNames: Record<string, string> = {
    'palette-generator': 'Palette Generator',
    'contrast-checker': 'Contrast Checker',
    'style-matcher': 'Style Matcher',
    'component-finder': 'Component Finder',
    'design-system-generator': 'Design System Generator'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/academy')}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Academy
        </button>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded">
              {category?.name}
            </span>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Article
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {renderContent(article.content)}
        </div>

        {/* Related Tools */}
        {article.relatedTools && article.relatedTools.length > 0 && (
          <Card className="mb-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Try Related Tools
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Put this knowledge into practice with our free tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.relatedTools.map((tool) => (
                      <Button
                        key={tool}
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tools/${tool}`)}
                        className="bg-white dark:bg-blue-900"
                      >
                        {toolNames[tool]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              <h3 className="text-xl font-bold">Related Articles</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedArticles.map((related) => {
                const relatedCategory = categories.find(c => c.id === related.category)
                return (
                  <Card
                    key={related.id}
                    className="cursor-pointer hover:shadow-lg transition-all group"
                    onClick={() => router.push(`/academy/${related.slug}`)}
                  >
                    <CardContent className="pt-6">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                        {relatedCategory?.name}
                      </span>
                      <h4 className="font-semibold mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.excerpt}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {related.readTime} min read
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <h3 className="text-xl font-bold mb-2">Continue Learning</h3>
              <p className="text-muted-foreground mb-4">
                Explore more articles to master design fundamentals
              </p>
              <Button onClick={() => router.push('/academy')}>
                Browse All Articles
              </Button>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}

