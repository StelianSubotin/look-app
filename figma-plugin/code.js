// Lookscout Dashboard Importer - Figma Plugin
// This plugin imports dashboards created in Lookscout into native Figma frames
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Sample chart data
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

// Create a stat card component
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
        card.layoutMode = 'VERTICAL';
        card.paddingLeft = 24;
        card.paddingRight = 24;
        card.paddingTop = 20;
        card.paddingBottom = 20;
        card.itemSpacing = 8;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
        
        const title = figma.createText();
        title.characters = props.title || 'Metric';
        title.fontSize = 14;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        card.appendChild(title);
        
        const value = figma.createText();
        value.characters = props.value || '$0';
        value.fontSize = 30;
        value.fontName = { family: 'Inter', style: 'Bold' };
        value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        card.appendChild(value);
        
        const change = figma.createText();
        change.characters = `${props.change || '+0%'} from last month`;
        change.fontSize = 12;
        change.fontName = { family: 'Inter', style: 'Regular' };
        const isPositive = props.changeType === 'positive';
        change.fills = [
            {
                type: 'SOLID',
                color: isPositive
                    ? { r: 0.08, g: 0.7, b: 0.35 }
                    : { r: 0.9, g: 0.2, b: 0.2 },
            },
        ];
        card.appendChild(change);
        
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

