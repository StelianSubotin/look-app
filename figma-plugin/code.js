// LookScout Dashboard Importer - Figma Plugin v2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

// Load fonts
function loadFonts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4, figma.loadFontAsync({ family: 'Inter', style: 'Regular' })];
                case 1:
                    _a.sent();
                    return [4, figma.loadFontAsync({ family: 'Inter', style: 'Medium' })];
                case 2:
                    _a.sent();
                    return [4, figma.loadFontAsync({ family: 'Inter', style: 'Bold' })];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log('Font loading error (using default):', error_1);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}

// Find component by ID
function findComponentById(nodeId) {
    return __awaiter(this, void 0, void 0, function () {
        var cleanId, node, allComponents, _i, allComponents_1, comp, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cleanId = nodeId.replace('-', ':');
                    return [4, figma.getNodeByIdAsync(cleanId)];
                case 1:
                    node = _a.sent();
                    if (node && node.type === 'COMPONENT') {
                        return [2, node];
                    }
                    allComponents = figma.root.findAll(function (node) { return node.type === 'COMPONENT'; });
                    for (_i = 0, allComponents_1 = allComponents; _i < allComponents_1.length; _i++) {
                        comp = allComponents_1[_i];
                        if (comp.id === cleanId || comp.id === nodeId) {
                            return [2, comp];
                        }
                    }
                    return [2, null];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error finding component:', error_2);
                    return [2, null];
                case 3: return [2];
            }
        });
    });
}

// Create KPI card instance
function createKpiCardInstance(component, data, x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var instance, textNodes, _i, textNodes_1, textNode, name_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = component.createInstance();
                    instance.x = x;
                    instance.y = y;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, loadFonts()];
                case 2:
                    _a.sent();
                    textNodes = instance.findAll(function (node) { return node.type === 'TEXT'; });
                    for (_i = 0, textNodes_1 = textNodes; _i < textNodes_1.length; _i++) {
                        textNode = textNodes_1[_i];
                        name_1 = textNode.name.toLowerCase();
                        if (name_1.includes('metric') || name_1.includes('name') || name_1.includes('title')) {
                            textNode.characters = data.name || 'Metric';
                        }
                        else if (name_1.includes('stat') || name_1.includes('value')) {
                            textNode.characters = data.stat || '0';
                        }
                        else if (name_1.includes('previous') || name_1.includes('from')) {
                            textNode.characters = "from " + (data.previousStat || '0');
                        }
                        else if (name_1.includes('change') || name_1.includes('percent')) {
                            textNode.characters = data.change || '0%';
                        }
                    }
                    return [3, 4];
                case 3:
                    error_3 = _a.sent();
                    console.log('Text update error:', error_3);
                    return [3, 4];
                case 4: return [2, instance];
            }
        });
    });
}

// Fallback KPI card
function createFallbackKpiCard(data, x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var card, nameText, valueRow, statText, fromText, changeRow, isPositive, changeText, periodText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, loadFonts()];
                case 1:
                    _a.sent();
                    card = figma.createFrame();
                    card.name = "KPI Card - " + data.name;
                    card.resize(320, 160);
                    card.x = x;
                    card.y = y;
                    card.cornerRadius = 8;
                    card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
                    card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.906, b: 0.922 } }];
                    card.strokeWeight = 1;
                    card.effects = [{
                            type: 'DROP_SHADOW',
                            color: { r: 0, g: 0, b: 0, a: 0.1 },
                            offset: { x: 0, y: 1 },
                            radius: 3,
                            visible: true,
                            blendMode: 'NORMAL'
                        }];
                    card.layoutMode = 'VERTICAL';
                    card.paddingLeft = 24;
                    card.paddingRight = 24;
                    card.paddingTop = 20;
                    card.paddingBottom = 20;
                    card.itemSpacing = 12;
                    nameText = figma.createText();
                    nameText.characters = data.name || 'Metric';
                    nameText.fontSize = 14;
                    nameText.fontName = { family: 'Inter', style: 'Medium' };
                    nameText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.447, b: 0.502 } }];
                    card.appendChild(nameText);
                    valueRow = figma.createFrame();
                    valueRow.name = 'Value Row';
                    valueRow.layoutMode = 'HORIZONTAL';
                    valueRow.itemSpacing = 10;
                    valueRow.fills = [];
                    statText = figma.createText();
                    statText.characters = data.stat || '0';
                    statText.fontSize = 30;
                    statText.fontName = { family: 'Inter', style: 'Bold' };
                    statText.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.094, b: 0.157 } }];
                    valueRow.appendChild(statText);
                    fromText = figma.createText();
                    fromText.characters = "from " + (data.previousStat || '0');
                    fromText.fontSize = 14;
                    fromText.fontName = { family: 'Inter', style: 'Regular' };
                    fromText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.447, b: 0.502 } }];
                    valueRow.appendChild(fromText);
                    card.appendChild(valueRow);
                    changeRow = figma.createFrame();
                    changeRow.name = 'Change Row';
                    changeRow.layoutMode = 'HORIZONTAL';
                    changeRow.itemSpacing = 8;
                    changeRow.fills = [];
                    isPositive = data.changeType === 'positive';
                    changeText = figma.createText();
                    changeText.characters = "" + (data.change || '0%');
                    changeText.fontSize = 14;
                    changeText.fontName = { family: 'Inter', style: 'Medium' };
                    changeText.fills = [{
                            type: 'SOLID',
                            color: isPositive
                                ? { r: 0.047, g: 0.435, b: 0.188 }
                                : { r: 0.565, g: 0.110, b: 0.110 }
                        }];
                    changeRow.appendChild(changeText);
                    periodText = figma.createText();
                    periodText.characters = 'from previous month';
                    periodText.fontSize = 14;
                    periodText.fontName = { family: 'Inter', style: 'Regular' };
                    periodText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.447, b: 0.502 } }];
                    changeRow.appendChild(periodText);
                    card.appendChild(changeRow);
                    return [2, card];
            }
        });
    });
}

