/**
 * Decodes and normalizes image URLs
 * Handles URL-encoded URLs and ensures they're in the correct format
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  let normalized = url.trim()
  
  // If URL is encoded, decode it
  if (normalized.includes('%')) {
    try {
      normalized = decodeURIComponent(normalized)
    } catch (err) {
      // If decoding fails, try again with the original
      console.warn('Failed to decode URL, using original:', err)
    }
  }
  
  // Ensure it starts with / or http:// or https://
  if (!normalized.startsWith('/') && 
      !normalized.startsWith('http://') && 
      !normalized.startsWith('https://')) {
    // If it looks like it should be a URL, try to fix it
    if (normalized.includes('://')) {
      // Might be missing http/https
      normalized = 'https://' + normalized
    } else {
      // Assume it's a relative path
      normalized = '/' + normalized
    }
  }
  
  return normalized
}

