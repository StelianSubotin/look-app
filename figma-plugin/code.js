// Lookscout Dashboard Importer - Figma Plugin v4 (Stable)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Chart data
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

// Load fonts helper
function loadFonts() {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    });
}

// Create simple icon (circle with symbol)
function createIcon(type, size, color) {
    const frame = figma.createFrame();
    frame.name = 'Icon';
    frame.resize(size, size);
    frame.fills = [];
    
    if (type === 'dollar') {
        const circle = figma.createEllipse();
        circle.resize(size, size);
        circle.fills = [];
        circle.strokes = [{ type: 'SOLID', color: color }];
        circle.strokeWeight = 1.5;
        frame.appendChild(circle);
        
        const text = figma.createText();
        text.characters = '$';
        text.fontSize = size * 0.6;
        text.fills = [{ type: 'SOLID', color: color }];
        text.x = size * 0.32;
        text.y = size * 0.15;
        frame.appendChild(text);
    } else if (type === 'cart') {
        const rect = figma.createRectangle();
        rect.resize(size * 0.8, size * 0.6);
        rect.x = size * 0.1;
        rect.y = size * 0.2;
        rect.cornerRadius = 2;
        rect.fills = [];
        rect.strokes = [{ type: 'SOLID', color: color }];
        rect.strokeWeight = 1.5;
        frame.appendChild(rect);
    } else if (type === 'users') {
        const head = figma.createEllipse();
        head.resize(size * 0.4, size * 0.4);
        head.x = size * 0.3;
        head.y = size * 0.1;
        head.fills = [];
        head.strokes = [{ type: 'SOLID', color: color }];
        head.strokeWeight = 1.5;
        frame.appendChild(head);
        
        const body = figma.createRectangle();
        body.resize(size * 0.6, size * 0.3);
        body.x = size * 0.2;
        body.y = size * 0.55;
        body.topLeftRadius = size * 0.3;
        body.topRightRadius = size * 0.3;
        body.fills = [];
        body.strokes = [{ type: 'SOLID', color: color }];
        body.strokeWeight = 1.5;
        frame.appendChild(body);
    } else {
        // Activity/default - simple chart icon
        const line1 = figma.createRectangle();
        line1.resize(size * 0.15, size * 0.5);
        line1.x = size * 0.15;
        line1.y = size * 0.4;
        line1.cornerRadius = 1;
        line1.fills = [{ type: 'SOLID', color: color }];
        frame.appendChild(line1);
        
        const line2 = figma.createRectangle();
        line2.resize(size * 0.15, size * 0.7);
        line2.x = size * 0.42;
        line2.y = size * 0.2;
        line2.cornerRadius = 1;
        line2.fills = [{ type: 'SOLID', color: color }];
        frame.appendChild(line2);
        
        const line3 = figma.createRectangle();
        line3.resize(size * 0.15, size * 0.4);
        line3.x = size * 0.7;
        line3.y = size * 0.5;
        line3.cornerRadius = 1;
        line3.fills = [{ type: 'SOLID', color: color }];
        frame.appendChild(line3);
    }
    
    return frame;
}

// Stat Card
function createStatCard(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Stat Card - ' + (props.title || 'Metric');
        card.resize(280, 140);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
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
        const icon = createIcon(props.icon || 'activity', 20, { r: 0.6, g: 0.6, b: 0.6 });
        icon.x = 236;
        icon.y = 18;
        card.appendChild(icon);
        
        // Value
        const value = figma.createText();
        value.characters = props.value || '$0';
        value.fontSize = 30;
        value.fontName = { family: 'Inter', style: 'Bold' };
        value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        value.x = 24;
        value.y = 50;
        card.appendChild(value);
        
        // Change
        const isPositive = props.changeType === 'positive';
        const changeColor = isPositive 
            ? { r: 0.13, g: 0.55, b: 0.13 }
            : { r: 0.86, g: 0.08, b: 0.24 };
        
        const arrow = figma.createText();
        arrow.characters = isPositive ? '↗' : '↘';
        arrow.fontSize = 14;
        arrow.fontName = { family: 'Inter', style: 'Medium' };
        arrow.fills = [{ type: 'SOLID', color: changeColor }];
        arrow.x = 24;
        arrow.y = 98;
        card.appendChild(arrow);
        
        const change = figma.createText();
        change.characters = (props.change || '+0%') + ' from last month';
        change.fontSize = 12;
        change.fontName = { family: 'Inter', style: 'Regular' };
        change.fills = [{ type: 'SOLID', color: changeColor }];
        change.x = 42;
        change.y = 100;
        card.appendChild(change);
        
        return card;
    });
}

