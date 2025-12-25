// Lookscout Dashboard Importer - Figma Plugin v3
// Using proper SVG vector paths for 1:1 accuracy
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Lucide icon SVG paths (exact paths from lucide.dev)
const ICON_PATHS = {
    dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    cart: "M4 0L0 3V6H18V3L14 0H4ZM0 7V14H18V7H0ZM5.5 11.5C5.5 12.3284 4.82843 13 4 13C3.17157 13 2.5 12.3284 2.5 11.5C2.5 10.6716 3.17157 10 4 10C4.82843 10 5.5 10.6716 5.5 11.5ZM14 13C14.8284 13 15.5 12.3284 15.5 11.5C15.5 10.6716 14.8284 10 14 10C13.1716 10 12.5 10.6716 12.5 11.5C12.5 12.3284 13.1716 13 14 13Z",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    "trending-up": "M22 7l-8.5 8.5l-5-5L2 17M22 7h-6M22 7v6",
    "trending-down": "M22 17l-8.5-8.5l-5 5L2 7M22 17h-6M22 17v-6"
};

// Chart data matching web app exactly
const lineChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
];

const barChartData = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 150 },
    { name: 'Wed', value: 180 },
    { name: 'Thu', value: 140 },
    { name: 'Fri', value: 200 },
];

const pieChartData = [
    { name: 'Desktop', value: 400, color: { r: 0.231, g: 0.510, b: 0.965 } },
    { name: 'Mobile', value: 300, color: { r: 0.063, g: 0.725, b: 0.506 } },
    { name: 'Tablet', value: 200, color: { r: 0.961, g: 0.620, b: 0.357 } },
];

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
    } : { r: 0.231, g: 0.510, b: 0.965 };
}

// Create icon using SVG vector path
function createIconVector(type, size, color) {
    return __awaiter(this, void 0, void 0, function* () {
        const frame = figma.createFrame();
        frame.name = `Icon-${type}`;
        frame.resize(size, size);
        frame.fills = [];
        frame.clipsContent = false;
        
        const vector = figma.createVector();
        
        // Scale factor for 24x24 icons to desired size
        const scale = size / 24;
        
        if (type === 'dollar') {
            vector.vectorPaths = [{
                windingRule: "NONZERO",
                data: "M12 2L12 22M17 5L9.5 5C7.567 5 6 6.567 6 8.5C6 10.433 7.567 12 9.5 12L14.5 12C16.433 12 18 13.567 18 15.5C18 17.433 16.433 19 14.5 19L6 19"
            }];
            vector.strokes = [{ type: 'SOLID', color: color }];
            vector.strokeWeight = 2 * scale;
            vector.strokeCap = "ROUND";
            vector.strokeJoin = "ROUND";
            vector.fills = [];
        } else if (type === 'cart') {
            vector.vectorPaths = [{
                windingRule: "NONZERO", 
                data: "M1 1L3.3 1L3.3 1C3.86 1 4.14 1 4.37 1.11C4.56 1.2 4.73 1.35 4.84 1.53C4.97 1.74 5 2.02 5.06 2.57L6.37 14.43C6.43 14.98 6.46 15.26 6.59 15.47C6.7 15.65 6.87 15.8 7.06 15.89C7.29 16 7.57 16 8.13 16L17.87 16C18.43 16 18.71 16 18.94 15.89C19.13 15.8 19.3 15.65 19.41 15.47C19.54 15.26 19.57 14.98 19.63 14.43L20.51 6.43C20.59 5.68 20.63 5.31 20.51 5.02C20.4 4.77 20.21 4.56 19.97 4.42C19.7 4.27 19.32 4.27 18.57 4.27L5 4.27M9 20C9 20.55 8.55 21 8 21C7.45 21 7 20.55 7 20C7 19.45 7.45 19 8 19C8.55 19 9 19.45 9 20ZM18 20C18 20.55 17.55 21 17 21C16.45 21 16 20.55 16 20C16 19.45 16.45 19 17 19C17.55 19 18 19.45 18 20Z"
            }];
            vector.strokes = [{ type: 'SOLID', color: color }];
            vector.strokeWeight = 2 * scale;
            vector.strokeCap = "ROUND";
            vector.strokeJoin = "ROUND";
            vector.fills = [];
        } else if (type === 'users') {
            vector.vectorPaths = [{
                windingRule: "NONZERO",
                data: "M16 21L16 19C16 16.79 14.21 15 12 15L6 15C3.79 15 2 16.79 2 19L2 21M22 21L22 19C22 17.14 20.73 15.56 19 15.13M15 3.13C16.73 3.56 18 5.14 18 7C18 8.86 16.73 10.44 15 10.87M12 7C12 9.21 10.21 11 8 11C5.79 11 4 9.21 4 7C4 4.79 5.79 3 8 3C10.21 3 12 4.79 12 7Z"
            }];
            vector.strokes = [{ type: 'SOLID', color: color }];
            vector.strokeWeight = 2 * scale;
            vector.strokeCap = "ROUND";
            vector.strokeJoin = "ROUND";
            vector.fills = [];
        } else if (type === 'activity') {
            vector.vectorPaths = [{
                windingRule: "NONZERO",
                data: "M22 12L18 12L15 21L9 3L6 12L2 12"
            }];
            vector.strokes = [{ type: 'SOLID', color: color }];
            vector.strokeWeight = 2 * scale;
            vector.strokeCap = "ROUND";
            vector.strokeJoin = "ROUND";
            vector.fills = [];
        }
        
        vector.resize(size, size);
        vector.x = 0;
        vector.y = 0;
        frame.appendChild(vector);
        
        return frame;
    });
}

