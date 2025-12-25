// Lookscout Dashboard Importer - Figma Plugin v2
// Improved chart rendering with proper data visualization
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Sample chart data matching the web app
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
    { name: 'Desktop', value: 400, color: { r: 0.23, g: 0.51, b: 0.96 } },
    { name: 'Mobile', value: 300, color: { r: 0.06, g: 0.73, b: 0.51 } },
    { name: 'Tablet', value: 200, color: { r: 0.96, g: 0.62, b: 0.35 } },
];

// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        }
        : { r: 0.23, g: 0.51, b: 0.96 };
}

// Create icon shape
function createIcon(type, size, color) {
    const icon = figma.createFrame();
    icon.name = `Icon - ${type}`;
    icon.resize(size, size);
    icon.fills = [];
    
    if (type === 'dollar') {
        const circle = figma.createEllipse();
        circle.resize(size, size);
        circle.fills = [];
        circle.strokes = [{ type: 'SOLID', color: color }];
        circle.strokeWeight = 1.5;
        icon.appendChild(circle);
        
        const line = figma.createLine();
        line.x = size / 2;
        line.y = size * 0.2;
        line.resize(0, size * 0.6);
        line.rotation = 90;
        line.strokes = [{ type: 'SOLID', color: color }];
        line.strokeWeight = 1.5;
        icon.appendChild(line);
    } else if (type === 'cart') {
        const rect = figma.createRectangle();
        rect.resize(size * 0.7, size * 0.5);
        rect.x = size * 0.15;
        rect.y = size * 0.2;
        rect.cornerRadius = 2;
        rect.fills = [];
        rect.strokes = [{ type: 'SOLID', color: color }];
        rect.strokeWeight = 1.5;
        icon.appendChild(rect);
    } else if (type === 'users') {
        const head = figma.createEllipse();
        head.resize(size * 0.4, size * 0.4);
        head.x = size * 0.3;
        head.y = size * 0.1;
        head.fills = [];
        head.strokes = [{ type: 'SOLID', color: color }];
        head.strokeWeight = 1.5;
        icon.appendChild(head);
        
        const body = figma.createEllipse();
        body.resize(size * 0.6, size * 0.3);
        body.x = size * 0.2;
        body.y = size * 0.55;
        body.arcData = { startingAngle: 0, endingAngle: Math.PI, innerRadius: 0 };
        body.fills = [];
        body.strokes = [{ type: 'SOLID', color: color }];
        body.strokeWeight = 1.5;
        icon.appendChild(body);
    } else if (type === 'activity') {
        // Trend line icon
        const line = figma.createLine();
        line.x = size * 0.1;
        line.y = size * 0.7;
        line.resize(size * 0.8, 0);
        line.strokes = [{ type: 'SOLID', color: color }];
        line.strokeWeight = 1.5;
        icon.appendChild(line);
        
        const upLine = figma.createLine();
        upLine.x = size * 0.5;
        upLine.y = size * 0.3;
        upLine.resize(size * 0.35, 0);
        upLine.rotation = 45;
        upLine.strokes = [{ type: 'SOLID', color: color }];
        upLine.strokeWeight = 1.5;
        icon.appendChild(upLine);
    }
    
    return icon;
}