// Main import function
function importDashboard(data) {
    return __awaiter(this, void 0, void 0, function () {
        var dashboard, titleText, container, _i, _a, comp, node, figmaComponent, _b, _c, error_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, loadFonts()];
                case 1:
                    _d.sent();
                    dashboard = figma.createFrame();
                    dashboard.name = data.title || 'LookScout Dashboard';
                    dashboard.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
                    dashboard.layoutMode = 'VERTICAL';
                    dashboard.paddingLeft = 40;
                    dashboard.paddingRight = 40;
                    dashboard.paddingTop = 40;
                    dashboard.paddingBottom = 40;
                    dashboard.itemSpacing = 24;
                    titleText = figma.createText();
                    titleText.characters = data.title || 'Dashboard';
                    titleText.fontSize = 32;
                    titleText.fontName = { family: 'Inter', style: 'Bold' };
                    titleText.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.094, b: 0.157 } }];
                    dashboard.appendChild(titleText);
                    container = figma.createFrame();
                    container.name = 'Components';
                    container.fills = [];
                    container.layoutMode = 'HORIZONTAL';
                    container.layoutWrap = 'WRAP';
                    container.itemSpacing = 24;
                    container.counterAxisSpacing = 24;
                    _i = 0, _a = data.components;
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3, 11];
                    comp = _a[_i];
                    node = null;
                    if (!(comp.type === 'kpi-card')) return [3, 9];
                    return [4, findComponentById(comp.figmaComponentId)];
                case 3:
                    figmaComponent = _d.sent();
                    if (!figmaComponent) return [3, 6];
                    _b = node;
                    return [4, createKpiCardInstance(figmaComponent, comp.data, comp.position.x, comp.position.y)];
                case 4:
                    _b = _d.sent();
                    return [3, 8];
                case 5: return [3, 8];
                case 6:
                    console.log("Component " + comp.figmaComponentId + " not found, using fallback");
                    _c = node;
                    return [4, createFallbackKpiCard(comp.data, comp.position.x, comp.position.y)];
                case 7:
                    _c = _d.sent();
                    _d.label = 8;
                case 8: return [3, 10];
                case 9:
                    _d.label = 10;
                case 10:
                    if (node) {
                        container.appendChild(node);
                    }
                    _i++;
                    return [3, 2];
                case 11:
                    dashboard.appendChild(container);
                    dashboard.resize(Math.max(800, container.width + 80), titleText.height + container.height + 104);
                    figma.currentPage.appendChild(dashboard);
                    figma.viewport.scrollAndZoomIntoView([dashboard]);
                    figma.currentPage.selection = [dashboard];
                    return [2, dashboard];
            }
        });
    });
}
// Show UI
figma.showUI(__html__, { width: 500, height: 600 });
// Handle messages
figma.ui.onmessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_5, errorMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(msg.type === 'import-dashboard')) return [3, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                data = JSON.parse(msg.data);
                if (!data.components || data.components.length === 0) {
                    throw new Error('No components to import');
                }
                return [4, importDashboard(data)];
            case 2:
                _a.sent();
                figma.ui.postMessage({ type: 'success', message: 'Dashboard imported successfully!' });
                figma.notify('✨ Dashboard imported successfully!', { timeout: 3000 });
                return [3, 4];
            case 3:
                error_5 = _a.sent();
                errorMsg = error_5 instanceof Error ? error_5.message : 'Unknown error';
                figma.ui.postMessage({ type: 'error', message: "Error: " + errorMsg });
                figma.notify("\u274C Import failed: " + errorMsg, { error: true });
                return [3, 4];
            case 4: return [3, 6];
            case 5:
                if (msg.type === 'cancel') {
                    figma.closePlugin();
                }
                _a.label = 6;
            case 6: return [2];
        }
    });
}); };