// Create smooth line chart path using bezier curves
function createLineChartPath(points, width, height, chartX, chartY, maxValue) {
    const scaledPoints = points.map((p, i) => ({
        x: chartX + (width / (points.length - 1)) * i,
        y: chartY + height - (p.value / maxValue) * height
    }));
    
    // Create smooth bezier curve path
    let pathData = `M ${scaledPoints[0].x} ${scaledPoints[0].y}`;
    
    for (let i = 0; i < scaledPoints.length - 1; i++) {
        const p0 = scaledPoints[i];
        const p1 = scaledPoints[i + 1];
        
        // Control points for smooth curve
        const tension = 0.3;
        const cp1x = p0.x + (p1.x - p0.x) * tension;
        const cp1y = p0.y;
        const cp2x = p1.x - (p1.x - p0.x) * tension;
        const cp2y = p1.y;
        
        pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p1.x} ${p1.y}`;
    }
    
    return { pathData, scaledPoints };
}

// Create stat card with proper icons
function createStatCard(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Stat Card - ${props.title}`;
        card.resize(280, 140);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        card.effects = [{
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.05 },
            offset: { x: 0, y: 1 },
            radius: 3,
            spread: 0,
            visible: true,
            blendMode: 'NORMAL'
        }];
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Metric';
        title.fontSize = 14;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        // Icon
        const iconColor = { r: 0.6, g: 0.6, b: 0.6 };
        const icon = yield createIconVector(props.icon || 'activity', 20, iconColor);
        icon.x = 236;
        icon.y = 18;
        card.appendChild(icon);
        
        // Value
        const value = figma.createText();
        value.characters = props.value || '$0';
        value.fontSize = 30;
        value.fontName = { family: 'Inter', style: 'Bold' };
        value.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        value.x = 24;
        value.y = 48;
        card.appendChild(value);
        
        // Change indicator
        const isPositive = props.changeType === 'positive';
        const changeColor = isPositive 
            ? { r: 0.133, g: 0.545, b: 0.133 }
            : { r: 0.863, g: 0.078, b: 0.235 };
        
        // Trend icon
        const trendIcon = figma.createVector();
        if (isPositive) {
            trendIcon.vectorPaths = [{
                windingRule: "NONZERO",
                data: "M1 8L5.5 3.5L8 6L12 2M12 2L9 2M12 2L12 5"
            }];
        } else {
            trendIcon.vectorPaths = [{
                windingRule: "NONZERO",
                data: "M1 2L5.5 6.5L8 4L12 8M12 8L9 8M12 8L12 5"
            }];
        }
        trendIcon.strokes = [{ type: 'SOLID', color: changeColor }];
        trendIcon.strokeWeight = 1.5;
        trendIcon.strokeCap = "ROUND";
        trendIcon.strokeJoin = "ROUND";
        trendIcon.fills = [];
        trendIcon.resize(12, 10);
        trendIcon.x = 24;
        trendIcon.y = 102;
        card.appendChild(trendIcon);
        
        const change = figma.createText();
        change.characters = `${props.change || '+0%'} from last month`;
        change.fontSize = 12;
        change.fontName = { family: 'Inter', style: 'Regular' };
        change.fills = [{ type: 'SOLID', color: changeColor }];
        change.x = 40;
        change.y = 98;
        card.appendChild(change);
        
        return card;
    });
}