// Create a stat card component with icon
function createStatCard(props, x, y, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Stat Card - ${props.title}`;
        card.resize(280, 140);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        
        // Header with title and icon
        const header = figma.createFrame();
        header.name = 'Header';
        header.resize(232, 20);
        header.x = 24;
        header.y = 20;
        header.fills = [];
        header.layoutMode = 'HORIZONTAL';
        header.primaryAxisSizingMode = 'FIXED';
        header.counterAxisSizingMode = 'AUTO';
        header.primaryAxisAlignItems = 'SPACE_BETWEEN';
        
        const title = figma.createText();
        title.characters = props.title || 'Metric';
        title.fontSize = 14;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        header.appendChild(title);
        
        // Icon
        const iconColor = { r: 0.6, g: 0.6, b: 0.6 };
        const icon = createIcon(props.icon || 'activity', 18, iconColor);
        header.appendChild(icon);
        
        card.appendChild(header);
        
        // Value
        const value = figma.createText();
        value.characters = props.value || '$0';
        value.fontSize = 30;
        value.fontName = { family: 'Inter', style: 'Bold' };
        value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        value.x = 24;
        value.y = 52;
        card.appendChild(value);
        
        // Change indicator with trend icon
        const changeFrame = figma.createFrame();
        changeFrame.name = 'Change';
        changeFrame.x = 24;
        changeFrame.y = 100;
        changeFrame.fills = [];
        changeFrame.layoutMode = 'HORIZONTAL';
        changeFrame.itemSpacing = 4;
        changeFrame.primaryAxisSizingMode = 'AUTO';
        changeFrame.counterAxisSizingMode = 'AUTO';
        
        const isPositive = props.changeType === 'positive';
        const changeColor = isPositive
            ? { r: 0.08, g: 0.7, b: 0.35 }
            : { r: 0.9, g: 0.2, b: 0.2 };
        
        // Trend arrow
        const arrow = figma.createText();
        arrow.characters = isPositive ? '↗' : '↘';
        arrow.fontSize = 12;
        arrow.fontName = { family: 'Inter', style: 'Medium' };
        arrow.fills = [{ type: 'SOLID', color: changeColor }];
        changeFrame.appendChild(arrow);
        
        const change = figma.createText();
        change.characters = `${props.change || '+0%'} from last month`;
        change.fontSize = 12;
        change.fontName = { family: 'Inter', style: 'Regular' };
        change.fills = [{ type: 'SOLID', color: changeColor }];
        changeFrame.appendChild(change);
        
        card.appendChild(changeFrame);
        
        return card;
    });
}

// Create a mini stat card
function createMiniStatCard(props, x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Mini Stat - ${props.label}`;
        card.resize(280, 100);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        card.layoutMode = 'VERTICAL';
        card.paddingLeft = 24;
        card.paddingRight = 24;
        card.paddingTop = 20;
        card.paddingBottom = 20;
        card.itemSpacing = 8;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        
        const badge = figma.createFrame();
        badge.name = 'Badge';
        badge.layoutMode = 'HORIZONTAL';
        badge.paddingLeft = 8;
        badge.paddingRight = 8;
        badge.paddingTop = 4;
        badge.paddingBottom = 4;
        badge.cornerRadius = 4;
        
        const colorMap = {
            blue: { r: 0.23, g: 0.51, b: 0.96 },
            green: { r: 0.08, g: 0.7, b: 0.35 },
            red: { r: 0.9, g: 0.2, b: 0.2 },
            purple: { r: 0.55, g: 0.36, b: 0.96 },
            orange: { r: 0.96, g: 0.62, b: 0.35 },
        };
        const badgeColor = colorMap[props.color] || colorMap.blue;
        badge.fills = [{ type: 'SOLID', color: badgeColor, opacity: 0.1 }];
        
        const badgeText = figma.createText();
        badgeText.characters = props.label || 'Label';
        badgeText.fontSize = 12;
        badgeText.fontName = { family: 'Inter', style: 'Medium' };
        badgeText.fills = [{ type: 'SOLID', color: badgeColor }];
        badge.appendChild(badgeText);
        card.appendChild(badge);
        
        const value = figma.createText();
        value.characters = props.value || '0';
        value.fontSize = 32;
        value.fontName = { family: 'Inter', style: 'Bold' };
        value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        card.appendChild(value);
        
        return card;
    });
}

