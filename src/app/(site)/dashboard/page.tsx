"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";

const COLORS = ["#08f7fe", "#ff4d6d", "#7cffcb", "#fce94f", "#a78bfa"];

export default function DashboardPage() {
  const monthlyLeaves = [
    { m: "Jan", avgDays: 0.8 }, { m: "Feb", avgDays: 1.1 }, { m: "Mar", avgDays: 1.3 },
    { m: "Apr", avgDays: 1.0 }, { m: "May", avgDays: 1.6 }, { m: "Jun", avgDays: 1.9 },
  ];
  const leaveTypes = [
    { type: "ลากิจ", count: 46 },
    { type: "ลาป่วย", count: 72 },
    { type: "ลาพักร้อน", count: 33 },
    { type: "อื่น ๆ", count: 14 },
  ];
  const statusDist = [
    { name: "อนุมัติ", value: 102 },
    { name: "รออนุมัติ", value: 36 },
    { name: "ไม่อนุมัติ", value: 27 },
  ];
  const attendanceRadar = [
    { k: "ตรงเวลา", a: 82 }, { k: "ไม่สาย", a: 76 }, { k: "ไม่ขาด", a: 90 },
    { k: "ลาน้อย", a: 70 }, { k: "วางแผนลา", a: 80 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="neon-card rounded-2xl p-4">
        <h2 className="neon-title mb-2 text-lg font-semibold">แนวโน้มวันลาเฉลี่ยรายเดือน</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={monthlyLeaves} margin={{ left:4, right:8, top:8, bottom:0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="m" stroke="#a3adc2" />
              <YAxis stroke="#a3adc2" />
              <Tooltip />
              <Line type="monotone" dataKey="avgDays" stroke="#08f7fe" strokeWidth={3} dot={{ r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="neon-card rounded-2xl p-4">
        <h2 className="neon-title mb-2 text-lg font-semibold">จำนวนคำขอตามประเภทลา</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={leaveTypes} margin={{ left:4, right:8, top:8, bottom:0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="type" stroke="#a3adc2" />
              <YAxis stroke="#a3adc2" />
              <Tooltip />
              <Bar dataKey="count">
                {leaveTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="neon-card rounded-2xl p-4">
        <h2 className="neon-title mb-2 text-lg font-semibold">สัดส่วนสถานะคำขอ</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="neon-card rounded-2xl p-4">
        <h2 className="neon-title mb-2 text-lg font-semibold">เรดาร์พฤติกรรมการมาทำงาน (ทีม)</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <RadarChart data={attendanceRadar}>
              <PolarGrid stroke="rgba(255,255,255,.15)" />
              <PolarAngleAxis dataKey="k" stroke="#a3adc2" />
              <PolarRadiusAxis stroke="#a3adc2" />
              <Radar name="Avg" dataKey="a" stroke="#7cffcb" fill="#7cffcb" fillOpacity={0.45} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
