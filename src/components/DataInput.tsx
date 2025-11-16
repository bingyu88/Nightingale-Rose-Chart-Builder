import { DataItem } from '../App';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Trash2, Plus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Paintbrush } from 'lucide-react';

interface DataInputProps {
  data: DataItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, updates: Partial<DataItem>) => void;
  onDeleteItem: (id: string) => void;
  showValueInLabel: boolean;
  onToggleShowValue: (value: boolean) => void;
  innerRadius: number;
  onInnerRadiusChange: (value: number) => void;
  gapEnabled: boolean;
  onGapEnabledChange: (value: boolean) => void;
  centerText: string;
  onCenterTextChange: (value: string) => void;
  boldText: boolean;
  onBoldTextChange: (value: boolean) => void;
  onApplyTemplateOne: () => void;
  onResetLabelPositions: () => void;
  centerCircleStrokeWidth: number;
  onCenterCircleStrokeWidthChange: (value: number) => void;
  centerCircleStrokeColor: string;
  onCenterCircleStrokeColorChange: (value: string) => void;
  labelTextColor: string;
  onLabelTextColorChange: (value: string) => void;
  centerTextColor: string;
  onCenterTextColorChange: (value: string) => void;
  onExportConfig: () => void;
  onImportConfig: (file: File) => void;
}

export function DataInput({ data, onAddItem, onUpdateItem, onDeleteItem, showValueInLabel, onToggleShowValue, innerRadius, onInnerRadiusChange, gapEnabled, onGapEnabledChange, centerText, onCenterTextChange, boldText, onBoldTextChange, onApplyTemplateOne, onResetLabelPositions, centerCircleStrokeWidth, onCenterCircleStrokeWidthChange, centerCircleStrokeColor, onCenterCircleStrokeColorChange, labelTextColor, onLabelTextColorChange, centerTextColor, onCenterTextColorChange, onExportConfig, onImportConfig }: DataInputProps) {
  // Calculate total angle
  const totalAngle = data.reduce((sum, item) => sum + item.angle, 0);
  const importRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="space-y-4">
      {/* Display Options */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="show-value">在图形标签上显示数值</Label>
            <p className="text-slate-600">启用后标签显示为"区名 数值"格式</p>
          </div>
          <Switch
            id="show-value"
            checked={showValueInLabel}
            onCheckedChange={onToggleShowValue}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="gap-enabled">色块之间的空隙</Label>
            <p className="text-slate-600">启用后切片之间将出现分隔空隙</p>
          </div>
          <Switch
            id="gap-enabled"
            checked={gapEnabled}
            onCheckedChange={onGapEnabledChange}
          />
        </div>
        
        <div>
          <Label htmlFor="inner-radius">中心圆半径</Label>
          <div className="flex items-center gap-3 mt-2">
          <Input
            id="inner-radius"
            type="number"
            value={innerRadius}
            onChange={(e) => onInnerRadiusChange(parseFloat(e.target.value))}
            min="0"
            max="150"
            step="0.01"
            className="w-24"
          />
            <span className="text-slate-600">px</span>
          </div>
        </div>
        
        {/* Center Text */}
        <div>
          <Label htmlFor="center-text">中心圆文字</Label>
          <Input id="center-text" value={centerText} onChange={(e) => onCenterTextChange(e.target.value)} placeholder="在这里输入中心文字" className="mt-2" />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <Label>线粗</Label>
            <Input type="number" value={centerCircleStrokeWidth} onChange={(e) => onCenterCircleStrokeWidthChange(Number(e.target.value))} min="0.5" max="10" step="0.5" className="w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Label>线色</Label>
            <Input type="color" value={centerCircleStrokeColor} onChange={(e) => onCenterCircleStrokeColorChange(e.target.value)} className="w-12 h-8 p-0" />
          </div>
          <div className="flex items-center gap-2">
            <Label>中心字色</Label>
            <Input type="color" value={centerTextColor} onChange={(e) => onCenterTextColorChange(e.target.value)} className="w-12 h-8 p-0" />
          </div>
          <div className="flex items-center gap-2">
            <Label>标签字色</Label>
            <Input type="color" value={labelTextColor} onChange={(e) => onLabelTextColorChange(e.target.value)} className="w-12 h-8 p-0" />
          </div>
        </div>

        {/* Bold Text Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="bold-text">字体加粗</Label>
          <Switch
            id="bold-text"
            checked={boldText}
            onCheckedChange={onBoldTextChange}
          />
        </div>

        <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportConfig(f); e.currentTarget.value=''; }} />
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onApplyTemplateOne} className="w-full">应用模板一（官方配色）</Button>
          <Button onClick={onResetLabelPositions} variant="outline" className="w-full">重置标签位置</Button>
          <Button onClick={onExportConfig} variant="secondary" className="w-full">导出配置</Button>
          <Button onClick={() => importRef.current?.click()} variant="secondary" className="w-full">导入配置</Button>
        </div>
        
      </div>

      {/* Angle Summary */}
      <div className={`p-3 rounded-lg border text-center ${
        Math.abs(totalAngle - 360) < 0.1 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        角度总和: {totalAngle.toFixed(2)}° / 360°
      </div>

      <ScrollArea className="h-[420px] pr-3">
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label htmlFor={`name-${item.id}`}>名称</Label>
                      <Input id={`name-${item.id}`} value={item.name} onChange={(e) => onUpdateItem(item.id, { name: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`value-${item.id}`}>数值</Label>
                      <Input id={`value-${item.id}`} type="number" value={item.value} onChange={(e) => onUpdateItem(item.id, { value: parseFloat(e.target.value) })} min="0" step="0.01" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`angle-${item.id}`}>角度</Label>
                      <Input id={`angle-${item.id}`} type="number" value={item.angle} onChange={(e) => onUpdateItem(item.id, { angle: parseFloat(e.target.value) })} min="0" max="360" step="0.01" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`radius-${item.id}`}>半径</Label>
                      <Input id={`radius-${item.id}`} type="number" value={item.radius} onChange={(e) => onUpdateItem(item.id, { radius: parseFloat(e.target.value) })} min="1" step="0.01" className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor={`fontSize-${item.id}`}>字体大小</Label>
                      <Input id={`fontSize-${item.id}`} type="number" value={item.fontSize ?? 12} onChange={(e) => onUpdateItem(item.id, { fontSize: Number(e.target.value) })} min="8" max="48" step="1" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`labelColor-${item.id}`}>标签颜色</Label>
                      <Input id={`labelColor-${item.id}`} type="color" value={item.labelColor ?? labelTextColor} onChange={(e) => onUpdateItem(item.id, { labelColor: e.target.value })} className="mt-1 h-10 p-0" />
                    </div>
                    <div>
                      <Label htmlFor={`color-${item.id}`}>色块颜色</Label>
                      <Input id={`color-${item.id}`} type="color" value={item.color} onChange={(e) => onUpdateItem(item.id, { color: e.target.value })} className="mt-1 h-10 p-0" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteItem(item.id)}
                  className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button onClick={onAddItem} className="w-full" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        添加数据项
      </Button>
    </div>
  );
}