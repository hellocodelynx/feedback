"use client";
import { PieChart, Pie, Cell } from "recharts";

export default function ProgressDonut({ done, total }: { done: number; total: number }) {
  const data = [{ v: done }, { v: total - done }];
  return (
    <div className="relative h-40 w-40">
      <PieChart width={160} height={160}>
        <Pie data={data} dataKey="v" innerRadius={52} outerRadius={70} startAngle={90} endAngle={-270} stroke="none">
          <Cell fill="#6d28d9" /><Cell fill="#e9dcff" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><p className="text-2xl font-semibold text-navy-900">{total ? Math.round((done / total) * 100) : 0}%</p><p className="text-xs text-slate-500">complete</p></div>
      </div>
    </div>
  );
}
