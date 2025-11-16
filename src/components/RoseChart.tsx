import { useState } from 'react';
import { DataItem } from '../App';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface RoseChartProps {
  data: DataItem[];
  showValueInLabel?: boolean;
  innerRadius?: number;
  gapEnabled?: boolean;
  centerText?: string;
  boldText?: boolean;
  onLabelDrag?: (id: string, x: number, y: number) => void;
  centerCircleStrokeWidth?: number;
  centerCircleStrokeColor?: string;
  labelTextColor?: string;
  centerTextColor?: string;
  onUpdateItem?: (id: string, updates: Partial<DataItem>) => void;
}

const DEFAULT_FONT_SIZE = 12;
const DEFAULT_FONT_FAMILY = '仿宋_GB2312, FangSong, STFangSong, serif';

export function RoseChart({ data, showValueInLabel = true, innerRadius = 40, gapEnabled = false, centerText = '', boldText = true, onLabelDrag, centerCircleStrokeWidth = 1, centerCircleStrokeColor = '#3b82f6', labelTextColor = '#334155', centerTextColor = '#334155', onUpdateItem }: RoseChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-500">
        暂无数据，请添加数据项
      </div>
    );
  }

  const size = 650;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2 - 80;
  const baseInnerRadius = Math.min(Math.max(innerRadius, 0), maxRadius - 10);
  
  // Find max radius for scaling
  const maxRadiusValue = Math.max(...data.map(item => item.radius), 1);
  
  // Calculate total angle
  const totalAngle = data.reduce((sum, item) => sum + item.angle, 0);
  
  // Check if angles sum to 360, show warning if not
  const angleWarning = Math.abs(totalAngle - 360) > 0.1;
  
  // Function to create path for a slice
  const createSlicePath = (startAngleDeg: number, angleSize: number, radius: number) => {
    const startAngle = (startAngleDeg - 90) * (Math.PI / 180); // Convert to radians, start from top
    const endAngle = (startAngleDeg + angleSize - 90) * (Math.PI / 180);
    
    // Calculate radius based on radius value (normalized)
    const outerRadius = baseInnerRadius + (radius / maxRadiusValue) * (maxRadius - baseInnerRadius);
    
    // Calculate points
    const x1 = centerX + baseInnerRadius * Math.cos(startAngle);
    const y1 = centerY + baseInnerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + baseInnerRadius * Math.cos(endAngle);
    const y4 = centerY + baseInnerRadius * Math.sin(endAngle);
    
    const largeArcFlag = angleSize > 180 ? 1 : 0;
    
    // Create path with arcs
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${baseInnerRadius} ${baseInnerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };
  
  // Function to calculate label position
  const getLabelPosition = (startAngleDeg: number, angleSize: number, radius: number) => {
    const midAngleDeg = startAngleDeg + angleSize / 2;
    const midAngle = (midAngleDeg - 90) * (Math.PI / 180);
    const outerRadius = baseInnerRadius + (radius / maxRadiusValue) * (maxRadius - baseInnerRadius);
    const labelRadius = outerRadius + 30;
    
    return {
      x: centerX + labelRadius * Math.cos(midAngle),
      y: centerY + labelRadius * Math.sin(midAngle),
    };
  };

  // Calculate cumulative angles for each slice
  let currentAngle = 0;
  const slicesData = data.map(item => {
    const start = currentAngle;
    currentAngle += item.angle;
    return {
      item,
      startAngle: start,
    };
  });

  // Handle label drag events
  const handleLabelMouseDown = (e: React.MouseEvent, item: DataItem) => {
    if (!onLabelDrag) return;
    
    e.preventDefault();
    const svg = e.currentTarget.closest('svg');
    if (!svg) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Get current label position
    const effectiveRadius = item.radius + 8;
    const labelPos = getLabelPosition(slicesData.find(d => d.item.id === item.id)?.startAngle || 0, item.angle, effectiveRadius);
    const currentOffsetX = item.labelX || 0;
    const currentOffsetY = item.labelY || 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newX = Math.round(currentOffsetX + deltaX);
      const newY = Math.round(currentOffsetY + deltaY);
      onLabelDrag(item.id, newX, newY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const [editPanel, setEditPanel] = useState<{ id: string; x: number; y: number } | null>(null);

  const openEditor = (e: React.MouseEvent, id: string) => {
    const container = (e.currentTarget as HTMLElement).closest('.rose-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setEditPanel({ id, x, y });
  };

  const closeEditor = () => setEditPanel(null);
  const [labelEdit, setLabelEdit] = useState<{ id: string; x: number; y: number; value: string } | null>(null);
  const openLabelEditor = (e: React.MouseEvent, item: DataItem, x: number, y: number) => {
    const container = (e.currentTarget as HTMLElement).closest('.rose-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setLabelEdit({ id: item.id, x: Math.round(x - rect.left), y: Math.round(y - rect.top), value: item.name });
  };
  const closeLabelEditor = () => setLabelEdit(null);
  const [hoverToolbar, setHoverToolbar] = useState<{ id: string; x: number; y: number } | null>(null);
  const showToolbar = (e: React.MouseEvent, id: string, x: number, y: number) => {
    const container = (e.currentTarget as HTMLElement).closest('.rose-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setHoverToolbar({ id, x: Math.round(x - rect.left), y: Math.round(y - rect.top) });
  };
  const hideToolbar = () => setHoverToolbar(null);
  const [activeHandlesId, setActiveHandlesId] = useState<string | null>(null);

  return (
    <div className="w-full relative rose-container">
      {angleWarning && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-center">
          ⚠️ 角度总和为 {totalAngle.toFixed(1)}°，建议调整为 360°
        </div>
      )}
      
      <div className="flex justify-center">
        <svg id="rose-chart-svg" width={size} height={size} className="overflow-visible">
          {/* Draw slices */}
          {slicesData.map(({ item, startAngle }) => {
            const effectiveRadius = item.radius + 8;
            const path = createSlicePath(startAngle, item.angle, effectiveRadius);
            const labelPos = getLabelPosition(startAngle, item.angle, effectiveRadius);
            const lx = Math.round(labelPos.x + (item.labelX || 0));
            const ly = Math.round(labelPos.y + (item.labelY || 0));
            const midAngleDeg = startAngle + item.angle / 2;
            const midAngle = (midAngleDeg - 90) * (Math.PI / 180);
            const outerRadius = baseInnerRadius + (effectiveRadius / maxRadiusValue) * (maxRadius - baseInnerRadius);
            const radiusHandleX = centerX + outerRadius * Math.cos(midAngle);
            const radiusHandleY = centerY + outerRadius * Math.sin(midAngle);
            const endAngle = (startAngle + item.angle - 90) * (Math.PI / 180);
            const angleHandleX = centerX + outerRadius * Math.cos(endAngle);
            const angleHandleY = centerY + outerRadius * Math.sin(endAngle);
            
            return (
              <g key={item.id} onMouseEnter={() => setActiveHandlesId(item.id)} onMouseLeave={() => setActiveHandlesId(null)}>
                {/* Slice */}
                <path
                  d={path}
                  fill={item.color}
                  stroke={gapEnabled ? "white" : "none"}
                  strokeWidth={gapEnabled ? 2 : 0}
                  opacity="0.9"
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => openEditor(e, item.id)}
                >
                  <title>{`${item.name}: ${item.value.toFixed(2)} (${item.angle.toFixed(2)}°, 半径${item.radius.toFixed(2)})`}</title>
                </path>
                
                {/* Label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="cursor-move select-none"
                  style={{ fontSize: `${item.fontSize ?? DEFAULT_FONT_SIZE}px`, fontFamily: DEFAULT_FONT_FAMILY, fontWeight: boldText ? 'bold' : 'normal', fill: item.labelColor ?? labelTextColor, textRendering: 'geometricPrecision' }}
                  onMouseDown={(e) => handleLabelMouseDown(e, item)}
                  onClick={(e) => openEditor(e, item.id)}
                  onDoubleClick={(e) => openLabelEditor(e, item, lx, ly)}
                  onMouseEnter={(e) => showToolbar(e, item.id, lx, ly)}
                  onWheel={(e) => {
                    e.preventDefault();
                    const cur = item.fontSize ?? DEFAULT_FONT_SIZE;
                    const next = Math.min(64, Math.max(8, cur + (e.deltaY < 0 ? 1 : -1)));
                    onUpdateItem?.(item.id, { fontSize: next });
                  }}
                >
                  {showValueInLabel ? `${item.name} ${item.value.toFixed(2)}` : item.name}
                </text>

                {activeHandlesId === item.id && (
                <circle
                  cx={radiusHandleX}
                  cy={radiusHandleY}
                  r={6}
                  fill="#ffffff"
                  stroke={item.color}
                  strokeWidth={2}
                  className="cursor-ns-resize"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const svg = e.currentTarget.closest('svg');
                    if (!svg) return;
                    const handleMove = (me: MouseEvent) => {
                      const rect = svg.getBoundingClientRect();
                      const px = me.clientX - rect.left;
                      const py = me.clientY - rect.top;
                      const dx = px - centerX;
                      const dy = py - centerY;
                      const dist = Math.sqrt(dx * dx + dy * dy);
                      const desiredOuter = Math.max(baseInnerRadius + 1, Math.min(dist, maxRadius));
                      const desiredRadius = ((desiredOuter - baseInnerRadius) / (maxRadius - baseInnerRadius)) * maxRadiusValue;
                      onUpdateItem?.(item.id, { radius: Number(desiredRadius.toFixed(2)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />)}

                {activeHandlesId === item.id && (
                <circle
                  cx={angleHandleX}
                  cy={angleHandleY}
                  r={6}
                  fill="#ffffff"
                  stroke={item.color}
                  strokeWidth={2}
                  className="cursor-ew-resize"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const svg = e.currentTarget.closest('svg');
                    if (!svg) return;
                    const handleMove = (me: MouseEvent) => {
                      const rect = svg.getBoundingClientRect();
                      const px = me.clientX - rect.left;
                      const py = me.clientY - rect.top;
                      const ang = Math.atan2(py - centerY, px - centerX) * (180 / Math.PI) + 90;
                      let newAngle = ang - startAngle;
                      while (newAngle < 0) newAngle += 360;
                      while (newAngle > 360) newAngle -= 360;
                      newAngle = Math.max(1, Math.min(newAngle, 360));
                      onUpdateItem?.(item.id, { angle: Number(newAngle.toFixed(2)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />)}
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={baseInnerRadius}
            fill="white"
            stroke={centerCircleStrokeColor}
            strokeWidth={centerCircleStrokeWidth}
          />
          {centerText && (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
              style={{ fontSize: '14px', fontFamily: DEFAULT_FONT_FAMILY, fontWeight: boldText ? 'bold' : 'normal', fill: centerTextColor, textRendering: 'geometricPrecision' }}
            >
              {centerText}
            </text>
          )}
        </svg>
      </div>

      {editPanel && (
        <div style={{ left: editPanel.x, top: editPanel.y }} className="absolute z-10 bg-white border rounded-md shadow-md p-2 w-80">
          {(() => {
            const item = data.find(d => d.id === editPanel.id);
            if (!item) return null;
            return (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Label>名称</Label>
                    <Input value={item.name} onChange={(e) => onUpdateItem?.(item.id, { name: e.target.value })} />
                  </div>
                  <div>
                    <Label>数值</Label>
                    <Input type="number" value={item.value} onChange={(e) => onUpdateItem?.(item.id, { value: parseFloat(e.target.value) })} step="0.01" />
                  </div>
                  <div>
                    <Label>角度</Label>
                    <Input type="number" value={item.angle} onChange={(e) => onUpdateItem?.(item.id, { angle: parseFloat(e.target.value) })} step="0.01" />
                  </div>
                  <div>
                    <Label>半径</Label>
                    <Input type="number" value={item.radius} onChange={(e) => onUpdateItem?.(item.id, { radius: parseFloat(e.target.value) })} step="0.01" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <Label>字号</Label>
                    <Input type="number" value={item.fontSize ?? 12} onChange={(e) => onUpdateItem?.(item.id, { fontSize: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>标签色</Label>
                    <Input type="color" value={item.labelColor ?? labelTextColor} onChange={(e) => onUpdateItem?.(item.id, { labelColor: e.target.value })} className="h-10 p-0" />
                  </div>
                  <div>
                    <Label>色块色</Label>
                    <Input type="color" value={item.color} onChange={(e) => onUpdateItem?.(item.id, { color: e.target.value })} className="h-10 p-0" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={closeEditor}>关闭</Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {hoverToolbar && (() => {
        const item = data.find(d => d.id === hoverToolbar.id);
        if (!item) return null;
        return (
          <div style={{ left: hoverToolbar.x + 10, top: hoverToolbar.y - 10 }} className="absolute z-10 bg-white border rounded shadow px-2 py-1 flex items-center gap-2" onMouseLeave={hideToolbar}>
            <Input type="number" value={item.value} step="0.01" onChange={(e) => onUpdateItem?.(item.id, { value: parseFloat(e.target.value) })} className="w-20 h-7" />
            <Input type="color" value={item.labelColor ?? labelTextColor} onChange={(e) => onUpdateItem?.(item.id, { labelColor: e.target.value })} className="w-8 h-7 p-0" />
            <Input type="color" value={item.color} onChange={(e) => onUpdateItem?.(item.id, { color: e.target.value })} className="w-8 h-7 p-0" />
          </div>
        );
      })()}

      {labelEdit && (
        <div style={{ left: labelEdit.x, top: labelEdit.y }} className="absolute z-20 bg-white border rounded-md shadow px-2 py-1">
          <Input
            value={labelEdit.value}
            onChange={(e) => setLabelEdit({ ...labelEdit, value: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateItem?.(labelEdit.id, { name: labelEdit.value });
                closeLabelEditor();
              } else if (e.key === 'Escape') {
                closeLabelEditor();
              }
            }}
            onBlur={() => { onUpdateItem?.(labelEdit.id, { name: labelEdit.value }); closeLabelEditor(); }}
            className="h-8"
            autoFocus
          />
        </div>
      )}
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span style={{ fontSize: `${DEFAULT_FONT_SIZE}px`, fontFamily: DEFAULT_FONT_FAMILY, fontWeight: boldText ? 'bold' : 'normal', color: item.labelColor ?? labelTextColor }}>{item.name}: {item.value.toFixed(2)} ({item.angle.toFixed(2)}°, R{(item.radius + 10).toFixed(2)})</span>
          </div>
        ))}
      </div>
    </div>
  );
}