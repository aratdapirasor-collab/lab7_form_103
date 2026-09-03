# Workshop: Database Integration & CRUD Operations (Task W.5 & W.6)

## Task W.5 — Layer Mapping

| ชั้น (Layer) | ไฟล์ในโปรเจกต์ | หน้าที่ |
| :--- | :--- | :--- |
| **Controller** | [app/api/tasks/route.ts](file:///c:/LAB_FORM_103/app/api/tasks/route.ts)<br>[app/api/tasks/[id]/route.ts](file:///c:/LAB_FORM_103/app/api/tasks/%5Bid%5D/route.ts) | รับ HTTP Request (GET, POST, PATCH, DELETE), อ่าน Params และ Request Body, เรียกใช้งาน Service Layer และส่ง HTTP Response พร้อม Status Code ที่เหมาะสม (200, 201, 400, 404, 500) |
| **Service** | [lib/taskService.ts](file:///c:/LAB_FORM_103/lib/taskService.ts) | จัดการ Business Logic, ตรวจสอบความถูกต้องของข้อมูล (Input Validation), เรียกใช้งาน Model Layer และดักจับ Prisma Error Code (`P2002`, `P2025`) เพื่อแปลงเป็น Custom Error (`ValidationError`, `NotFoundError`) |
| **Model (Prisma)** | [lib/tasks.ts](file:///c:/LAB_FORM_103/lib/tasks.ts) | ทำหน้าที่เป็น Data Access Layer ติดต่อฐานข้อมูลผ่าน Prisma Client Singleton (`prisma.task.create`, `findMany`, `findUnique`, `update`, `delete`) |
| **Schema** | [prisma/schema.prisma](file:///c:/LAB_FORM_103/prisma/schema.prisma) | นิยามโครงสร้างตาราง `Task`, ชนิดข้อมูลของแต่ละฟิลด์ และ Constraints ต่างๆ เช่น `@id`, `@default`, `@unique` |

---

## Task W.6 — Reflection

### 1. การออกแบบ Resource (`Task`)
- **โครงสร้างฟิลด์**:
  - `id`: String `@id @default(cuid())` — ตัวระบุเฉพาะของงาน ป้องกัน ID ซ้ำ
  - `title`: String `@unique` — ชื่องาน กำหนดเป็น `@unique` เพื่อป้องกันการบันทึกงานชื่อเดียวกันซ้ำ
  - `completed`: Boolean `@default(false)` — สถานะการทำเสร็จ กำหนดค่าเริ่มต้นเป็น `false`
  - `createdAt`: DateTime `@default(now())` — วันเวลาบันทึก กำหนดอัตโนมัติเมื่อสร้างข้อมูล
- **เหตุผลการเลือก**: `Task` เป็น Resource ที่เหมาะสมสำหรับการต่อยอด CRUD API ในชีวิตจริง โดยใช้ `@unique` ควบคุมความถูกต้องของข้อมูล และ `@default` กำหนดค่าเริ่มต้นให้ทำงานได้อย่างราบรื่น

### 2. จุดตัดสินใจและการจัดการ Error ระหว่างออกแบบ
- **การใช้ `@unique` ที่ `title`**: เลือกใส่ constraint `@unique` ที่ฟิลด์ `title` เพื่อรับประกัน Data Integrity
- **การจัดการ Prisma Error Codes**:
  - **`P2002` (Unique constraint failed)**: ดักจับเมื่อมีการสร้าง/แก้ไข `title` ซ้ำ แล้วแปลงเป็น `ValidationError('ชื่องานนี้มีอยู่แล้ว')` เพื่อส่ง HTTP 400 ให้ผู้ใช้งาน
  - **`P2025` (Record to update/delete not found)**: ดักจับเมื่ออัปเดตหรือลบ ID ที่ไม่มีอยู่จริง แล้วแปลงเป็น `NotFoundError('ไม่พบงานนี้')` เพื่อส่ง HTTP 404

### 3. การเปรียบเทียบฐานข้อมูลจริง (Prisma + DB) กับ In-memory Array (Week 8)
- **Data Persistence**: การใช้ฐานข้อมูลจริงทำให้ข้อมูลคงทนอยู่ถาวร (Persistent Data) ข้อมูลไม่สูญหายเมื่อ Restart Application Server ต่างจาก Array ในหน่วยความจำที่จะลบหายทั้งหมดเมื่อโปรเซสหยุดทำงาน
- **Data Integrity & Safety**: ฐานข้อมูลทำหน้าที่ตรวจเช็ค Data Constraints (`@unique`, Data Types) ในระดับ Engine ป้องกันข้อมูลขัดแย้งหรือ Data Corruption จาก Concurrent Requests
- **Scalability & Production Ready**: สามารถขยายขนาด ปรับแต่ง Indexing และเรียงลำดับข้อมูล (`orderBy`) ได้อย่างมีประสิทธิภาพ รองรับ Production Environment

---

## Task W.12 — Team Deployment Readiness Checklist & Reflection (Lab Week 12)

### 1. Deployment Readiness Checklist (รายการเตรียมความพร้อมก่อน Deploy)

| ลำดับ | รายการตรวจสอบ (Checklist Item) | คำอธิบาย & ข้อปฏิบัติตามมาตรฐานทีม |
| :---: | :--- | :--- |
| **1** | **Rollback Authority & Team Notification** | กำหนดสิทธิ์ผู้กด **Instant Rollback** บน Vercel เฉพาะ Lead/DevOps และต้องแจ้งเตือนทีมทาง Discord/Slack ทันทีเมื่อเกิดวิกฤต Rollback |
| **2** | **Pre-merge Code Review & Notification** | ทุก PR ต้องผ่านการ Review อย่างน้อย 1 คน และแจ้งทีมก่อนกด Merge เข้า branch `main` เพื่อป้องกัน Deployment Clashes |
| **3** | **Environment Variables Verification** | ตรวจสอบ `DATABASE_URL` (Pooled host พร้อม `-pooler`) และ `DIRECT_URL` (Direct host) ครบทั้ง 3 Scopes (Production, Preview, Development) บน Vercel Dashboard |
| **4** | **Preview Deployment CRUD Verification** | ต้องเปิด Vercel Preview Link จาก Pull Request แล้วทดสอบฟังก์ชัน CRUD (Create, Read, Update, Delete) ครบถ้วนก่อนอนุมัติให้ Merge |
| **5** | **Database Migration & Schema Sync** | ตรวจสอบว่า Prisma Schema บน Neon DB ได้รับการรัน `prisma db push` / `prisma migrate deploy` สอดคล้องกับโค้ดใหม่เรียบร้อยแล้วก่อนขึ้น Production |

### 2. สรุปความพร้อมและการวิเคราะห์ความเสี่ยง (Final Project Readiness Summary)
> **สรุปภาพรวมความพร้อมของ `my-blog`**: โปรเจกต์มีความพร้อมในการเป็นฐานรากสำหรับ Final Project (Week 13-15) เนื่องจากมีระบบ Automated CI/CD ผ่าน GitHub ↔ Vercel และเชื่อมต่อ Neon PostgreSQL Database ที่รองรับ Connection Pooling เรียบร้อยแล้ว  
> **จุดที่ยังกังวล / ข้อควรระวัง**:
> 1. **Database Connection Limits**: ต้องระวังเรื่อง Connection Limit เมื่อมีผู้ใช้งานเข้าพร้อมกันหลายคน โดยปฏิบัติตามหลักการใช้ Pooled URL (`-pooler`) เป็นหลักสำหรับ Vercel Serverless Functions
> 2. **Environment Variable Redeployment**: การแก้ไข Env Var บน Vercel ต้องกด **Redeploy** เสมอเพื่อบังคับ Build Cycle ใหม่ ไม่เช่นนั้นระบบจะยังใช้ค่าเดิมส่งผลให้เกิด Bug ใน Production
> 3. **Instant Rollback Safety**: ในช่วง Sprint ที่มีการเปลี่ยนโค้ดถี่และมีเสี่ยง Deploy พัง หากเกิด Runtime Error ใน Production สามารถกด **Promote to Production** จาก Deployment ที่สมบูรณ์ก่อนหน้าได้ทันทีภายในไม่กี่วินาที
