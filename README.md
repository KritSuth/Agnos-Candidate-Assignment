# Agnos Patient Registration & Monitoring System
ระบบบันทึกข้อมูลคนไข้แบบ Real-time ที่เชื่อมต่อข้อมูลระหว่างคนไข้และเจ้าหน้าที่ทันทีผ่าน WebSockets เพื่อประสิทธิภาพสูงสุดในการบริหารจัดการข้อมูลในโรงพยาบาล

---

## Deployed Application
* **Patient Form Interface:** [คลิกเพื่อเข้าสู่หน้าฟอร์มคนไข้](https://agnos-candidate-krit-5538490f62f8.herokuapp.com/patient)
* **Staff Monitor Interface:** [คลิกเพื่อเข้าสู่หน้าจอเจ้าหน้าที่](https://agnos-candidate-krit-5538490f62f8.herokuapp.com/staff)
* **Tech Stack:** Next.js, TailwindCSS, Socket.io, Node.js

---

## Getting Started

### Prerequisites
* **Node.js**: v18.x ขึ้นไป
* **npm** หรือ **yarn**

### Installation & Local Development
1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd agnos-assignment
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```

---

## Development Planning Documentation

### 1. Project Structure
โปรเจกต์ใช้โครงสร้าง **Next.js App Router** ร่วมกับ **Custom Node.js Server** เพื่อรองรับ Stateful Connection:
* `app/patient/page.js`: หน้าฟอร์มสำหรับคนไข้ พร้อมระบบ Validation
* `app/staff/page.js`: หน้าจอ Monitor สำหรับเจ้าหน้าที่ แสดงผลสถานะแบบ Real-time
* `server.js`: หัวใจหลักของระบบ จัดการ Socket.io เพื่อทำ Data Relaying
* `Procfile`: ไฟล์สำหรับ Heroku เพื่อกำหนดคำสั่งในการรัน Production Server

### 2. Design Decisions
* **UI/UX Concept**: ออกแบบให้มีความเป็น Medical Professional โดยใช้โทนสี Blue-Gray และใช้ TailwindCSS ในการจัดการ Grid Layout
* **Responsiveness**: รองรับการใช้งานแบบ Fully Responsive (Mobile, Tablet, Desktop) เพื่อความสะดวกของทั้งคนไข้และเจ้าหน้าที่
* **Interactive Feedback**: นำ **SweetAlert2** มาใช้ในการยืนยันการบันทึกข้อมูล เพื่อสร้างความมั่นใจให้กับผู้ใช้งาน

### 3. Component Architecture
* **State Management**: ใช้ React Hooks (`useState`, `useEffect`, `useRef`) ในการจัดการข้อมูลและ Socket Instance
* **Form Validation**: ตรวจสอบช่องข้อมูลที่จำเป็น (Required) และตรวจสอบรูปแบบเบอร์โทรศัพท์/อีเมลให้ถูกต้องก่อนส่งข้อมูล
* **Real-time Logic**: ออกแบบให้มีการส่งข้อมูลแบบ Incremental เพื่อลดภาระของ Server

### 4. Real-Time Synchronization Flow
1.  **Input Phase**: เมื่อคนไข้กรอกข้อมูล ระบบจะส่ง Event `patient-update` ไปยัง Server
2.  **Relay Phase**: Server รับข้อมูลและทำ Broadcast ไปยังหน้า Staff ทุกหน้าจอทันที
3.  **Monitoring Phase**: ระบบคำนวณความเคลื่อนไหวล่าสุด (Activity) หากไม่มีการตอบสนองจะแสดงสถานะ **Inactive**
4.  **Completion Phase**: เมื่อกดบันทึก ข้อมูลจะถูกส่งเป็น `patient-submit` และเปลี่ยนสถานะเป็น **Submitted** (สีเขียว) บนหน้าจอเจ้าหน้าที่

---

## Bonus Features Implemented
* ✅ **SweetAlert2 Integration**: การแจ้งเตือนที่สวยงามและใช้งานง่ายหลังบันทึกสำเร็จ
* ✅ **Auto-Form Reset**: ระบบล้างข้อมูลในฟอร์มอัตโนมัติหลังการส่ง เพื่อรองรับคนไข้คนถัดไป
* ✅ **Detailed Hint Text**: แสดงคำแนะนำ `(Name - Relationship)` ใต้ช่อง Emergency Contact เพื่อความชัดเจน
* ✅ **Inactive Detection**: ระบบตรวจจับกรณีคนไข้หยุดกรอกข้อมูลเกินเวลาที่กำหนด

---
**Prepared by:** กฤษฏิ์ สุทจิตร์ | **Agnos Candidate Assignment**