// Mini Stat Card
function createMiniStatCard(props) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Mini Stat - ' + (props.label || 'Label');
        card.resize(280, 120);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        const colorMap = {
            blue: { bg: { r: 0.92, g: 0.95, b: 1 }, text: { r: 0.23, g: 0.51, b: 0.97 } },
            green: { bg: { r: 0.92, g: 0.98, b: 0.95 }, text: { r: 0.06, g: 0.73, b: 0.51 } },
            red: { bg: { r: 1, g: 0.93, b: 0.93 }, text: { r: 0.86, g: 0.08, b: 0.24 } },
            purple: { bg: { r: 0.95, g: 0.93, b: 1 }, text: { r: 0.55, g: 0.36, b: 0.97 } },
            orange: { bg: { r: 1, g: 0.96, b: 0.92 }, text: { r: 0.96, g: 0.62, b: 0.36 } },
        };
        const colors = colorMap[props.color] || colorMap.blue;
        
        // Badge
        const badge = figma.createFrame();
        badge.cornerRadius = 4;
        badge.fills = [{ type: 'SOLID', color: colors.bg }];
        badge.x = 24;
        badge.y = 24;
        badge.layoutMode = 'HORIZONTAL';
        badge.paddingLeft = 10;
        badge.paddingRight = 10;
        badge.paddingTop = 4;
        badge.paddingBottom = 4;
        badge.primaryAxisSizingMode = 'AUTO';
        badge.counterAxisSizingMode = 'AUTO';
        
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
        value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        value.x = 24;
        value.y = 60;
        card.appendChild(value);
        
        return card;
    });
}

// Line Chart
function createLineChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Line Chart - ' + (props.title || 'Chart');
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        card.clipsContent = true;
        
        // Title
        const title = figma.createText();
        title.characters = props.title || 'Revenue Over Time';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Semi Bold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
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
        
        // Calculate points
        const points = data.map((d, i) => ({
            x: chartX + (chartWidth / (data.length - 1)) * i,
            y: chartY + chartHeight - (d.value / maxValue) * chartHeight
        }));
        
        // Draw line segments
        for (let i = 0; i < points.length - 1; i++) {
            const line = figma.createLine();
            line.x = points[i].x;
            line.y = points[i].y;
            
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            line.resize(length, 0);
            line.rotation = -angle;
            line.strokes = [{ type: 'SOLID', color: primaryColor }];
            line.strokeWeight = 2;
            line.strokeCap = 'ROUND';
            card.appendChild(line);
        }
        
        // Data points and X labels
        for (let i = 0; i < points.length; i++) {
            const point = figma.createEllipse();
            point.resize(8, 8);
            point.x = points[i].x - 4;
            point.y = points[i].y - 4;
            point.fills = [{ type: 'SOLID', color: primaryColor }];
            point.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            point.strokeWeight = 2;
            card.appendChild(point);
            
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            xLabel.x = points[i].x - 10;
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Bar Chart
function createBarChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Bar Chart - ' + (props.title || 'Chart');
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        const title = figma.createText();
        title.characters = props.title || 'Sales by Day';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Semi Bold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const chartX = 55;
        const chartY = 55;
        const chartWidth = 490;
        const chartHeight = 180;
        const data = barChartData;
        const maxValue = 200;
        
        // Grid
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
            
            // X label
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

// Pie Chart
function createPieChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Pie Chart - ' + (props.title || 'Chart');
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        const title = figma.createText();
        title.characters = props.title || 'Traffic by Device';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Semi Bold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
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
            pctText.characters = pct + '%';
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

// Area Chart
function createAreaChart(props, primaryColor) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Area Chart - ' + (props.title || 'Chart');
        card.resize(580, 300);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        card.clipsContent = true;
        
        const title = figma.createText();
        title.characters = props.title || 'Traffic Overview';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Semi Bold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
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
        
        const points = data.map((d, i) => ({
            x: chartX + (chartWidth / (data.length - 1)) * i,
            y: chartY + chartHeight - (d.value / maxValue) * chartHeight
        }));
        
        // Area fill (simplified)
        for (let i = 0; i < points.length - 1; i++) {
            const rect = figma.createRectangle();
            const minY = Math.min(points[i].y, points[i + 1].y);
            rect.x = points[i].x;
            rect.y = minY;
            rect.resize(points[i + 1].x - points[i].x, chartY + chartHeight - minY);
            rect.fills = [{ type: 'SOLID', color: primaryColor, opacity: 0.15 }];
            card.appendChild(rect);
        }
        
        // Lines
        for (let i = 0; i < points.length - 1; i++) {
            const line = figma.createLine();
            line.x = points[i].x;
            line.y = points[i].y;
            
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            line.resize(length, 0);
            line.rotation = -angle;
            line.strokes = [{ type: 'SOLID', color: primaryColor }];
            line.strokeWeight = 2;
            card.appendChild(line);
        }
        
        // X labels
        for (let i = 0; i < data.length; i++) {
            const xLabel = figma.createText();
            xLabel.characters = data[i].name;
            xLabel.fontSize = 11;
            xLabel.fontName = { family: 'Inter', style: 'Regular' };
            xLabel.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            xLabel.x = points[i].x - 10;
            xLabel.y = chartY + chartHeight + 10;
            card.appendChild(xLabel);
        }
        
        return card;
    });
}

