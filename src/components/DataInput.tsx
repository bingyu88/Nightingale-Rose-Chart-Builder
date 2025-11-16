import { DataItem } from '../App';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Switch } from './ui/switch';


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
  const [index, setIndex] = useState(0);
  const selected = data[index] ?? null;
  const goto = (i: number) => {
    if (data.length === 0) return;
    const n = ((i % data.length) + data.length) % data.length;
    setIndex(n);
  };
  
  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2"><Label className="text-xs">显示数值</Label><Switch id="show-value" checked={showValueInLabel} onCheckedChange={onToggleShowValue} /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">切片空隙</Label><Switch id="gap-enabled" checked={gapEnabled} onCheckedChange={onGapEnabledChange} /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">字体加粗</Label><Switch id="bold-text" checked={boldText} onCheckedChange={onBoldTextChange} /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">中心文字</Label><Input id="center-text" value={centerText} onChange={(e) => onCenterTextChange(e.target.value)} placeholder="中心文字" className="h-8 w-32" /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">中心半径</Label><Input id="inner-radius" type="number" value={innerRadius} onChange={(e) => onInnerRadiusChange(parseFloat(e.target.value))} min="0" max="150" step="0.01" className="h-8 w-24" /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">中心线宽</Label><Input id="stroke-width" type="number" value={centerCircleStrokeWidth} onChange={(e) => onCenterCircleStrokeWidthChange(Number(e.target.value))} min="0.5" max="10" step="0.5" className="h-8 w-20" /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">中心线色</Label><Input id="stroke-color" type="color" value={centerCircleStrokeColor} onChange={(e) => onCenterCircleStrokeColorChange(e.target.value)} className="h-8 w-10 p-0" /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">中心字色</Label><Input id="center-text-color" type="color" value={centerTextColor} onChange={(e) => onCenterTextColorChange(e.target.value)} className="h-8 w-10 p-0" /></div>
          <div className="flex items-center gap-2"><Label className="text-xs">标签字色</Label><Input id="label-text-color" type="color" value={labelTextColor} onChange={(e) => onLabelTextColorChange(e.target.value)} className="h-8 w-10 p-0" /></div>
          <Button onClick={onApplyTemplateOne} className="h-8 px-2">模板一</Button>
          <Button onClick={onResetLabelPositions} variant="outline" className="h-8 px-2">重置标签</Button>
          <Button onClick={onExportConfig} variant="secondary" className="h-8 px-2">导出配置</Button>
          <Button onClick={() => importRef.current?.click()} variant="secondary" className="h-8 px-2">导入配置</Button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportConfig(f); e.currentTarget.value=''; }}
          />
        </div>
        <div className="text-center text-sm">角度总和: {totalAngle.toFixed(2)}° / 360°</div>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">数据项 {data.length === 0 ? 0 : index + 1} / {data.length}</div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 px-2" onClick={() => goto(index - 1)}>上一项</Button>
            <Button variant="outline" className="h-8 px-2" onClick={() => goto(index + 1)}>下一项</Button>
          </div>
        </div>
        {selected ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>名称</Label>
              <Input value={selected.name} onChange={(e) => onUpdateItem(selected.id, { name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>数值</Label>
              <Input type="number" value={selected.value} onChange={(e) => onUpdateItem(selected.id, { value: parseFloat(e.target.value) })} step="0.01" className="mt-1" />
            </div>
            
            <div>
              <Label>字体大小</Label>
              <Input type="number" value={selected.fontSize ?? 12} onChange={(e) => onUpdateItem(selected.id, { fontSize: Number(e.target.value) })} className="mt-1" />
            </div>
            <div>
              <Label>字体颜色</Label>
              <Input type="color" value={selected.labelColor ?? labelTextColor} onChange={(e) => onUpdateItem(selected.id, { labelColor: e.target.value })} className="mt-1 h-10 p-0" />
            </div>

            <div>
              <Label>角度</Label>
              <Input type="number" value={selected.angle} onChange={(e) => onUpdateItem(selected.id, { angle: parseFloat(e.target.value) })} step="0.01" className="mt-1" />
            </div>
            <div>
              <Label>半径</Label>
              <Input type="number" value={selected.radius} onChange={(e) => onUpdateItem(selected.id, { radius: parseFloat(e.target.value) })} step="0.01" className="mt-1" />
            </div>
            <div>
              <Label>色块颜色</Label>
              <Input type="color" value={selected.color} onChange={(e) => onUpdateItem(selected.id, { color: e.target.value })} className="mt-1 h-10 p-0" />
            </div>
            <div className="flex items-end justify-end">
              <Button variant="ghost" size="icon" onClick={() => { onDeleteItem(selected.id); goto(Math.max(0, index - 1)); }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">暂无数据，请添加</div>
        )}
        <div className="mt-3">
          <Button onClick={() => { onAddItem(); goto(data.length); }} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            添加数据项
          </Button>
        </div>
      </div>
    </div>
  );
}