// Create LINE CHART with proper curved lines
function createLineChart(props, x, y, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Line Chart - ${props.title}`;
        card.resize(580, 320);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        card.clipsContent = true;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Line Chart';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        // Chart area
        const chartX = 50;
        const chartY = 60;
        const chartWidth = 490;
        const chartHeight = 200;
        const data = lineChartData;
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = 0;
        
        // Grid lines and Y-axis labels
        const gridValues = [0, 1500, 3000, 4500, 6000];
        for (let i = 0; i < gridValues.length; i++) {
            const yPos = chartY + chartHeight - ((gridValues[i] - minValue) / (maxValue - minValue)) * chartHeight;
            
            // Grid line
            const gridLine = figma.createLine();
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
            gridLine.strokeWeight = 1;
            card.appendChild(gridLine);
            
            // Y-axis label
            const yLabel = figma.createText();
            yLabel.characters = gridValues[i].toString();
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            yLabel.x = 10;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Calculate data points
        const points = data.map((d, i) => ({
            x: chartX + (chartWidth / (data.length - 1)) * i,
            y: chartY + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight,
            value: d.value,
            name: d.name
        }));
        
        // Draw line segments connecting points
        for (let i = 0; i < points.length - 1; i++) {
            const startX = points[i].x;
            const startY = points[i].y;
            const endX = points[i + 1].x;
            const endY = points[i + 1].y;
            
            // Calculate line properties
            const dx = endX - startX;
            const dy = endY - startY;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            const line = figma.createLine();
            line.x = startX;
            line.y = startY;
            line.resize(length, 0);
            line.rotation = -(angle * 180 / Math.PI);
            line.strokes = [{ type: 'SOLID', color: primaryColor }];
            line.strokeWeight = 2;
            line.strokeCap = 'ROUND';
            card.appendChild(line);
        }
        
        // Draw data points
        for (let i = 0; i < points.length; i++) {
            const point = figma.createEllipse();
            point.resize(8, 8);
            point.x = points[i].x - 4;
            point.y = points[i].y - 4;
            point.fills = [{ type: 'SOLID', color: primaryColor }];
            point.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            point.strokeWeight = 2;
            card.appendChild(point);
            
            // X-axis labels
            const xLabel = figma.createText();
            xLabel.characters = points[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            xLabel.x = points[i].x - 12;
            xLabel.y = chartY + chartHeight + 12;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create AREA CHART
function createAreaChart(props, x, y, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Area Chart - ${props.title}`;
        card.resize(580, 320);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        const title = figma.createText();
        title.characters = props.title || 'Area Chart';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 50;
        const chartY = 60;
        const chartWidth = 490;
        const chartHeight = 200;
        const data = lineChartData;
        const maxValue = Math.max(...data.map(d => d.value));
        
        // Grid lines
        const gridValues = [0, 1500, 3000, 4500, 6000];
        for (let i = 0; i < gridValues.length; i++) {
            const yPos = chartY + chartHeight - (gridValues[i] / maxValue) * chartHeight;
            const gridLine = figma.createLine();
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
            card.appendChild(gridLine);
            
            const yLabel = figma.createText();
            yLabel.characters = gridValues[i].toString();
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            yLabel.x = 10;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        const points = data.map((d, i) => ({
            x: chartX + (chartWidth / (data.length - 1)) * i,
            y: chartY + chartHeight - (d.value / maxValue) * chartHeight
        }));
        
        // Area fill (simplified rectangles)
        for (let i = 0; i < points.length - 1; i++) {
            const rect = figma.createRectangle();
            const avgHeight = ((points[i].y - chartY - chartHeight) + (points[i + 1].y - chartY - chartHeight)) / 2;
            rect.x = points[i].x;
            rect.y = Math.min(points[i].y, points[i + 1].y);
            rect.resize(points[i + 1].x - points[i].x, chartY + chartHeight - Math.min(points[i].y, points[i + 1].y));
            rect.fills = [{ type: 'SOLID', color: primaryColor, opacity: 0.1 }];
            card.appendChild(rect);
        }
        
        // Lines
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            const line = figma.createLine();
            line.x = points[i].x;
            line.y = points[i].y;
            line.resize(length, 0);
            line.rotation = -(angle * 180 / Math.PI);
            line.strokes = [{ type: 'SOLID', color: primaryColor }];
            line.strokeWeight = 2;
            card.appendChild(line);
        }
        
        // X-axis labels
        for (let i = 0; i < data.length; i++) {
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            xLabel.x = points[i].x - 12;
            xLabel.y = chartY + chartHeight + 12;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create BAR CHART with values on top
function createBarChart(props, x, y, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Bar Chart - ${props.title}`;
        card.resize(580, 320);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        const title = figma.createText();
        title.characters = props.title || 'Bar Chart';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 50;
        const chartY = 70;
        const chartWidth = 490;
        const chartHeight = 180;
        const data = barChartData;
        const maxValue = 200;
        
        // Grid lines and Y-axis labels
        const gridValues = [0, 50, 100, 150, 200];
        for (let i = 0; i < gridValues.length; i++) {
            const yPos = chartY + chartHeight - (gridValues[i] / maxValue) * chartHeight;
            
            const gridLine = figma.createLine();
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
            card.appendChild(gridLine);
            
            const yLabel = figma.createText();
            yLabel.characters = gridValues[i].toString();
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            yLabel.x = 20;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Bars
        const barWidth = 50;
        const totalBarsWidth = data.length * barWidth;
        const totalGaps = chartWidth - totalBarsWidth;
        const gap = totalGaps / (data.length + 1);
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i].value / maxValue) * chartHeight;
            const barX = chartX + gap + (barWidth + gap) * i;
            const barY = chartY + chartHeight - barHeight;
            
            // Bar
            const bar = figma.createRectangle();
            bar.x = barX;
            bar.y = barY;
            bar.resize(barWidth, barHeight);
            bar.cornerRadius = 4;
            bar.fills = [{ type: 'SOLID', color: primaryColor }];
            card.appendChild(bar);
            
            // Value label on top
            const valueLabel = figma.createText();
            valueLabel.characters = data[i].value.toString();
            valueLabel.fontSize = 11;
            valueLabel.fontName = { family: 'Inter', style: 'Medium' };
            valueLabel.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
            valueLabel.x = barX + barWidth / 2 - 10;
            valueLabel.y = barY - 18;
            card.appendChild(valueLabel);
            
            // X-axis label
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            xLabel.x = barX + barWidth / 2 - 12;
            xLabel.y = chartY + chartHeight + 12;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create PIE/DONUT CHART with segments and legend
function createPieChart(props, x, y, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Pie Chart - ${props.title}`;
        card.resize(580, 320);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        const title = figma.createText();
        title.characters = props.title || 'Pie Chart';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const data = pieChartData;
        const total = data.reduce((sum, d) => sum + d.value, 0);
        const centerX = 180;
        const centerY = 175;
        const outerRadius = 90;
        const innerRadius = 45;
        
        // Draw pie segments as arcs
        let currentAngle = -Math.PI / 2; // Start from top
        
        for (let i = 0; i < data.length; i++) {
            const segmentAngle = (data[i].value / total) * Math.PI * 2;
            
            const arc = figma.createEllipse();
            arc.resize(outerRadius * 2, outerRadius * 2);
            arc.x = centerX - outerRadius;
            arc.y = centerY - outerRadius;
            arc.arcData = {
                startingAngle: currentAngle,
                endingAngle: currentAngle + segmentAngle,
                innerRadius: innerRadius / outerRadius
            };
            arc.fills = [{ type: 'SOLID', color: data[i].color }];
            card.appendChild(arc);
            
            currentAngle += segmentAngle;
        }
        
        // Legend
        const legendX = 340;
        const legendY = 100;
        
        for (let i = 0; i < data.length; i++) {
            // Color dot
            const dot = figma.createEllipse();
            dot.resize(10, 10);
            dot.x = legendX;
            dot.y = legendY + i * 45;
            dot.fills = [{ type: 'SOLID', color: data[i].color }];
            card.appendChild(dot);
            
            // Label
            const label = figma.createText();
            label.characters = data[i].name;
            label.fontSize = 13;
            label.fontName = { family: 'Inter', style: 'Medium' };
            label.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
            label.x = legendX + 18;
            label.y = legendY + i * 45 - 2;
            card.appendChild(label);
            
            // Percentage
            const percentage = ((data[i].value / total) * 100).toFixed(0);
            const percentText = figma.createText();
            percentText.characters = `${percentage}%`;
            percentText.fontSize = 12;
            percentText.fontName = { family: 'Inter', style: 'Regular' };
            percentText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            percentText.x = legendX + 18;
            percentText.y = legendY + i * 45 + 16;
            card.appendChild(percentText);
        }
        
        return card;
    });
}