// Data Table
function createDataTable(props) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const card = figma.createFrame();
        card.name = 'Table - ' + (props.title || 'Data');
        card.resize(580, 260);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.strokeWeight = 1;
        
        const title = figma.createText();
        title.characters = props.title || 'Recent Transactions';
        title.fontSize = 16;
        title.fontName = { family: 'Inter', style: 'Semi Bold' };
        title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        title.x = 24;
        title.y = 20;
        card.appendChild(title);
        
        const colX = [24, 130, 310, 420];
        const headers = ['Name', 'Email', 'Amount', 'Status'];
        
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
                    ? { r: 0.86, g: 0.97, b: 0.9 }
                    : { r: 1, g: 0.95, b: 0.88 }
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
                    ? { r: 0.13, g: 0.55, b: 0.27 }
                    : { r: 0.8, g: 0.52, b: 0.13 }
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

// Alert Card
function createAlertCard(props) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const alertColors = {
            info: { border: { r: 0.23, g: 0.51, b: 0.97 }, bg: { r: 0.95, g: 0.97, b: 1 } },
            warning: { border: { r: 0.96, g: 0.62, b: 0.36 }, bg: { r: 1, g: 0.97, b: 0.94 } },
            error: { border: { r: 0.86, g: 0.08, b: 0.24 }, bg: { r: 1, g: 0.95, b: 0.95 } },
            success: { border: { r: 0.13, g: 0.55, b: 0.27 }, bg: { r: 0.94, g: 0.98, b: 0.95 } }
        };
        const colors = alertColors[props.type] || alertColors.info;
        
        const card = figma.createFrame();
        card.name = 'Alert - ' + (props.title || 'Alert');
        card.resize(280, 100);
        card.cornerRadius = 12;
        card.fills = [{ type: 'SOLID', color: colors.bg }];
        card.strokes = [{ type: 'SOLID', color: colors.border }];
        card.strokeWeight = 1;
        
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

// Main create dashboard
function createDashboard(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFonts();
        
        const primaryColor = hexToRgb((data.theme && data.theme.primaryColor) || '#3b82f6');
        
        const dashboard = figma.createFrame();
        dashboard.name = data.name || 'Lookscout Dashboard';
        dashboard.resize(1280, 900);
        dashboard.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
        dashboard.layoutMode = 'VERTICAL';
        dashboard.paddingLeft = 40;
        dashboard.paddingRight = 40;
        dashboard.paddingTop = 40;
        dashboard.paddingBottom = 40;
        dashboard.itemSpacing = 24;
        
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
        heading.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
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
            
            try {
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
            } catch (e) {
                console.error('Error creating component:', comp.type, e);
            }
            
            if (node) grid.appendChild(node);
        }
        
        dashboard.appendChild(grid);
        figma.currentPage.appendChild(dashboard);
        figma.viewport.scrollAndZoomIntoView([dashboard]);
        
        return dashboard;
    });
}

// Plugin UI
figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = function(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.type === 'import-dashboard') {
            try {
                const data = JSON.parse(msg.data);
                yield createDashboard(data);
                figma.ui.postMessage({ type: 'success', message: 'Dashboard imported!' });
                figma.notify('Dashboard imported! 🎉');
            } catch (error) {
                console.error(error);
                figma.ui.postMessage({ type: 'error', message: 'Error: ' + error.message });
                figma.notify('Failed to import', { error: true });
            }
        }
        if (msg.type === 'cancel') {
            figma.closePlugin();
        }
    });
};
