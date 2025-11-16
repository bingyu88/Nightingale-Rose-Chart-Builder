import { DataItem } from '../App';
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
}

export function DataInput({ data, onAddItem, onUpdateItem, onDeleteItem, showValueInLabel, onToggleShowValue, innerRadius, onInnerRadiusChange, gapEnabled, onGapEnabledChange, centerText, onCenterTextChange, boldText, onBoldTextChange, onApplyTemplateOne, onResetLabelPositions, centerCircleStrokeWidth, onCenterCircleStrokeWidthChange, centerCircleStrokeColor, onCenterCircleStrokeColorChange }: DataInputProps) {
  // Calculate total angle
  const totalAngle = data.reduce((sum, item) => sum + item.angle, 0);
  
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
              onChange={(e) => onInnerRadiusChange(Number(e.target.value))}
              min="0"
              max="150"
              step="1"
              className="w-24"
            />
            <span className="text-slate-600">px</span>
          </div>
        </div>
        
        {/* Center Text */}
        <div>
          <Label htmlFor="center-text">中心圆文字</Label>
          <Input
            id="center-text"
            value={centerText}
            onChange={(e) => onCenterTextChange(e.target.value)}
            placeholder="在这里输入中心文字"
            className="mt-2"
          />
        </div>

        {/* Center Circle Stroke Width */}
        <div>
          <Label htmlFor="center-circle-stroke-width">中心圆线条粗细</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              id="center-circle-stroke-width"
              type="number"
              value={centerCircleStrokeWidth}
              onChange={(e) => onCenterCircleStrokeWidthChange(Number(e.target.value))}
              min="0.5"
              max="10"
              step="0.5"
              className="w-24"
            />
            <span className="text-slate-600">px</span>
          </div>
        </div>

        {/* Center Circle Stroke Color */}
        <div>
          <Label htmlFor="center-circle-stroke-color">中心圆线条颜色</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              id="center-circle-stroke-color"
              type="color"
              value={centerCircleStrokeColor}
              onChange={(e) => onCenterCircleStrokeColorChange(e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={centerCircleStrokeColor}
              onChange={(e) => onCenterCircleStrokeColorChange(e.target.value)}
              className="flex-1"
              placeholder="#3b82f6"
            />
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

        {/* Template One */}
        <Button onClick={onApplyTemplateOne} className="w-full">应用模板一（官方配色）</Button>
        
        {/* Reset Label Positions */}
        <Button onClick={onResetLabelPositions} variant="outline" className="w-full">重置标签位置</Button>
        
      </div>

      {/* Angle Summary */}
      <div className={`p-3 rounded-lg border text-center ${
        Math.abs(totalAngle - 360) < 0.1 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        角度总和: {totalAngle.toFixed(1)}° / 360°
      </div>

      <ScrollArea className="h-[350px] pr-4">
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={`name-${item.id}`}>名称</Label>
                    <Input
                      id={`name-${item.id}`}
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                      placeholder="数据名称"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`value-${item.id}`}>数值</Label>
                    <Input
                      id={`value-${item.id}`}
                      type="number"
                      value={item.value}
                      onChange={(e) => onUpdateItem(item.id, { value: Number(e.target.value) })}
                      placeholder="数值"
                      min="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`angle-${item.id}`}>角度（度数）</Label>
                    <Input
                      id={`angle-${item.id}`}
                      type="number"
                      value={item.angle}
                      onChange={(e) => onUpdateItem(item.id, { angle: Number(e.target.value) })}
                      placeholder="角度"
                      min="0"
                      max="360"
                      step="0.1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`radius-${item.id}`}>半径长度</Label>
                    <Input
                      id={`radius-${item.id}`}
                      type="number"
                      value={item.radius}
                      onChange={(e) => onUpdateItem(item.id, { radius: Number(e.target.value) })}
                      placeholder="半径"
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`fontSize-${item.id}`}>字体大小</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <Input
                        id={`fontSize-${item.id}`}
                        type="number"
                        value={item.fontSize ?? 12}
                        onChange={(e) => onUpdateItem(item.id, { fontSize: Number(e.target.value) })}
                        min="8"
                        max="32"
                        step="1"
                        className="w-20"
                      />
                      <span className="text-slate-600">px (仿宋GB_2312)</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`color-${item.id}`}>颜色</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={`color-${item.id}`}
                        type="color"
                        value={item.color}
                        onChange={(e) => onUpdateItem(item.id, { color: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        value={item.color}
                        onChange={(e) => onUpdateItem(item.id, { color: e.target.value })}
                        placeholder="#000000"
                        className="flex-1"
                      />
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