// Create mini stat card
function createMiniStatCard(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Mini Stat - ${props.label}`;
        card.resize(280, 120);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        
        const colorMap = {
            blue: { bg: { r: 0.92, g: 0.95, b: 1 }, text: { r: 0.231, g: 0.510, b: 0.965 } },
            green: { bg: { r: 0.92, g: 0.98, b: 0.95 }, text: { r: 0.063, g: 0.725, b: 0.506 } },
            red: { bg: { r: 1, g: 0.93, b: 0.93 }, text: { r: 0.863, g: 0.078, b: 0.235 } },
            purple: { bg: { r: 0.95, g: 0.93, b: 1 }, text: { r: 0.545, g: 0.361, b: 0.965 } },
            orange: { bg: { r: 1, g: 0.96, b: 0.92 }, text: { r: 0.961, g: 0.620, b: 0.357 } },
        };
        const colors = colorMap[props.color] || colorMap.blue;
        
        // Badge
        const badge = figma.createFrame();
        badge.name = 'Badge';
        badge.cornerRadius = 4;
        badge.fills = [{ type: 'SOLID', color: colors.bg }];
        badge.layoutMode = 'HORIZONTAL';
        badge.paddingLeft = 10;
        badge.paddingRight = 10;
        badge.paddingTop = 4;
        badge.paddingBottom = 4;
        badge.primaryAxisSizingMode = 'AUTO';
        badge.counterAxisSizingMode = 'AUTO';
        badge.x = 24;
        badge.y = 24;
        
        const badgeText = figma.createText();
        badgeText.characters = props.label || 'Label';
        badgeText.fontSize = 12;
        badgeText.fontName = { family: 'Inter', style: 'Medium' };
        badgeText.fills = [{ type: 'SOLID', color: colors.text }];
        badge.appendChild(badgeText);
        card.appendChild(badge);
        
        // Value
        const value = figma.createText();
        value.characters = props.value || '0';
        value.fontSize = 36;
        value.fontName = { family: 'Inter', style: 'Bold' };
        value.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        value.x = 24;
        value.y = 60;
        card.appendChild(value);
        
        return card;
    });
}

// Create line chart with smooth bezier curves
function createLineChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Line Chart - ${props.title}`;
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        card.clipsContent = true;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Revenue Over Time';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'SemiBold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 55;
        const chartY = 55;
        const chartWidth = 490;
        const chartHeight = 180;
        const data = lineChartData;
        const maxValue = 6000;
        
        // Grid lines
        const gridValues = [0, 1500, 3000, 4500, 6000];
        for (let i = 0; i < gridValues.length; i++) {
            const yPos = chartY + chartHeight - (gridValues[i] / maxValue) * chartHeight;
            
            const gridLine = figma.createLine();
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
            gridLine.strokeWeight = 1;
            gridLine.dashPattern = [4, 4];
            card.appendChild(gridLine);
            
            const yLabel = figma.createText();
            yLabel.characters = (gridValues[i] / 1000).toFixed(0) + 'k';
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            yLabel.x = 20;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Create smooth line path
        const { pathData, scaledPoints } = createLineChartPath(data, chartWidth, chartHeight, chartX, chartY, maxValue);
        
        const line = figma.createVector();
        line.vectorPaths = [{ windingRule: "NONZERO", data: pathData }];
        line.strokes = [{ type: 'SOLID', color: primaryColor }];
        line.strokeWeight = 2;
        line.strokeCap = "ROUND";
        line.strokeJoin = "ROUND";
        line.fills = [];
        card.appendChild(line);
        
        // Data points
        for (let i = 0; i < scaledPoints.length; i++) {
            const point = figma.createEllipse();
            point.resize(8, 8);
            point.x = scaledPoints[i].x - 4;
            point.y = scaledPoints[i].y - 4;
            point.fills = [{ type: 'SOLID', color: primaryColor }];
            point.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            point.strokeWeight = 2;
            card.appendChild(point);
            
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            xLabel.x = scaledPoints[i].x - 10;
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create bar chart
function createBarChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Bar Chart - ${props.title}`;
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
        
        const title = figma.createText();
        title.characters = props.title || 'Sales by Day';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'SemiBold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 55;
        const chartY = 55;
        const chartWidth = 490;
        const chartHeight = 180;
        const data = barChartData;
        const maxValue = 200;
        
        // Grid and Y-axis
        const gridValues = [0, 50, 100, 150, 200];
        for (let i = 0; i < gridValues.length; i++) {
            const yPos = chartY + chartHeight - (gridValues[i] / maxValue) * chartHeight;
            
            const gridLine = figma.createLine();
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
            gridLine.dashPattern = [4, 4];
            card.appendChild(gridLine);
            
            const yLabel = figma.createText();
            yLabel.characters = gridValues[i].toString();
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            yLabel.x = 25;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Bars
        const barWidth = 50;
        const gap = (chartWidth - barWidth * data.length) / (data.length + 1);
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i].value / maxValue) * chartHeight;
            const barX = chartX + gap + (barWidth + gap) * i;
            const barY = chartY + chartHeight - barHeight;
            
            const bar = figma.createRectangle();
            bar.x = barX;
            bar.y = barY;
            bar.resize(barWidth, barHeight);
            bar.topLeftRadius = 4;
            bar.topRightRadius = 4;
            bar.bottomLeftRadius = 0;
            bar.bottomRightRadius = 0;
            bar.fills = [{ type: 'SOLID', color: primaryColor }];
            card.appendChild(bar);
            
            // Value on top
            const valueLabel = figma.createText();
            valueLabel.characters = data[i].value.toString();
            valueLabel.fontSize = 11;
            valueLabel.fontName = { family: 'Inter', style: 'Medium' };
            valueLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
            valueLabel.x = barX + barWidth / 2 - 10;
            valueLabel.y = barY - 18;
            card.appendChild(valueLabel);
            
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            xLabel.x = barX + barWidth / 2 - 12;
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create donut/pie chart with proper segments
function createPieChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Pie Chart - ${props.title}`;
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
        
        const title = figma.createText();
        title.characters = props.title || 'Traffic by Device';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'SemiBold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const data = pieChartData;
        const total = data.reduce((sum, d) => sum + d.value, 0);
        const centerX = 170;
        const centerY = 165;
        const outerRadius = 80;
        const innerRadius = 45;
        
        let currentAngle = -Math.PI / 2;
        
        for (let i = 0; i < data.length; i++) {
            const segmentAngle = (data[i].value / total) * Math.PI * 2;
            
            const arc = figma.createEllipse();
            arc.resize(outerRadius * 2, outerRadius * 2);
            arc.x = centerX - outerRadius;
            arc.y = centerY - outerRadius;
            arc.arcData = {
                startingAngle: currentAngle,
                endingAngle: currentAngle + segmentAngle - 0.02,
                innerRadius: innerRadius / outerRadius
            };
            arc.fills = [{ type: 'SOLID', color: data[i].color }];
            card.appendChild(arc);
            
            currentAngle += segmentAngle;
        }
        
        // Legend
        const legendX = 320;
        const legendY = 90;
        
        for (let i = 0; i < data.length; i++) {
            const dot = figma.createEllipse();
            dot.resize(10, 10);
            dot.x = legendX;
            dot.y = legendY + i * 50;
            dot.fills = [{ type: 'SOLID', color: data[i].color }];
            card.appendChild(dot);
            
            const label = figma.createText();
            label.characters = data[i].name;
            label.fontSize = 13;
            label.fontName = { family: 'Inter', style: 'Medium' };
            label.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
            label.x = legendX + 18;
            label.y = legendY + i * 50 - 2;
            card.appendChild(label);
            
            const pct = ((data[i].value / total) * 100).toFixed(0);
            const pctText = figma.createText();
            pctText.characters = `${pct}%`;
            pctText.fontSize = 12;
            pctText.fontName = { family: 'Inter', style: 'Regular' };
            pctText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            pctText.x = legendX + 18;
            pctText.y = legendY + i * 50 + 16;
            card.appendChild(pctText);
        }
        
        return card;
    });
}

