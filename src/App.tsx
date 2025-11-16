import { useState } from 'react';
import { RoseChart } from './components/RoseChart';
import { DataInput } from './components/DataInput';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';

export interface DataItem {
  id: string;
  name: string;
  value: number;
  angle: number; // 角度（度数）
  radius: number; // 半径长度
  color: string;
  fontSize?: number;
  labelX?: number; // 标签X坐标偏移
  labelY?: number; // 标签Y坐标偏移
  labelColor?: string; // 标签文字颜色
}

export default function App() {
  const [data, setData] = useState<DataItem[]>([
    { id: '1', name: '黄浦', value: 95, angle: 30, radius: 120, color: '#ef4444' },
    { id: '2', name: '徐汇', value: 92, angle: 28, radius: 113, color: '#f97316' },
    { id: '3', name: '长宁', value: 88, angle: 25, radius: 106, color: '#f59e0b' },
    { id: '4', name: '静安', value: 85, angle: 24, radius: 99, color: '#eab308' },
    { id: '5', name: '普陀', value: 82, angle: 23, radius: 92, color: '#84cc16' },
    { id: '6', name: '虹口', value: 80, angle: 22, radius: 85, color: '#22c55e' },
    { id: '7', name: '杨浦', value: 78, angle: 21, radius: 78, color: '#10b981' },
    { id: '8', name: '浦东', value: 76, angle: 26, radius: 71, color: '#14b8a6' },
    { id: '9', name: '闵行', value: 75, angle: 24, radius: 64, color: '#06b6d4' },
    { id: '10', name: '宝山', value: 72, angle: 22, radius: 57, color: '#0ea5e9' },
    { id: '11', name: '嘉定', value: 70, angle: 20, radius: 50, color: '#3b82f6' },
    { id: '12', name: '金山', value: 68, angle: 18, radius: 43, color: '#6366f1' },
    { id: '13', name: '松江', value: 66, angle: 20, radius: 36, color: '#8b5cf6' },
    { id: '14', name: '青浦', value: 65, angle: 19, radius: 29, color: '#a855f7' },
    { id: '15', name: '奉贤', value: 62, angle: 18, radius: 22, color: '#d946ef' },
    { id: '16', name: '崇明', value: 60, angle: 20, radius: 15, color: '#ec4899' },
  ]);

  const [showValueInLabel, setShowValueInLabel] = useState(true);
  const [innerRadius, setInnerRadius] = useState(50);
  const [gapEnabled, setGapEnabled] = useState(false);
  const [centerText, setCenterText] = useState('');
  const [boldText, setBoldText] = useState(true);
  const [centerCircleStrokeWidth, setCenterCircleStrokeWidth] = useState(1);
  const [centerCircleStrokeColor, setCenterCircleStrokeColor] = useState('#3b82f6');
  const [labelTextColor, setLabelTextColor] = useState('#334155');
  const [centerTextColor, setCenterTextColor] = useState('#334155');

  const exportConfig = () => {
    const config = {
      data,
      showValueInLabel,
      innerRadius,
      gapEnabled,
      centerText,
      boldText,
      centerCircleStrokeWidth,
      centerCircleStrokeColor,
      labelTextColor,
      centerTextColor,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rose-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = async (file: File) => {
    const text = await file.text();
    try {
      const cfg = JSON.parse(text);
      if (Array.isArray(cfg.data)) setData(cfg.data);
      if (typeof cfg.showValueInLabel === 'boolean') setShowValueInLabel(cfg.showValueInLabel);
      if (typeof cfg.innerRadius === 'number') setInnerRadius(cfg.innerRadius);
      if (typeof cfg.gapEnabled === 'boolean') setGapEnabled(cfg.gapEnabled);
      if (typeof cfg.centerText === 'string') setCenterText(cfg.centerText);
      if (typeof cfg.boldText === 'boolean') setBoldText(cfg.boldText);
      if (typeof cfg.centerCircleStrokeWidth === 'number') setCenterCircleStrokeWidth(cfg.centerCircleStrokeWidth);
      if (typeof cfg.centerCircleStrokeColor === 'string') setCenterCircleStrokeColor(cfg.centerCircleStrokeColor);
      if (typeof cfg.labelTextColor === 'string') setLabelTextColor(cfg.labelTextColor);
      if (typeof cfg.centerTextColor === 'string') setCenterTextColor(cfg.centerTextColor);
    } catch (e) {}
  };

  // Sort data by value in descending order for display
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const handleAddItem = () => {
    // Find the minimum radius and subtract 1
    const minRadius = data.length > 0 ? Math.min(...data.map(d => d.radius)) - 1 : 100;
    
    const newItem: DataItem = {
      id: Date.now().toString(),
      name: `数据${data.length + 1}`,
      value: 50,
      angle: 20,
      radius: minRadius,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    };
    setData([...data, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<DataItem>) => {
    setData(data.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleDeleteItem = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const applyTemplateOne = () => {
    const templateColors = [
      { r: 57, g: 124, b: 186 },   // 1
      { r: 189, g: 215, b: 238 }, // 2
      { r: 57, g: 124, b: 186 },   // 3
      { r: 189, g: 215, b: 238 }, // 4
      { r: 57, g: 124, b: 186 },   // 5
      { r: 189, g: 215, b: 238 }, // 6
      { r: 57, g: 124, b: 186 },   // 7
      { r: 189, g: 215, b: 238 }, // 8
      { r: 166, g: 166, b: 166 }, // 9
      { r: 217, g: 217, b: 217 }, // 10
      { r: 166, g: 166, b: 166 }, // 11
      { r: 217, g: 217, b: 217 }, // 12
      { r: 166, g: 166, b: 166 }, // 13
      { r: 217, g: 217, b: 217 }, // 14
      { r: 166, g: 166, b: 166 }, // 15
      { r: 217, g: 217, b: 217 }, // 16
    ];
    setData(data.map((item, idx) => {
      const c = templateColors[idx % templateColors.length];
      return { ...item, color: `rgb(${c.r},${c.g},${c.b})` };
    }));
  };

  const handleLabelDrag = (id: string, x: number, y: number) => {
    handleUpdateItem(id, { labelX: x, labelY: y });
  };

  const resetLabelPositions = () => {
    setData(data.map(item => ({ ...item, labelX: undefined, labelY: undefined })));
  };

  const downloadChart = () => {
    const svg = document.querySelector('#rose-chart-svg') as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = 3840; // 4K
      canvas.height = 3840;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nightingale-rose-4k.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
  };

  const downloadSVG = () => {
    const svg = document.querySelector('#rose-chart-svg') as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nightingale-rose.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-slate-900 mb-2">南丁格尔玫瑰图制作工具</h1>
          <p className="text-slate-600">输入数据并自定义颜色，实时预览玫瑰图效果</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>玫瑰图预览</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => downloadSVG()}>下载 SVG</Button>
                <Button onClick={() => downloadChart()}>下载 4K PNG</Button>
              </div>
            </CardHeader>
            <CardContent>
              <RoseChart data={sortedData} showValueInLabel={showValueInLabel} innerRadius={innerRadius} gapEnabled={gapEnabled} centerText={centerText} boldText={boldText} onLabelDrag={handleLabelDrag} centerCircleStrokeWidth={centerCircleStrokeWidth} centerCircleStrokeColor={centerCircleStrokeColor} labelTextColor={labelTextColor} centerTextColor={centerTextColor} onUpdateItem={handleUpdateItem} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>数据设置</CardTitle>
            </CardHeader>
            <CardContent>
              <DataInput
                data={data}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                showValueInLabel={showValueInLabel}
                onToggleShowValue={setShowValueInLabel}
                innerRadius={innerRadius}
                onInnerRadiusChange={setInnerRadius}
                gapEnabled={gapEnabled}
                onGapEnabledChange={setGapEnabled}
                centerText={centerText}
                onCenterTextChange={setCenterText}
                boldText={boldText}
                onBoldTextChange={setBoldText}
                onApplyTemplateOne={applyTemplateOne}
                onResetLabelPositions={resetLabelPositions}
                centerCircleStrokeWidth={centerCircleStrokeWidth}
                onCenterCircleStrokeWidthChange={setCenterCircleStrokeWidth}
                centerCircleStrokeColor={centerCircleStrokeColor}
                onCenterCircleStrokeColorChange={setCenterCircleStrokeColor}
                labelTextColor={labelTextColor}
                onLabelTextColorChange={setLabelTextColor}
                centerTextColor={centerTextColor}
                onCenterTextColorChange={setCenterTextColor}
                onExportConfig={exportConfig}
                onImportConfig={importConfig}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
