// app/about/page.tsx
export default function About() {
    return (
        <main className="p-12">
            <h1 className="text-3xl font-bold text-blue-900">เกี่ยวกับฉัน</h1>
            <div className="mt-6 space-y-2 text-gray-7000">
                <p>🎓 สาขา: วิทยาการคอมพิวเตอร์</p>
                <p>📚 รายวิชาที่ชอบ: [WEB APPLICATION DESIGN AND DEVELOPMENT]</p>
                <p>🎯 เป้าหมาย: [การที่จะเข้าใจโครงสร้างทุกอย่างของเว็บไซต์พื้นฐาน]</p>
            </div>
        </main>
    );
}