// Create a data table with status badges
function createDataTable(props, x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Table - ${props.title}`;
        card.resize(580, 280);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Data Table';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const tableY = 56;
        const colWidths = [120, 180, 100, 100];
        const colX = [24, 144, 324, 424];
        
        // Table header
        const headers = ['Name', 'Email', 'Amount', 'Status'];
        for (let i = 0; i < headers.length; i++) {
            const cell = figma.createText();
            cell.characters = headers[i];
            cell.fontSize = 12;
            cell.fontName = { family: 'Inter', style: 'Medium' };
            cell.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
            cell.x = colX[i];
            cell.y = tableY;
            card.appendChild(cell);
        }
        
        // Divider
        const headerDivider = figma.createLine();
        headerDivider.x = 24;
        headerDivider.y = tableY + 28;
        headerDivider.resize(532, 0);
        headerDivider.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.appendChild(headerDivider);
        
        // Table rows
        const rows = [
            { name: 'John Doe', email: 'john@example.com', amount: '$250.00', status: 'Completed' },
            { name: 'Jane Smith', email: 'jane@example.com', amount: '$150.00', status: 'Pending' },
            { name: 'Bob Wilson', email: 'bob@example.com', amount: '$350.00', status: 'Completed' },
        ];
        
        for (let r = 0; r < rows.length; r++) {
            const rowY = tableY + 44 + r * 48;
            const row = rows[r];
            
            // Name
            const nameText = figma.createText();
            nameText.characters = row.name;
            nameText.fontSize = 13;
            nameText.fontName = { family: 'Inter', style: 'Medium' };
            nameText.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
            nameText.x = colX[0];
            nameText.y = rowY;
            card.appendChild(nameText);
            
            // Email
            const emailText = figma.createText();
            emailText.characters = row.email;
            emailText.fontSize = 13;
            emailText.fontName = { family: 'Inter', style: 'Regular' };
            emailText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            emailText.x = colX[1];
            emailText.y = rowY;
            card.appendChild(emailText);
            
            // Amount
            const amountText = figma.createText();
            amountText.characters = row.amount;
            amountText.fontSize = 13;
            amountText.fontName = { family: 'Inter', style: 'Medium' };
            amountText.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
            amountText.x = colX[2];
            amountText.y = rowY;
            card.appendChild(amountText);
            
            // Status badge
            const isCompleted = row.status === 'Completed';
            const badge = figma.createFrame();
            badge.name = 'Status Badge';
            badge.x = colX[3];
            badge.y = rowY - 4;
            badge.layoutMode = 'HORIZONTAL';
            badge.paddingLeft = 10;
            badge.paddingRight = 10;
            badge.paddingTop = 4;
            badge.paddingBottom = 4;
            badge.cornerRadius = 12;
            badge.fills = [{ 
                type: 'SOLID', 
                color: isCompleted 
                    ? { r: 0.86, g: 0.97, b: 0.9 } 
                    : { r: 1, g: 0.95, b: 0.88 } 
            }];
            
            const statusText = figma.createText();
            statusText.characters = row.status;
            statusText.fontSize = 12;
            statusText.fontName = { family: 'Inter', style: 'Medium' };
            statusText.fills = [{ 
                type: 'SOLID', 
                color: isCompleted 
                    ? { r: 0.08, g: 0.6, b: 0.35 } 
                    : { r: 0.85, g: 0.55, b: 0.2 }
            }];
            badge.appendChild(statusText);
            card.appendChild(badge);
            
            // Row divider
            if (r < rows.length - 1) {
                const divider = figma.createLine();
                divider.x = 24;
                divider.y = rowY + 32;
                divider.resize(532, 0);
                divider.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
                card.appendChild(divider);
            }
        }
        
        return card;
    });
}

// Create alert card
function createAlertCard(props, x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = figma.createFrame();
        card.name = `Alert - ${props.title}`;
        card.resize(280, 100);
        card.x = x;
        card.y = y;
        card.cornerRadius = 12;
        
        const alertColors = {
            info: { r: 0.23, g: 0.51, b: 0.96 },
            warning: { r: 0.96, g: 0.62, b: 0.35 },
            error: { r: 0.9, g: 0.2, b: 0.2 },
            success: { r: 0.08, g: 0.7, b: 0.35 },
        };
        const alertColor = alertColors[props.type] || alertColors.info;
        
        card.fills = [{ type: 'SOLID', color: alertColor, opacity: 0.05 }];
        card.strokes = [{ type: 'SOLID', color: alertColor }];
        card.strokeWeight = 1;
        card.strokeAlign = 'INSIDE';
        card.layoutMode = 'VERTICAL';
        card.paddingLeft = 20;
        card.paddingRight = 20;
        card.paddingTop = 16;
        card.paddingBottom = 16;
        card.itemSpacing = 8;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        const title = figma.createText();
        title.characters = props.title || 'Alert';
        title.fontSize = 14;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        card.appendChild(title);
        
        const message = figma.createText();
        message.characters = props.message || 'Alert message';
        message.fontSize = 13;
        message.fontName = { family: 'Inter', style: 'Regular' };
        message.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        card.appendChild(message);
        
        return card;
    });
}

// Main function to create dashboard
function createDashboard(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const primaryColor = hexToRgb(((_a = data.theme) === null || _a === void 0 ? void 0 : _a.primaryColor) || '#3b82f6');
        
        const dashboard = figma.createFrame();
        dashboard.name = data.name || 'Lookscout Dashboard';
        dashboard.resize(1280, 900);
        dashboard.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
        dashboard.layoutMode = 'VERTICAL';
        dashboard.paddingLeft = 40;
        dashboard.paddingRight = 40;
        dashboard.paddingTop = 40;
        dashboard.paddingBottom = 40;
        dashboard.itemSpacing = 24;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        const headerFrame = figma.createFrame();
        headerFrame.name = 'Header';
        headerFrame.resize(1200, 60);
        headerFrame.fills = [];
        headerFrame.layoutMode = 'VERTICAL';
        headerFrame.itemSpacing = 4;
        
        const heading = figma.createText();
        heading.characters = 'Dashboard';
        heading.fontSize = 32;
        heading.fontName = { family: 'Inter', style: 'Bold' };
        heading.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        headerFrame.appendChild(heading);
        
        const subheading = figma.createText();
        subheading.characters = "Welcome back! Here's what's happening today.";
        subheading.fontSize = 14;
        subheading.fontName = { family: 'Inter', style: 'Regular' };
        subheading.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
        headerFrame.appendChild(subheading);
        
        dashboard.appendChild(headerFrame);
        
        const grid = figma.createFrame();
        grid.name = 'Components Grid';
        grid.fills = [];
        grid.layoutMode = 'HORIZONTAL';
        grid.layoutWrap = 'WRAP';
        grid.itemSpacing = 20;
        grid.counterAxisSpacing = 20;
        grid.resize(1200, 700);
        
        for (const component of data.components) {
            let node = null;
            
            switch (component.type) {
                case 'stat-card':
                    node = yield createStatCard(component.props, 0, 0, primaryColor);
                    break;
                case 'stat-card-mini':
                    node = yield createMiniStatCard(component.props, 0, 0);
                    break;
                case 'line-chart':
                    node = yield createLineChart(component.props, 0, 0, primaryColor);
                    break;
                case 'area-chart':
                    node = yield createAreaChart(component.props, 0, 0, primaryColor);
                    break;
                case 'bar-chart':
                    node = yield createBarChart(component.props, 0, 0, primaryColor);
                    break;
                case 'pie-chart':
                    node = yield createPieChart(component.props, 0, 0, primaryColor);
                    break;
                case 'data-table':
                    node = yield createDataTable(component.props, 0, 0);
                    break;
                case 'alert-card':
                    node = yield createAlertCard(component.props, 0, 0);
                    break;
            }
            
            if (node) {
                grid.appendChild(node);
            }
        }
        
        dashboard.appendChild(grid);
        figma.currentPage.appendChild(dashboard);
        figma.viewport.scrollAndZoomIntoView([dashboard]);
        
        return dashboard;
    });
}

// Show UI
figma.showUI(__html__, { width: 400, height: 500 });

// Handle messages from UI
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'import-dashboard') {
        try {
            const data = JSON.parse(msg.data);
            yield createDashboard(data);
            figma.ui.postMessage({ type: 'success', message: 'Dashboard imported successfully!' });
            figma.notify('Dashboard imported! 🎉');
        }
        catch (error) {
            figma.ui.postMessage({ type: 'error', message: `Error: ${error}` });
            figma.notify('Failed to import dashboard', { error: true });
        }
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
});
