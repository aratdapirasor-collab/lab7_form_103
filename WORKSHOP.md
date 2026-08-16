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
