import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env.local natively
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  }
}

import { connectDB } from "../db/index";
import { Admin } from "../db/models/Admin";
import { Teacher } from "../db/models/Teacher";
import { Student } from "../db/models/Student";
import { Attendance } from "../db/models/Attendance";
import { Exam } from "../db/models/Exam";
import { Result } from "../db/models/Result";
import { Homework } from "../db/models/Homework";
import { Notice } from "../db/models/Notice";
import { Fee } from "../db/models/Fee";
import { Event } from "../db/models/Event";
import { Message } from "../db/models/Message";

async function seedPortalData() {
  console.log("🌱 STARTING COMPREHENSIVE PORTAL SEED PROCESS...");

  await connectDB();

  // 1. Seed Admin
  const adminPasswordHash = await bcrypt.hash("SunshineAdmin2026!", 10);
  await Admin.findOneAndUpdate(
    { email: "admin@sunshineps.edu.in" },
    { email: "admin@sunshineps.edu.in", passwordHash: adminPasswordHash, role: "admin" },
    { upsert: true, new: true }
  );
  console.log("✓ Admin account seeded: admin@sunshineps.edu.in");

  // 2. Seed Teachers
  const teacherPasswordHash = await bcrypt.hash("Teacher2026!", 10);
  const teachersData = [
    {
      name: "Dr. Ananya Sharma",
      email: "teacher@sunshineps.edu.in",
      employeeId: "EMP-2021-042",
      department: "Science & Physics",
      subjectSpecialization: "Physics & Natural Sciences",
      phone: "+91 98112 34567",
      assignedClass: "Grade X-A",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Prof. Rajesh Malhotra",
      email: "teacher.math@sunshineps.edu.in",
      employeeId: "EMP-2019-015",
      department: "Mathematics",
      subjectSpecialization: "Calculus & Algebra",
      phone: "+91 98223 45678",
      assignedClass: "Grade IX-B",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Priya Nair",
      email: "teacher.eng@sunshineps.edu.in",
      employeeId: "EMP-2022-088",
      department: "Humanities & Languages",
      subjectSpecialization: "English Literature & Grammar",
      phone: "+91 98334 56789",
      assignedClass: "Grade XI-A",
      avatarUrl: "https://images.unsplash.com/photo-1580894732468-918939c4f1c9?q=80&w=300&auto=format&fit=crop",
    },
  ];

  const teacherDocs = [];
  for (const t of teachersData) {
    const doc = await Teacher.findOneAndUpdate(
      { email: t.email },
      { ...t, passwordHash: teacherPasswordHash, role: "teacher" },
      { upsert: true, new: true }
    );
    teacherDocs.push(doc);
  }
  console.log(`✓ ${teacherDocs.length} Teacher accounts seeded.`);

  // 3. Seed Students
  const studentPasswordHash = await bcrypt.hash("Student2026!", 10);
  const studentsData = [
    {
      name: "Aarav Patel",
      email: "student@sunshineps.edu.in",
      rollNumber: "101",
      grade: "Grade X",
      section: "A",
      parentName: "Suresh Patel",
      parentPhone: "+91 98765 00001",
      dob: "2010-05-14",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Riya Sen",
      email: "riya.sen@sunshineps.edu.in",
      rollNumber: "102",
      grade: "Grade X",
      section: "A",
      parentName: "Amit Sen",
      parentPhone: "+91 98765 00002",
      dob: "2010-08-22",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Rohan Verma",
      email: "rohan.verma@sunshineps.edu.in",
      rollNumber: "103",
      grade: "Grade X",
      section: "A",
      parentName: "Vikas Verma",
      parentPhone: "+91 98765 00003",
      dob: "2010-03-10",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Sneha Kapoor",
      email: "sneha.k@sunshineps.edu.in",
      rollNumber: "104",
      grade: "Grade X",
      section: "A",
      parentName: "Rakesh Kapoor",
      parentPhone: "+91 98765 00004",
      dob: "2010-11-05",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    },
  ];

  const studentDocs = [];
  for (const s of studentsData) {
    const doc = await Student.findOneAndUpdate(
      { email: s.email },
      { ...s, passwordHash: studentPasswordHash, role: "student" },
      { upsert: true, new: true }
    );
    studentDocs.push(doc);
  }
  console.log(`✓ ${studentDocs.length} Student accounts seeded.`);

  const demoStudent = studentDocs[0]; // Aarav Patel

  // 4. Seed Attendance for demoStudent (94.2% Attendance over 35 days)
  await Attendance.deleteMany({ student: demoStudent._id });
  const attendanceRecords = [];
  const baseDate = new Date("2026-06-01");

  for (let i = 0; i < 35; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateStr = d.toISOString().split("T")[0];
    const status = i === 7 || i === 22 ? "absent" : i === 14 ? "late" : "present";

    attendanceRecords.push({
      student: demoStudent._id,
      grade: demoStudent.grade,
      section: demoStudent.section,
      date: dateStr,
      status,
      markedBy: "Dr. Ananya Sharma",
    });
  }

  await Attendance.insertMany(attendanceRecords);
  console.log(`✓ ${attendanceRecords.length} Attendance logs seeded for demo student.`);

  // 5. Seed Exam & Results
  await Exam.deleteMany({});
  const term1Exam = await Exam.create({
    title: "Term 1 Mid-Year Board Evaluation 2026",
    grade: "Grade X",
    subject: "All Subjects",
    examDate: "2026-07-15",
    totalMarks: 500,
    term: "Term 1",
  });

  await Result.deleteMany({ student: demoStudent._id });
  const resultsData = [
    { subject: "Mathematics", marksObtained: 94, totalMarks: 100, gradeLetter: "A+", remarks: "Outstanding analytical & problem solving skills." },
    { subject: "Physics", marksObtained: 88, totalMarks: 100, gradeLetter: "A", remarks: "Excellent grasp of mechanics and lab optics." },
    { subject: "Chemistry", marksObtained: 95, totalMarks: 100, gradeLetter: "A+", remarks: "Top score in organic chemistry practicals." },
    { subject: "English Literature", marksObtained: 90, totalMarks: 100, gradeLetter: "A+", remarks: "Articulate essay writing and comprehension." },
    { subject: "Computer Science", marksObtained: 98, totalMarks: 100, gradeLetter: "A+", remarks: "Perfect score in Python programming & logic." },
  ];

  for (const r of resultsData) {
    await Result.create({
      exam: term1Exam._id,
      student: demoStudent._id,
      ...r,
    });
  }
  console.log("✓ Term 1 Digital Report Card & Exam Results seeded.");

  // 6. Seed Homework
  await Homework.deleteMany({});
  await Homework.create([
    {
      title: "Optics & Light Reflection Lab Report",
      subject: "Physics",
      grade: "Grade X",
      section: "A",
      description: "Complete experiment 4 observations regarding concave mirror focal lengths and submit ray diagrams.",
      dueDate: "2026-07-30",
      teacherName: "Dr. Ananya Sharma",
      resourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Quadratic Equations Exercise 5.2",
      subject: "Mathematics",
      grade: "Grade X",
      section: "A",
      description: "Solve problems 1 to 15 from Chapter 5 notebook exercises.",
      dueDate: "2026-07-31",
      teacherName: "Prof. Rajesh Malhotra",
      resourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Shakespeare's Julius Caesar Essay",
      subject: "English Literature",
      grade: "Grade X",
      section: "A",
      description: "Write a 500-word analysis on Brutus' speech in Act III Scene II.",
      dueDate: "2026-08-02",
      teacherName: "Priya Nair",
    },
  ]);
  console.log("✓ Homework assignments seeded.");

  // 7. Seed Notices
  await Notice.deleteMany({});
  await Notice.create([
    {
      title: "Admissions Open for Academic Session 2026–27",
      content: "Applications for Nursery through Grade XI are currently open. Parents can submit online enquiries or schedule campus visits.",
      category: "academic",
      targetAudience: "all",
      isPinned: true,
    },
    {
      title: "Annual Inter-House Science Showcase 2026",
      content: "The annual science exhibition will take place on August 15 in the Main Auditorium. Students should register project titles by August 1.",
      category: "events",
      targetAudience: "all",
      isPinned: false,
    },
    {
      title: "Parent-Teacher Conference (Grade IX - XII)",
      content: "Term 1 PTC will be held on Saturday, August 8 from 9:00 AM to 1:00 PM. Digital report cards are now accessible in the student portal.",
      category: "exam",
      targetAudience: "all",
      isPinned: true,
    },
  ]);
  console.log("✓ School Notices & Announcements seeded.");

  // 8. Seed Fees & Invoices
  await Fee.deleteMany({});
  for (const s of studentDocs) {
    await Fee.create([
      {
        student: s._id,
        studentName: s.name,
        grade: s.grade,
        section: s.section,
        title: "Term 1 Tuition & Computer Lab Fee 2026",
        amount: 28500,
        dueDate: "2026-06-15",
        status: "paid",
        paidDate: "2026-06-10",
        transactionId: "TXN-2026-88491",
      },
      {
        student: s._id,
        studentName: s.name,
        grade: s.grade,
        section: s.section,
        title: "Term 2 Academic & Annual Development Fee",
        amount: 32000,
        dueDate: "2026-08-15",
        status: "pending",
      },
    ]);
  }
  console.log("✓ Student Fee Invoices & Payment Records seeded.");

  // 9. Seed Events & Academic Calendar
  await Event.deleteMany({});
  await Event.create([
    {
      title: "Independence Day & Science Exhibition",
      description: "Flag hoisting at 8:00 AM followed by annual student science projects showcase.",
      startDate: "2026-08-15",
      type: "cultural",
      isPublic: true,
    },
    {
      title: "Term 1 Final Examination Series",
      description: "Comprehensive written examinations for Grades IX to XII across all core subjects.",
      startDate: "2026-09-10",
      endDate: "2026-09-24",
      type: "exam",
      isPublic: true,
    },
    {
      title: "Mahatma Gandhi Jayanti Holiday",
      description: "National Holiday - School remains closed.",
      startDate: "2026-10-02",
      type: "holiday",
      isPublic: true,
    },
    {
      title: "Annual Sports Meet & Athletic Championship",
      description: "Track and field events, relay races, and house championship trophies at Main Sports Ground.",
      startDate: "2026-11-12",
      type: "sports",
      isPublic: true,
    },
  ]);
  console.log("✓ Academic Events & Holiday Calendar seeded.");

  // 10. Seed Sample Messages & Notifications
  await Message.deleteMany({});
  await Message.create([
    {
      senderName: "Dr. Ananya Sharma",
      senderEmail: "teacher@sunshineps.edu.in",
      senderRole: "teacher",
      recipientEmail: "student@sunshineps.edu.in",
      recipientRole: "student",
      gradeSection: "Grade X-A",
      subject: "Physics Lab Experiment 4 Guidance",
      content: "Hi Aarav, please make sure your ray diagrams use exact focal length measurements before submitting the lab report on Thursday.",
      isRead: false,
    },
    {
      senderName: "Admin Office",
      senderEmail: "admin@sunshineps.edu.in",
      senderRole: "admin",
      recipientEmail: "teacher@sunshineps.edu.in",
      recipientRole: "teacher",
      subject: "Faculty Meeting: Term 2 Syllabus Review",
      content: "Dear Faculty, all department heads are requested to assemble in Conference Room B on Friday at 3:00 PM.",
      isRead: true,
    },
  ]);
  console.log("✓ Communication Messages seeded.");

  console.log("🎉 COMPREHENSIVE PORTAL SEED COMPLETED SUCCESSFULLY!");
  await mongoose.disconnect();
}

seedPortalData().catch((err) => {
  console.error("❌ SEED ERROR:", err);
  process.exit(1);
});
