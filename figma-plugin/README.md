# Lookscout Dashboard Importer - Figma Plugin

Import dashboards created in Lookscout directly into Figma as native, editable frames.

## Installation

### Option 1: Install from Figma Community (Recommended)
1. Go to [Figma Community](https://www.figma.com/community)
2. Search for "Lookscout Dashboard Importer"
3. Click "Install"

### Option 2: Install Locally (For Development)
1. Open Figma Desktop
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. The plugin is now available in your Figma!

## Usage

1. **Create a Dashboard** in Lookscout Dashboard Builder
   - Go to [look-app-eight.vercel.app/tools/dashboard-builder](https://look-app-eight.vercel.app/tools/dashboard-builder)
   - Add components, customize, and design your dashboard

2. **Export for Figma**
   - Click **Export** → **Copy for Figma**
   - This copies the dashboard JSON to your clipboard

3. **Import in Figma**
   - Open Figma
   - Run the plugin: **Plugins** → **Lookscout Dashboard Importer**
   - Paste the JSON and click **Import Dashboard**

4. **Done!** Your dashboard is now native Figma frames you can edit!

## What Gets Imported

| Component | Figma Result |
|-----------|--------------|
| Stat Card | Frame with text layers |
| Mini Stat | Frame with badge and value |
| Line Chart | Frame with vector line |
| Bar Chart | Frame with rectangles |
| Pie Chart | Frame with ellipse |
| Data Table | Frame with table rows |
| Alert Card | Styled frame with text |

## Building the Plugin

```bash
# Install TypeScript
npm install -g typescript

# Compile the plugin
cd figma-plugin
tsc code.ts --outDir . --target ES6
```

## Publishing to Figma Community

1. Go to [Figma](https://www.figma.com) → **Plugins** → **Manage plugins**
2. Click **Create new plugin**
3. Choose **Figma design**
4. Upload the plugin files
5. Fill in the details and publish!

## Files

- `manifest.json` - Plugin configuration
- `code.ts` - Main plugin logic (TypeScript)
- `code.js` - Compiled plugin code
- `ui.html` - Plugin UI

## License

MIT - Built for Lookscout