// Create data table with status badges
function createDataTable(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Table - ${props.title}`;
        card.resize(580, 260);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
        
        const title = figma.createText();
        title.characters = props.title || 'Recent Transactions';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'SemiBold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const colX = [24, 130, 310, 420];
        const headers = ['Name', 'Email', 'Amount', 'Status'];
        
        // Header row
        for (let i = 0; i < headers.length; i++) {
            const h = figma.createText();
            h.characters = headers[i];
            h.fontSize = 12;
            h.fontName = { family: 'Inter', style: 'Medium' };
            h.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            h.x = colX[i];
            h.y = 56;
            card.appendChild(h);
        }
        
        // Divider
        const div = figma.createLine();
        div.x = 24;
        div.y = 80;
        div.resize(532, 0);
        div.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
        card.appendChild(div);
        
        const rows = [
            { name: 'John Doe', email: 'john@example.com', amount: '$250.00', status: 'Completed' },
            { name: 'Jane Smith', email: 'jane@example.com', amount: '$150.00', status: 'Pending' },
            { name: 'Bob Wilson', email: 'bob@example.com', amount: '$350.00', status: 'Completed' },
        ];
        
        for (let r = 0; r < rows.length; r++) {
            const rowY = 96 + r * 48;
            const row = rows[r];
            
            const name = figma.createText();
            name.characters = row.name;
            name.fontSize = 13;
            name.fontName = { family: 'Inter', style: 'Medium' };
            name.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
            name.x = colX[0];
            name.y = rowY;
            card.appendChild(name);
            
            const email = figma.createText();
            email.characters = row.email;
            email.fontSize = 13;
            email.fontName = { family: 'Inter', style: 'Regular' };
            email.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            email.x = colX[1];
            email.y = rowY;
            card.appendChild(email);
            
            const amount = figma.createText();
            amount.characters = row.amount;
            amount.fontSize = 13;
            amount.fontName = { family: 'Inter', style: 'Medium' };
            amount.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
            amount.x = colX[2];
            amount.y = rowY;
            card.appendChild(amount);
            
            // Status badge
            const isCompleted = row.status === 'Completed';
            const badge = figma.createFrame();
            badge.x = colX[3];
            badge.y = rowY - 4;
            badge.cornerRadius = 12;
            badge.fills = [{ 
                type: 'SOLID', 
                color: isCompleted 
                    ? { r: 0.863, g: 0.969, b: 0.898 }
                    : { r: 1, g: 0.949, b: 0.875 }
            }];
            badge.layoutMode = 'HORIZONTAL';
            badge.paddingLeft = 10;
            badge.paddingRight = 10;
            badge.paddingTop = 4;
            badge.paddingBottom = 4;
            badge.primaryAxisSizingMode = 'AUTO';
            badge.counterAxisSizingMode = 'AUTO';
            
            const statusText = figma.createText();
            statusText.characters = row.status;
            statusText.fontSize = 12;
            statusText.fontName = { family: 'Inter', style: 'Medium' };
            statusText.fills = [{ 
                type: 'SOLID', 
                color: isCompleted 
                    ? { r: 0.133, g: 0.545, b: 0.267 }
                    : { r: 0.8, g: 0.522, b: 0.133 }
            }];
            badge.appendChild(statusText);
            card.appendChild(badge);
            
            if (r < rows.length - 1) {
                const rowDiv = figma.createLine();
                rowDiv.x = 24;
                rowDiv.y = rowY + 32;
                rowDiv.resize(532, 0);
                rowDiv.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
                card.appendChild(rowDiv);
            }
        }
        
        return card;
    });
}

// Create alert card
function createAlertCard(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const alertColors = {
            info: { border: { r: 0.231, g: 0.510, b: 0.965 }, bg: { r: 0.949, g: 0.969, b: 1 } },
            warning: { border: { r: 0.961, g: 0.620, b: 0.357 }, bg: { r: 1, g: 0.969, b: 0.941 } },
            error: { border: { r: 0.863, g: 0.078, b: 0.235 }, bg: { r: 1, g: 0.949, b: 0.949 } },
            success: { border: { r: 0.133, g: 0.545, b: 0.267 }, bg: { r: 0.941, g: 0.984, b: 0.953 } }
        };
        const colors = alertColors[props.type] || alertColors.info;
        
        const card = figma.createFrame();
        card.name = `Alert - ${props.title}`;
        card.resize(280, 100);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: colors.bg }];
        card.strokes = [{ type: 'SOLID', color: colors.border }];
        card.strokeWeight = 1;
        card.strokeAlign = 'INSIDE';
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        const title = figma.createText();
        title.characters = props.title || 'Alert';
        title.fontSize = 14;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 20;
        title.y = 20;
        card.appendChild(title);
        
        const msg = figma.createText();
        msg.characters = props.message || 'Alert message';
        msg.fontSize = 13;
        msg.fontName = { family: 'Inter', style: 'Regular' };
        msg.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        msg.x = 20;
        msg.y = 48;
        card.appendChild(msg);
        
        return card;
    });
}

// Area chart (similar to line but with fill)
function createAreaChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Area Chart - ${props.title}`;
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.898, b: 0.898 } }];
        card.strokeWeight = 1;
        card.clipsContent = true;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
        
        const title = figma.createText();
        title.characters = props.title || 'Traffic Overview';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'SemiBold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 55;
        const chartY = 55;
        const chartWidth = 490;
        const chartHeight = 180;
        const data = lineChartData;
        const maxValue = 6000;
        
        // Grid
        const gridValues = [0, 1500, 3000, 4500, 6000];
        for (let i = 0; i < gridValues.length; i++) {
            const yPos = chartY + chartHeight - (gridValues[i] / maxValue) * chartHeight;
            
            const gridLine = figma.createLine();
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
            gridLine.dashPattern = [4, 4];
            card.appendChild(gridLine);
            
            const yLabel = figma.createText();
            yLabel.characters = (gridValues[i] / 1000).toFixed(0) + 'k';
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            yLabel.x = 20;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        const { pathData, scaledPoints } = createLineChartPath(data, chartWidth, chartHeight, chartX, chartY, maxValue);
        
        // Area fill
        const areaPath = pathData + ` L ${scaledPoints[scaledPoints.length - 1].x} ${chartY + chartHeight} L ${scaledPoints[0].x} ${chartY + chartHeight} Z`;
        const area = figma.createVector();
        area.vectorPaths = [{ windingRule: "NONZERO", data: areaPath }];
        area.fills = [{ type: 'SOLID', color: primaryColor, opacity: 0.15 }];
        area.strokes = [];
        card.appendChild(area);
        
        // Line
        const line = figma.createVector();
        line.vectorPaths = [{ windingRule: "NONZERO", data: pathData }];
        line.strokes = [{ type: 'SOLID', color: primaryColor }];
        line.strokeWeight = 2;
        line.fills = [];
        card.appendChild(line);
        
        // X-axis labels
        for (let i = 0; i < scaledPoints.length; i++) {
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            xLabel.x = scaledPoints[i].x - 10;
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Main dashboard creation
function createDashboard(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const primaryColor = hexToRgb(data.theme?.primaryColor || '#3b82f6');
        
        const dashboard = figma.createFrame();
        dashboard.name = data.name || 'Lookscout Dashboard';
        dashboard.resize(1280, 900);
        dashboard.fills = [{ type: 'SOLID', color: { r: 0.976, g: 0.980, b: 0.984 } }];
        dashboard.layoutMode = 'VERTICAL';
        dashboard.paddingLeft = 40;
        dashboard.paddingRight = 40;
        dashboard.paddingTop = 40;
        dashboard.paddingBottom = 40;
        dashboard.itemSpacing = 24;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        // Header
        const header = figma.createFrame();
        header.name = 'Header';
        header.resize(1200, 60);
        header.fills = [];
        header.layoutMode = 'VERTICAL';
        header.itemSpacing = 4;
        
        const heading = figma.createText();
        heading.characters = 'Dashboard';
        heading.fontSize = 30;
        heading.fontName = { family: 'Inter', style: 'Bold' };
        heading.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }];
        header.appendChild(heading);
        
        const subheading = figma.createText();
        subheading.characters = "Welcome back! Here's what's happening today.";
        subheading.fontSize = 14;
        subheading.fontName = { family: 'Inter', style: 'Regular' };
        subheading.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
        header.appendChild(subheading);
        
        dashboard.appendChild(header);
        
        // Grid
        const grid = figma.createFrame();
        grid.name = 'Components';
        grid.fills = [];
        grid.layoutMode = 'HORIZONTAL';
        grid.layoutWrap = 'WRAP';
        grid.itemSpacing = 20;
        grid.counterAxisSpacing = 20;
        grid.resize(1200, 700);
        
        for (const comp of data.components) {
            let node = null;
            
            switch (comp.type) {
                case 'stat-card':
                    node = yield createStatCard(comp.props, primaryColor);
                    break;
                case 'stat-card-mini':
                    node = yield createMiniStatCard(comp.props);
                    break;
                case 'line-chart':
                    node = yield createLineChart(comp.props, primaryColor);
                    break;
                case 'area-chart':
                    node = yield createAreaChart(comp.props, primaryColor);
                    break;
                case 'bar-chart':
                    node = yield createBarChart(comp.props, primaryColor);
                    break;
                case 'pie-chart':
                    node = yield createPieChart(comp.props, primaryColor);
                    break;
                case 'data-table':
                    node = yield createDataTable(comp.props);
                    break;
                case 'alert-card':
                    node = yield createAlertCard(comp.props);
                    break;
            }
            
            if (node) grid.appendChild(node);
        }
        
        dashboard.appendChild(grid);
        figma.currentPage.appendChild(dashboard);
        figma.viewport.scrollAndZoomIntoView([dashboard]);
        
        return dashboard;
    });
}

figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'import-dashboard') {
        try {
            const data = JSON.parse(msg.data);
            yield createDashboard(data);
            figma.ui.postMessage({ type: 'success', message: 'Dashboard imported!' });
            figma.notify('Dashboard imported! 🎉');
        } catch (error) {
            figma.ui.postMessage({ type: 'error', message: `Error: ${error}` });
            figma.notify('Failed to import', { error: true });
        }
    }
    if (msg.type === 'cancel') figma.closePlugin();
});
