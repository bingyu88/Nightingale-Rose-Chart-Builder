import { DataItem } from '../App';

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
}

const DEFAULT_FONT_SIZE = 12;
const DEFAULT_FONT_FAMILY = '仿宋_GB2312, FangSong, STFangSong, serif';

export function RoseChart({ data, showValueInLabel = true, innerRadius = 40, gapEnabled = false, centerText = '', boldText = true, onLabelDrag, centerCircleStrokeWidth = 1, centerCircleStrokeColor = '#3b82f6' }: RoseChartProps) {
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
    
    const svgRect = svg.getBoundingClientRect();
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
      const newX = currentOffsetX + deltaX;
      const newY = currentOffsetY + deltaY;
      
      onLabelDrag(item.id, newX, newY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="w-full">
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
            
            return (
              <g key={item.id}>
                {/* Slice */}
                <path
                  d={path}
                  fill={item.color}
                  stroke={gapEnabled ? "white" : "none"}
                  strokeWidth={gapEnabled ? 2 : 0}
                  opacity="0.9"
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>{`${item.name}: ${item.value} (${item.angle}°, 半径${item.radius})`}</title>
                </path>
                
                {/* Label */}
                <text
                  x={labelPos.x + (item.labelX || 0)}
                  y={labelPos.y + (item.labelY || 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-700 cursor-move select-none"
                  style={{ fontSize: `${item.fontSize ?? DEFAULT_FONT_SIZE}px`, fontFamily: DEFAULT_FONT_FAMILY, fontWeight: boldText ? 'bold' : 'normal' }}
                  onMouseDown={(e) => handleLabelMouseDown(e, item)}
                >
                  {showValueInLabel ? `${item.name} ${item.value}` : item.name}
                </text>
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
              className="fill-slate-700 pointer-events-none"
              style={{ fontSize: '14px', fontFamily: DEFAULT_FONT_FAMILY, fontWeight: boldText ? 'bold' : 'normal' }}
            >
              {centerText}
            </text>
          )}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-700" style={{ fontSize: `${DEFAULT_FONT_SIZE}px`, fontFamily: DEFAULT_FONT_FAMILY, fontWeight: boldText ? 'bold' : 'normal' }}>{item.name}: {item.value} ({item.angle}°, R{item.radius + 10})</span>
          </div>
        ))}
      </div>
    </div>
  );
}