// Create LINE CHART with actual data visualization
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
        
        // Chart area dimensions
        const chartX = 60;
        const chartY = 60;
        const chartWidth = 480;
        const chartHeight = 200;
        
        // Draw grid lines
        for (let i = 0; i <= 4; i++) {
            const gridLine = figma.createLine();
            const yPos = chartY + (chartHeight / 4) * i;
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
            gridLine.strokeWeight = 1;
            card.appendChild(gridLine);
            
            // Y-axis labels
            const yLabel = figma.createText();
            const maxValue = 6000;
            const labelValue = maxValue - (maxValue / 4) * i;
            yLabel.characters = `${(labelValue / 1000).toFixed(0)}k`;
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            yLabel.x = chartX - 30;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Calculate points and draw line
        const data = lineChartData;
        const maxValue = 6000;
        const points = data.map((d, i) => ({
            x: chartX + (chartWidth / (data.length - 1)) * i,
            y: chartY + chartHeight - (d.value / maxValue) * chartHeight
        }));
        
        // Draw the line segments
        for (let i = 0; i < points.length - 1; i++) {
            const line = figma.createLine();
            line.x = points[i].x;
            line.y = points[i].y;
            
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            line.resize(length, 0);
            line.rotation = -angle;
            line.strokes = [{ type: 'SOLID', color: primaryColor }];
            line.strokeWeight = 3;
            line.strokeCap = 'ROUND';
            card.appendChild(line);
        }
        
        // Draw data points and labels
        for (let i = 0; i < points.length; i++) {
            // Point circle
            const point = figma.createEllipse();
            point.resize(10, 10);
            point.x = points[i].x - 5;
            point.y = points[i].y - 5;
            point.fills = [{ type: 'SOLID', color: primaryColor }];
            point.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            point.strokeWeight = 2;
            card.appendChild(point);
            
            // X-axis labels
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            xLabel.x = points[i].x - 12;
            xLabel.y = chartY + chartHeight + 10;
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
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Area Chart';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 60;
        const chartY = 60;
        const chartWidth = 480;
        const chartHeight = 200;
        
        // Grid lines and labels
        for (let i = 0; i <= 4; i++) {
            const gridLine = figma.createLine();
            const yPos = chartY + (chartHeight / 4) * i;
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
            card.appendChild(gridLine);
            
            const yLabel = figma.createText();
            const maxValue = 6000;
            const labelValue = maxValue - (maxValue / 4) * i;
            yLabel.characters = `${(labelValue / 1000).toFixed(0)}k`;
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            yLabel.x = chartX - 30;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Create area fill using a rectangle with gradient (simplified)
        const data = lineChartData;
        const maxValue = 6000;
        const points = data.map((d, i) => ({
            x: chartX + (chartWidth / (data.length - 1)) * i,
            y: chartY + chartHeight - (d.value / maxValue) * chartHeight
        }));
        
        // Area background (simplified as rectangles)
        for (let i = 0; i < points.length - 1; i++) {
            const rect = figma.createRectangle();
            const avgY = (points[i].y + points[i + 1].y) / 2;
            rect.x = points[i].x;
            rect.y = avgY;
            rect.resize(points[i + 1].x - points[i].x, chartY + chartHeight - avgY);
            rect.fills = [{ type: 'SOLID', color: primaryColor, opacity: 0.15 }];
            card.appendChild(rect);
        }
        
        // Draw the line
        for (let i = 0; i < points.length - 1; i++) {
            const line = figma.createLine();
            line.x = points[i].x;
            line.y = points[i].y;
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            line.resize(length, 0);
            line.rotation = -angle;
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
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create BAR CHART with values
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
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Bar Chart';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 60;
        const chartY = 60;
        const chartWidth = 480;
        const chartHeight = 200;
        const data = barChartData;
        const maxValue = 200;
        
        // Grid lines
        for (let i = 0; i <= 4; i++) {
            const gridLine = figma.createLine();
            const yPos = chartY + (chartHeight / 4) * i;
            gridLine.x = chartX;
            gridLine.y = yPos;
            gridLine.resize(chartWidth, 0);
            gridLine.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
            card.appendChild(gridLine);
            
            // Y-axis labels
            const yLabel = figma.createText();
            const labelValue = maxValue - (maxValue / 4) * i;
            yLabel.characters = `${labelValue}`;
            yLabel.fontSize = 11;
            yLabel.fontName = { family: 'Inter', style: 'Regular' };
            yLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            yLabel.x = chartX - 30;
            yLabel.y = yPos - 6;
            card.appendChild(yLabel);
        }
        
        // Draw bars
        const barWidth = 60;
        const barGap = (chartWidth - barWidth * data.length) / (data.length + 1);
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i].value / maxValue) * chartHeight;
            const barX = chartX + barGap + (barWidth + barGap) * i;
            const barY = chartY + chartHeight - barHeight;
            
            // Bar
            const bar = figma.createRectangle();
            bar.x = barX;
            bar.y = barY;
            bar.resize(barWidth, barHeight);
            bar.cornerRadius = 4;
            bar.fills = [{ type: 'SOLID', color: primaryColor }];
            card.appendChild(bar);
            
            // Value label on top of bar
            const valueLabel = figma.createText();
            valueLabel.characters = `${data[i].value}`;
            valueLabel.fontSize = 12;
            valueLabel.fontName = { family: 'Inter', style: 'Medium' };
            valueLabel.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
            valueLabel.x = barX + barWidth / 2 - 12;
            valueLabel.y = barY - 20;
            card.appendChild(valueLabel);
            
            // X-axis labels
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            xLabel.x = barX + barWidth / 2 - 12;
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Create PIE CHART with legend
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
        
        // Title
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
        const centerX = 200;
        const centerY = 170;
        const radius = 100;
        const innerRadius = 50;
        
        // Draw pie segments (simplified as colored arcs using ellipses)
        let currentAngle = -90;
        
        for (let i = 0; i < data.length; i++) {
            const segmentAngle = (data[i].value / total) * 360;
            
            // Create segment (using ellipse as approximation)
            const segment = figma.createEllipse();
            segment.resize(radius * 2, radius * 2);
            segment.x = centerX - radius;
            segment.y = centerY - radius;
            
            // Set arc
            const startAngle = currentAngle / 360;
            const endAngle = (currentAngle + segmentAngle) / 360;
            segment.arcData = {
                startingAngle: startAngle * Math.PI * 2,
                endingAngle: endAngle * Math.PI * 2,
                innerRadius: innerRadius / radius
            };
            
            segment.fills = [{ type: 'SOLID', color: data[i].color }];
            card.appendChild(segment);
            
            currentAngle += segmentAngle;
        }
        
        // Legend
        const legendX = 360;
        const legendY = 100;
        
        for (let i = 0; i < data.length; i++) {
            // Color dot
            const dot = figma.createEllipse();
            dot.resize(12, 12);
            dot.x = legendX;
            dot.y = legendY + i * 36;
            dot.fills = [{ type: 'SOLID', color: data[i].color }];
            card.appendChild(dot);
            
            // Label
            const label = figma.createText();
            label.characters = data[i].name;
            label.fontSize = 13;
            label.fontName = { family: 'Inter', style: 'Medium' };
            label.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
            label.x = legendX + 20;
            label.y = legendY + i * 36 - 2;
            card.appendChild(label);
            
            // Value
            const percentage = ((data[i].value / total) * 100).toFixed(0);
            const valueText = figma.createText();
            valueText.characters = `${percentage}%`;
            valueText.fontSize = 13;
            valueText.fontName = { family: 'Inter', style: 'Regular' };
            valueText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            valueText.x = legendX + 20;
            valueText.y = legendY + i * 36 + 14;
            card.appendChild(valueText);
        }
        
        return card;
    });
}

