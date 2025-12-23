// Admin: Add your Figma component data here
// Each component needs:
// - id: unique identifier
// - name: display name
// - description: optional description
// - imageUrl: path to screenshot/image (place images in /public/figma-components/)
// - clipboardString: the string that will be copied when user clicks "Copy in Figma"

export interface FigmaComponentData {
  id: string
  name: string
  description?: string
  imageUrl: string
  clipboardString: string
}

export const figmaComponents: FigmaComponentData[] = [
  {
    id: "1",
    name: "Example Component 1",
    description: "This is an example component. Replace with your actual components.",
    imageUrl: "/figma-components/placeholder.svg",
    clipboardString: "PASTE_YOUR_FIGMA_CLIPBOARD_STRING_HERE_1"
  },
  {
    id: "2",
    name: "Example Component 2",
    description: "This is an example component. Replace with your actual components.",
    imageUrl: "/figma-components/placeholder.svg",
    clipboardString: "PASTE_YOUR_FIGMA_CLIPBOARD_STRING_HERE_2"
  },
  // Add more components here by copying the structure above
  // 
  // HOW TO ADD A NEW COMPONENT:
  // 1. Take a screenshot of your Figma component and save it to /public/figma-components/
  // 2. In Figma: Select your component → Right-click → "Copy/Paste as" → "Copy as"
  //    (This copies the component data to your clipboard)
  // 3. Paste that clipboard string into the clipboardString field below
  // 4. Update the imageUrl to point to your screenshot file
]

