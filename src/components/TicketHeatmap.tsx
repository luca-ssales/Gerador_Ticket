import React, { useMemo, useState } from 'react';
import { Ticket } from '../types';

interface DayData {
  date: Date;
  dateStr: string;
  count: number;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ... 6 = Sat
}

interface TicketHeatmapProps {
  tickets?: Ticket[];
  isCleanState?: boolean;
}

export const TicketHeatmap: React.FC<TicketHeatmapProps> = ({ tickets = [], isCleanState = false }) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map real tickets by YYYY-MM-DD
  const ticketsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    tickets.forEach((t) => {
      if (t.createdAt) {
        const d = new Date(t.createdAt);
        if (!isNaN(d.getTime())) {
          // Format as YYYY-MM-DD in local time
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const localDateKey = `${year}-${month}-${day}`;
          map[localDateKey] = (map[localDateKey] || 0) + 1;
        }
      }
    });
    return map;
  }, [tickets]);

  // Generate 52 weeks of data ending at today
  const { weeks, monthLabels, totalCount } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    
    // Start 51 full weeks + current week up to today
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (51 * 7 + dayOfWeek));

    const weeksArr: DayData[][] = [];
    const months: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    let sumCount = 0;

    let curr = new Date(startDate);

    // Seed preset pattern for demo mode
    const activityPatterns = [
      0, 2, 5, 8, 12, 4, 1, 0, 3, 6, 11, 7, 2, 0,
      1, 4, 7, 10, 14, 5, 0, 0, 3, 8, 12, 9, 3, 1,
      0, 2, 6, 9, 13, 6, 2, 0, 4, 7, 10, 8, 4, 0
    ];

    for (let w = 0; w < 52; w++) {
      const week: DayData[] = [];
      for (let d = 0; d < 7; d++) {
        const dateCopy = new Date(curr);
        const monthNum = dateCopy.getMonth();
        
        // Track month changes for header labels
        if (d === 0 && monthNum !== lastMonth) {
          const monthName = dateCopy.toLocaleDateString('pt-BR', { month: 'short' });
          const formattedLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1).replace('.', '');
          months.push({ weekIndex: w, label: formattedLabel });
          lastMonth = monthNum;
        }

        // Format cell date as YYYY-MM-DD
        const year = dateCopy.getFullYear();
        const month = String(dateCopy.getMonth() + 1).padStart(2, '0');
        const day = String(dateCopy.getDate()).padStart(2, '0');
        const localDateKey = `${year}-${month}-${day}`;

        const realCountForDay = ticketsByDate[localDateKey] || 0;

        const isWeekend = d === 0 || d === 6;
        const patternIdx = (w * 7 + d) % activityPatterns.length;
        let baseCount = isCleanState ? 0 : activityPatterns[patternIdx];
        
        if (!isCleanState) {
          if (!isWeekend) {
            if ((w + d) % 9 === 0) baseCount = 15; // peak day
            else if ((w * 3 + d) % 5 === 0) baseCount = 0; // quiet day
          } else {
            baseCount = isWeekend && (w % 4 === 0) ? Math.floor(baseCount / 3) : 0;
          }
        }

        const count = baseCount + realCountForDay;
        sumCount += count;

        const dateStr = dateCopy.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        week.push({
          date: dateCopy,
          dateStr,
          count,
          dayOfWeek: d
        });

        curr.setDate(curr.getDate() + 1);
      }
      weeksArr.push(week);
    }

    return { weeks: weeksArr, monthLabels: months, totalCount: sumCount };
  }, [isCleanState, ticketsByDate]);

  const getLevelColor = (count: number) => {
    if (count === 0) return 'bg-[#e2e8f0]/70 border border-[#cbd5e1]/40 hover:border-[#3b82f6]';
    if (count <= 3) return 'bg-[#93c5fd] hover:bg-[#60a5fa] border border-[#60a5fa]/30';
    if (count <= 7) return 'bg-[#3b82f6] hover:bg-[#2563eb] border border-[#2563eb]/30';
    if (count <= 11) return 'bg-[#1d4ed8] hover:bg-[#1e40af] border border-[#1e40af]/30';
    return 'bg-[#004ac6] hover:bg-[#0b1c30] border border-[#004ac6]';
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, day: DayData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    });
    setHoveredDay(day);
  };

  return (
    <div className="lg:col-span-2 bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col justify-between shadow-2xs hover:border-[#004ac6] transition-colors relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
        <div>
          <h3 className="font-semibold text-lg text-[#0b1c30]">Tendências de Volume de Chamados</h3>
          <p className="text-xs text-[#434655] mt-0.5">
            <strong className="text-[#0b1c30]">{totalCount.toLocaleString('pt-BR')} chamados</strong> registrados no último ano
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#004ac6] border border-[#dce9ff]">
            Dados de Volume Anual
          </span>
        </div>
      </div>

      {/* GitHub-style Heatmap Container */}
      <div className="bg-[#f8fafc] border border-[#c3c6d7]/60 rounded-xl p-4 overflow-x-auto select-none">
        <div className="min-w-[670px] flex flex-col gap-2">
          {/* Month Header Row */}
          <div className="flex text-[11px] text-[#64748b] font-medium pl-8 h-4 relative">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute text-center capitalize"
                style={{ left: `${32 + m.weekIndex * 12.2}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Days & Squares Grid */}
          <div className="flex gap-1.5 items-start">
            {/* Weekday Row Labels (Left Column) */}
            <div className="flex flex-col gap-[3px] text-[10px] text-[#64748b] font-medium justify-between h-[93px] pr-1 pt-[1px]">
              <span className="h-[11px] leading-[11px]"></span>
              <span className="h-[11px] leading-[11px]">seg</span>
              <span className="h-[11px] leading-[11px]"></span>
              <span className="h-[11px] leading-[11px]">qua</span>
              <span className="h-[11px] leading-[11px]"></span>
              <span className="h-[11px] leading-[11px]">sex</span>
              <span className="h-[11px] leading-[11px]"></span>
            </div>

            {/* 52 Columns (Weeks) x 7 Rows (Days) */}
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={(e) => handleMouseEnter(e, day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-all duration-150 ${getLevelColor(
                        day.count
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend & Footer */}
          <div className="flex justify-between items-center text-[11px] text-[#64748b] pt-2 mt-1 border-t border-[#e2e8f0]">
            <span className="hover:text-[#004ac6] cursor-pointer transition-colors text-[10px]">
              Saiba como contabilizamos os chamados.
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>Menos</span>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#e2e8f0]/70 border border-[#cbd5e1]/40"></div>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#93c5fd]"></div>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#3b82f6]"></div>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#1d4ed8]"></div>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#004ac6]"></div>
              <span>Mais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-[#0b1c30] text-white text-[11px] py-1 px-2.5 rounded-md shadow-lg pointer-events-none transition-opacity duration-150 flex flex-col items-center whitespace-nowrap border border-[#2563eb]/40"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <span className="font-semibold text-blue-200">
            {hoveredDay.count === 0
              ? 'Nenhum chamado'
              : `${hoveredDay.count} ${hoveredDay.count === 1 ? 'chamado' : 'chamados'}`}
          </span>
          <span className="text-[10px] text-gray-300">{hoveredDay.dateStr}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0b1c30]"></div>
        </div>
      )}
    </div>
  );
};