// Create a data table
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
        card.layoutMode = 'VERTICAL';
        card.paddingLeft = 24;
        card.paddingRight = 24;
        card.paddingTop = 20;
        card.paddingBottom = 20;
        card.itemSpacing = 0;
        
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Data Table';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Medium' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        card.appendChild(title);
        
        // Spacer
        const spacer = figma.createFrame();
        spacer.resize(532, 16);
        spacer.fills = [];
        card.appendChild(spacer);
        
        // Table header
        const header = figma.createFrame();
        header.name = 'Table Header';
        header.resize(532, 40);
        header.layoutMode = 'HORIZONTAL';
        header.itemSpacing = 0;
        header.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
        header.paddingTop = 12;
        header.paddingBottom = 12;
        
        const headers = ['Name', 'Email', 'Amount', 'Status'];
        const colWidths = [140, 180, 100, 112];
        for (let i = 0; i < headers.length; i++) {
            const cell = figma.createText();
            cell.characters = headers[i];
            cell.fontSize = 12;
            cell.fontName = { family: 'Inter', style: 'Medium' };
            cell.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
            cell.resize(colWidths[i], 16);
            header.appendChild(cell);
        }
        card.appendChild(header);
        
        // Table rows
        const rows = [
            { name: 'John Doe', email: 'john@example.com', amount: '$250.00', status: 'Completed' },
            { name: 'Jane Smith', email: 'jane@example.com', amount: '$150.00', status: 'Pending' },
            { name: 'Bob Wilson', email: 'bob@example.com', amount: '$350.00', status: 'Completed' },
        ];
        
        for (const row of rows) {
            const rowFrame = figma.createFrame();
            rowFrame.name = 'Table Row';
            rowFrame.resize(532, 48);
            rowFrame.layoutMode = 'HORIZONTAL';
            rowFrame.itemSpacing = 0;
            rowFrame.fills = [];
            rowFrame.paddingTop = 14;
            rowFrame.paddingBottom = 14;
            
            const values = [row.name, row.email, row.amount, row.status];
            for (let i = 0; i < values.length; i++) {
                if (i === 3) {
                    // Status badge
                    const badge = figma.createFrame();
                    badge.layoutMode = 'HORIZONTAL';
                    badge.paddingLeft = 8;
                    badge.paddingRight = 8;
                    badge.paddingTop = 4;
                    badge.paddingBottom = 4;
                    badge.cornerRadius = 12;
                    const isCompleted = values[i] === 'Completed';
                    badge.fills = [{ 
                        type: 'SOLID', 
                        color: isCompleted 
                            ? { r: 0.86, g: 0.97, b: 0.9 } 
                            : { r: 1, g: 0.95, b: 0.88 } 
                    }];
                    
                    const statusText = figma.createText();
                    statusText.characters = values[i];
                    statusText.fontSize = 12;
                    statusText.fontName = { family: 'Inter', style: 'Medium' };
                    statusText.fills = [{ 
                        type: 'SOLID', 
                        color: isCompleted 
                            ? { r: 0.08, g: 0.7, b: 0.35 } 
                            : { r: 0.85, g: 0.55, b: 0.2 }
                    }];
                    badge.appendChild(statusText);
                    rowFrame.appendChild(badge);
                } else {
                    const cell = figma.createText();
                    cell.characters = values[i];
                    cell.fontSize = 13;
                    cell.fontName = { family: 'Inter', style: 'Regular' };
                    cell.fills = [{ type: 'SOLID', color: i === 0 ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 0.4, g: 0.4, b: 0.4 } }];
                    cell.resize(colWidths[i], 20);
                    rowFrame.appendChild(cell);
                }
            }
            card.appendChild(rowFrame);
            
            // Divider
            const divider = figma.createLine();
            divider.resize(532, 0);
            divider.strokes = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
            card.appendChild(divider);
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
        
        // Create main frame
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
        
        // Dashboard header
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
        
        // Create grid container
        const grid = figma.createFrame();
        grid.name = 'Components Grid';
        grid.fills = [];
        grid.layoutMode = 'HORIZONTAL';
        grid.layoutWrap = 'WRAP';
        grid.itemSpacing = 20;
        grid.counterAxisSpacing = 20;
        grid.resize(1200, 700);
        
        // Create components
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
    if (msg.type === 'fetch-dashboard') {
        figma.ui.postMessage({ type: 'fetch-started' });
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
});
