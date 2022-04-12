/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "Password";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Family" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "salutation" TEXT NOT NULL,
    "suffix" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email2" TEXT NOT NULL,
    "homePhone" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "schoolInformationConfigSchoolID" INTEGER,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL,
    "administrator" BOOLEAN NOT NULL DEFAULT false,
    "upperSchool" BOOLEAN NOT NULL DEFAULT false,
    "lowerSchool" BOOLEAN NOT NULL DEFAULT false,
    "staff" BOOLEAN NOT NULL DEFAULT false,
    "substitute" BOOLEAN NOT NULL DEFAULT false,
    "faculty" BOOLEAN NOT NULL DEFAULT false,
    "schoolInformationConfigSchoolID" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentStudent" (
    "parentId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "correspondence" BOOLEAN NOT NULL,
    "custody" BOOLEAN NOT NULL,
    "grandparent" BOOLEAN NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "ParentStudent_pkey" PRIMARY KEY ("parentId","studentId")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "aideId" INTEGER,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "courseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pattern" INTEGER,
    "section" TEXT,
    "teacherId" INTEGER,
    "term1" BOOLEAN NOT NULL DEFAULT false,
    "term2" BOOLEAN NOT NULL DEFAULT false,
    "term3" BOOLEAN NOT NULL DEFAULT false,
    "term4" BOOLEAN NOT NULL DEFAULT false,
    "term5" BOOLEAN NOT NULL DEFAULT false,
    "term6" BOOLEAN NOT NULL DEFAULT false,
    "yearId" INTEGER,
    "teacher2Id" INTEGER,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "Course" (
    "levelID" INTEGER,
    "title" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "homeRoom" BOOLEAN NOT NULL DEFAULT false,
    "schoolCode" TEXT,
    "department" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "elective" BOOLEAN NOT NULL DEFAULT false,
    "hs" BOOLEAN NOT NULL DEFAULT false,
    "preSchool" BOOLEAN NOT NULL DEFAULT false,
    "elementary" BOOLEAN NOT NULL DEFAULT false,
    "middleSchool" BOOLEAN NOT NULL DEFAULT false,
    "courseType" TEXT,
    "departmentId" INTEGER,
    "description" TEXT,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "classId" INTEGER NOT NULL,
    "enrolled" BOOLEAN NOT NULL DEFAULT false,
    "enrolled1" BOOLEAN NOT NULL DEFAULT false,
    "enrolled2" BOOLEAN NOT NULL DEFAULT false,
    "enrolled3" BOOLEAN NOT NULL DEFAULT false,
    "enrolled4" BOOLEAN NOT NULL DEFAULT false,
    "enrolled5" BOOLEAN NOT NULL DEFAULT false,
    "enrolled6" BOOLEAN NOT NULL DEFAULT false,
    "gradeLevel" TEXT,
    "studentId" INTEGER NOT NULL,
    "schoolYearYearId" INTEGER
);

-- CreateTable
CREATE TABLE "SchoolInformation" (
    "active" BOOLEAN NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "configSchoolID" INTEGER NOT NULL,
    "defaultTermId" INTEGER NOT NULL,
    "defaultYearId" INTEGER NOT NULL,
    "districtName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nextYearId" INTEGER NOT NULL,
    "parentAlert" BOOLEAN NOT NULL,
    "pwTermID" INTEGER NOT NULL,
    "pwTermID2" INTEGER NOT NULL,
    "pwYearID" INTEGER NOT NULL,
    "schoolCode" TEXT NOT NULL,
    "schoolLMS" BOOLEAN NOT NULL,
    "schoolName" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "SchoolInformation_pkey" PRIMARY KEY ("configSchoolID")
);

-- CreateTable
CREATE TABLE "SchoolTerm" (
    "termId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "firstDay" TIMESTAMP(3) NOT NULL,
    "lastDay" TIMESTAMP(3) NOT NULL,
    "schoolCode" TEXT NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "uniqueTermId" INTEGER
);

-- CreateTable
CREATE TABLE "SchoolYear" (
    "yearName" TEXT NOT NULL,
    "yearId" INTEGER NOT NULL,
    "firstDay" TIMESTAMP(3) NOT NULL,
    "lastDay" TIMESTAMP(3) NOT NULL,
    "schoolCode" TEXT NOT NULL,
    "allowInquiry" BOOLEAN NOT NULL,
    "blockAcademicYear" BOOLEAN NOT NULL,

    CONSTRAINT "SchoolYear_pkey" PRIMARY KEY ("yearId")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactsLoadedTable" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "table" TEXT NOT NULL,

    CONSTRAINT "FactsLoadedTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FamilyToPerson" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ParentStudent_parentId_studentId_key" ON "ParentStudent"("parentId", "studentId");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_classId_idx" ON "Enrollment"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_classId_key" ON "Enrollment"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolInformation_defaultTermId_key" ON "SchoolInformation"("defaultTermId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolInformation_defaultYearId_key" ON "SchoolInformation"("defaultYearId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolInformation_nextYearId_key" ON "SchoolInformation"("nextYearId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolInformation_schoolCode_key" ON "SchoolInformation"("schoolCode");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolInformation_defaultTermId_defaultYearId_key" ON "SchoolInformation"("defaultTermId", "defaultYearId");

-- CreateIndex
CREATE INDEX "SchoolTerm_termId_yearId_idx" ON "SchoolTerm"("termId", "yearId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolTerm_termId_yearId_key" ON "SchoolTerm"("termId", "yearId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_name_key" ON "Setting"("name");

-- CreateIndex
CREATE INDEX "Setting_name_idx" ON "Setting"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_FamilyToPerson_AB_unique" ON "_FamilyToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_FamilyToPerson_B_index" ON "_FamilyToPerson"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolInformationConfigSchoolID_fkey" FOREIGN KEY ("schoolInformationConfigSchoolID") REFERENCES "SchoolInformation"("configSchoolID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_id_fkey" FOREIGN KEY ("id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_schoolInformationConfigSchoolID_fkey" FOREIGN KEY ("schoolInformationConfigSchoolID") REFERENCES "SchoolInformation"("configSchoolID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_id_fkey" FOREIGN KEY ("id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_aideId_fkey" FOREIGN KEY ("aideId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher2Id_fkey" FOREIGN KEY ("teacher2Id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "SchoolYear"("yearId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_schoolYearYearId_fkey" FOREIGN KEY ("schoolYearYearId") REFERENCES "SchoolYear"("yearId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolInformation" ADD CONSTRAINT "SchoolInformation_defaultTermId_defaultYearId_fkey" FOREIGN KEY ("defaultTermId", "defaultYearId") REFERENCES "SchoolTerm"("termId", "yearId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolInformation" ADD CONSTRAINT "SchoolInformation_defaultYearId_fkey" FOREIGN KEY ("defaultYearId") REFERENCES "SchoolYear"("yearId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolInformation" ADD CONSTRAINT "SchoolInformation_nextYearId_fkey" FOREIGN KEY ("nextYearId") REFERENCES "SchoolYear"("yearId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTerm" ADD CONSTRAINT "SchoolTerm_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "SchoolYear"("yearId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyToPerson" ADD FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyToPerson" ADD FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
