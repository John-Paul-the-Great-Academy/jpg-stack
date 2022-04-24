import type {
  Class,
  Course,
  Enrollment,
  Faculty,
  Student,
  Person,
  ParentStudent,
  Family,
  SchoolInformation,
  SchoolTerm,
  SchoolYear,
} from "./facts.server";
import {
  getClasses,
  getCourses,
  getEnrollments,
  getFamilies,
  getParentPersons,
  getParentStudents,
  getPersonFamilies,
  getSchoolInformation,
  getStaff,
  getStaffPersons,
  getStudentPersons,
  getStudents,
  getTerms,
  getYears,
} from "./facts.server";
import { db } from "../services/db.server";

export const updateFactsLoadedTable = async (table: string) => {
  try {
    const dbTable = `facts_${table.toLowerCase()}`;
    // TODO: FIX
    // await db.factsLoadedTable.create({
    //   data: {
    //     table: dbTable,
    //   },
    // });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export type LoadError = { error: string; errorType: string };
export type LoadedData<T> = T | LoadError;
////////////////

export async function main() {
  console.log(
    "pulling from FACTS: students, staff, schoolInformation, terms, years"
  );
  const [students, staff, schoolInformation, terms, years] = await Promise.all([
    getStudents(),
    getStaff(),
    getSchoolInformation(),
    getTerms(),
    getYears(),
  ]);
  const defaultYear = schoolInformation.nextYearId;
  const studentIds = students.map((s) => s.studentId).join("|");
  const staffIds = staff.map((s) => s.staffId).join("|");

  console.log(
    "pulling from FACTS: studentPersons, personFamilies, parentStudents, staffPersons, classes, courses"
  );
  const [
    studentPersons,
    personFamilies,
    parentStudents,
    staffPersons,
    classes,
    courses,
  ] = await Promise.all([
    getStudentPersons(studentIds),
    getPersonFamilies(studentIds),
    getParentStudents(studentIds),
    getStaffPersons(staffIds),
    getClasses(defaultYear),
    getCourses(),
  ]);
  const familyIds = Array.from(
    new Set([...personFamilies.map((p) => p.familyId)])
  ).join("|");
  const parentIds = parentStudents.map((p) => p.parentID).join("|");
  const classIds = classes.map((c) => c.classId).join("|");

  console.log("pulling from FACTS: families, parentPersons, enrollments");
  const [families, parentPersons, enrollments] = await Promise.all([
    getFamilies(familyIds),
    getParentPersons(parentIds),
    getEnrollments(classIds),
  ]);

  console.log("Loading DB");
  try {
    await loadDBYears(years);
    await loadDBTerms(terms);
    await loadDBSchoolInformation(schoolInformation);
    await loadDBFamily(families);
    await loadDBParentPerson(parentPersons);
    await loadDBParent(parentPersons);
    await loadDBStudentPersons(students, studentPersons);
    await loadDBStudents(students, studentPersons, schoolInformation);
    await loadDBParentStudentRelationship(parentStudents);
    await loadDBEmployeePerson(staffPersons);
    await loadDBEmployee(staff, schoolInformation);
    await loadDBCourses(courses);
    await loadDBClasses(classes, enrollments);
    await loadDBEnrollments(enrollments, students);
    // await Promise.all([loadDBYears(years), loadDBTerms(terms)]);

    // await Promise.all([
    //   loadDBStudentPersons(students, studentPersons),
    //   loadDBEmployeePerson(staffPersons),
    // ]);
    // await Promise.all([
    //   loadDBParentPerson(parentPersons),
    //   loadDBSchoolInformation(schoolInformation),
    // ]);
    // await Promise.all([loadDBFamily(families)]);
    // await loadDBParent(parentPersons);
    // await Promise.all([
    //   loadDBStudents(students, studentPersons, schoolInformation),
    //   loadDBEmployee(staff, schoolInformation),
    //   loadDBParentStudentRelationship(parentStudents),
    // ]);

    // await loadDBCourses(courses);
    // await loadDBClasses(classes, enrollments);
    // await loadDBEnrollments(enrollments, students);
  } catch (error) {
    console.log(error);
    return 0;
  }
  console.log("DB Loaded");
}

async function loadDBStudents(
  students: Student[],
  studentPersons: Person[],
  schoolInformation: SchoolInformation
) {
  try {
    return (
      await db.$transaction(
        students.map((student) => {
          const person = studentPersons.find(
            (s) => s.personId === student.studentId
          );
          return db.student.upsert({
            create: {
              id: student.studentId,
              grade: student.school.gradeLevel,
              schoolInformationConfigSchoolID: schoolInformation.configSchoolID,
            },
            update: {
              grade: student.school.gradeLevel,
              schoolInformationConfigSchoolID: schoolInformation.configSchoolID,
            },
            where: {
              id: student.studentId,
            },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBStudentPersons(
  students: Student[],
  studentPersons: Person[]
) {
  try {
    return (
      await db.$transaction(
        studentPersons.map((student) => {
          return db.person.upsert({
            create: {
              id: student.personId,
              firstName: student.firstName || "",
              lastName: student.lastName || "",
              middleName: student.middleName || "",
              nickName: student.nickName || "",
              salutation: student.salutation || "",
              suffix: student.suffix || "",
              cellPhone: student.cellPhone || "",
              homePhone: student.homePhone || "",
              email: student.email || "",
              email2: student.email2 || "",
            },
            update: {
              firstName: student.firstName || "",
              lastName: student.lastName || "",
              middleName: student.middleName || "",
              nickName: student.nickName || "",
              salutation: student.salutation || "",
              suffix: student.suffix || "",
              cellPhone: student.cellPhone || "",
              homePhone: student.homePhone || "",
              email: student.email || "",
              email2: student.email2 || "",
            },
            where: {
              id: student.personId,
            },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBSchoolInformation(schoolInformation: SchoolInformation) {
  try {
    await db.schoolInformation.upsert({
      create: {
        active: schoolInformation.active,
        address: schoolInformation.address,
        city: schoolInformation.city,
        configSchoolID: schoolInformation.configSchoolID,
        defaultTermId: schoolInformation.defaultTermId,
        defaultYearId: schoolInformation.defaultYearId,
        districtName: schoolInformation.districtName,
        email: schoolInformation.email || "",
        nextYearId: schoolInformation.nextYearId,
        parentAlert: schoolInformation.parentAlert,
        pwTermID: schoolInformation.pwTermID,
        pwTermID2: schoolInformation.pwTermID2,
        pwYearID: schoolInformation.pwYearID,
        schoolCode: schoolInformation.schoolCode,
        schoolLMS: schoolInformation.schoolLMS,
        schoolName: schoolInformation.schoolName,
        state: schoolInformation.state,
        zip: schoolInformation.zip,
        fax: schoolInformation.fax,
        phone: schoolInformation.phone,
      },
      update: {
        active: schoolInformation.active,
        address: schoolInformation.address,
        city: schoolInformation.city,
        defaultTermId: schoolInformation.defaultTermId,
        defaultYearId: schoolInformation.defaultYearId,
        districtName: schoolInformation.districtName,
        email: schoolInformation.email || "",
        nextYearId: schoolInformation.nextYearId,
        parentAlert: schoolInformation.parentAlert,
        pwTermID: schoolInformation.pwTermID,
        pwTermID2: schoolInformation.pwTermID2,
        pwYearID: schoolInformation.pwYearID,
        schoolCode: schoolInformation.schoolCode,
        schoolLMS: schoolInformation.schoolLMS,
        schoolName: schoolInformation.schoolName,
        state: schoolInformation.state,
        zip: schoolInformation.zip,
        fax: schoolInformation.fax,
        phone: schoolInformation.phone,
      },
      where: { configSchoolID: schoolInformation.configSchoolID },
    });
    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// async function loadDB(students: Student[], studentPersons: Person[]) {
//   try {
//     await db.$transaction(
//       studentPersons.map((student) => {
//         return db.person.upsert({
//           create: {},
//           update: {},
//           where: {},
//         });
//       })
//     );
//   } catch (error) {
//   console.log(error)
// }
// }

async function loadDBFamily(families: Family[]) {
  try {
    return (
      await db.$transaction(
        families.map((family) => {
          return db.family.upsert({
            create: {
              id: family.familyID,
              name: family.familyName || "",
            },
            update: { name: family.familyName || "" },
            where: { id: family.familyID },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBParent(parents: Person[]) {
  try {
    return (
      await db.$transaction(
        parents.map((parent) => {
          return db.parent.upsert({
            create: { id: parent.personId },
            update: { id: parent.personId },
            where: { id: parent.personId },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBParentPerson(parentPersons: Person[]) {
  try {
    return (
      await db.$transaction(
        parentPersons.map((person) => {
          return db.person.upsert({
            create: {
              id: person?.personId || 0,
              firstName: person?.firstName || "",
              lastName: person?.lastName || "",
              middleName: person?.middleName || "",
              nickName: person?.nickName || "",
              salutation: person?.salutation || "",
              suffix: person?.suffix || "",
              cellPhone: person?.cellPhone || "",
              homePhone: person?.homePhone || "",
              email: person?.email || "",
              email2: person?.email2 || "",
            },
            update: {
              firstName: person?.firstName || "",
              lastName: person?.lastName || "",
              middleName: person?.middleName || "",
              nickName: person?.nickName || "",
              salutation: person?.salutation || "",
              suffix: person?.suffix || "",
              cellPhone: person?.cellPhone || "",
              homePhone: person?.homePhone || "",
              email: person?.email || "",
              email2: person?.email2 || "",
            },
            where: { id: person?.personId },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBParentStudentRelationship(
  parentStudents: ParentStudent[]
) {
  try {
    return (
      await db.$transaction(
        parentStudents.map((p) => {
          return db.parentStudent.upsert({
            create: {
              parentId: p.parentID,
              studentId: p.studentID,
              relationship: p.relationship,
              grandparent: p.grandparent || false,
              custody: p.custody || false,
              correspondence: p.correspondence || false,
            },
            update: {
              relationship: p.relationship,
              grandparent: p.grandparent || false,
              custody: p.custody || false,
              correspondence: p.correspondence || false,
            },
            where: {
              parentId_studentId: {
                parentId: p.parentID,
                studentId: p.studentID,
              },
            },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBEmployee(
  employees: Faculty[],
  schoolInformation: SchoolInformation
) {
  try {
    return (
      await db.$transaction(
        employees.map((e) => {
          return db.employee.upsert({
            create: {
              id: e.staffId,
              administrator: e.administrator,
              lowerSchool: e.elementary,
              staff: !e.faculty,
              faculty: e.faculty,
              substitute: !e.faculty && e.substitute,
              upperSchool: e.highSchool || e.middleSchool,
              schoolInformationConfigSchoolID: schoolInformation.configSchoolID,
            },
            update: {
              administrator: e.administrator,
              lowerSchool: e.elementary,
              staff: !e.faculty,
              faculty: e.faculty,
              substitute: !e.faculty && e.substitute,
              upperSchool: e.highSchool || e.middleSchool,
              schoolInformationConfigSchoolID: schoolInformation.configSchoolID,
            },
            where: { id: e.staffId },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBEmployeePerson(employees: Person[]) {
  try {
    return (
      await db.$transaction(
        employees.map((person) => {
          return db.person.upsert({
            create: {
              id: person.personId,
              firstName: person.firstName || "",
              lastName: person.lastName || "",
              middleName: person.middleName || "",
              nickName: person.nickName || "",
              salutation: person.salutation || "",
              suffix: person.suffix || "",
              cellPhone: person.cellPhone || "",
              homePhone: person.homePhone || "",
              email: person.email || "",
              email2: person.email2 || "",
            },
            update: {
              firstName: person.firstName || "",
              lastName: person.lastName || "",
              middleName: person.middleName || "",
              nickName: person.nickName || "",
              salutation: person.salutation || "",
              suffix: person.suffix || "",
              cellPhone: person.cellPhone || "",
              homePhone: person.homePhone || "",
              email: person.email || "",
              email2: person.email2 || "",
            },
            where: { id: person.personId },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBYears(years: SchoolYear[]) {
  try {
    (
      await db.$transaction(
        years.map((year) => {
          return db.schoolYear.upsert({
            create: {
              yearId: year.yearId,
              yearName: year.yearName,
              schoolCode: year.schoolCode,
              lastDay: new Date(year.lastDay),
              firstDay: new Date(year.firstDay),
              allowInquiry: year.allowInquiry,
              blockAcademicYear: year.blockAcademicYear,
            },
            update: {
              yearName: year.yearName,
              schoolCode: year.schoolCode,
              lastDay: new Date(year.lastDay),
              firstDay: new Date(year.firstDay),
              allowInquiry: year.allowInquiry,
              blockAcademicYear: year.blockAcademicYear,
            },
            where: { yearId: year.yearId },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBTerms(terms: SchoolTerm[]) {
  try {
    return (
      await db.$transaction(
        terms.map((term) => {
          return db.schoolTerm.upsert({
            create: {
              termId: term.termID,
              yearId: term.yearID,
              uniqueTermId: term.uniqueTermID,
              semesterId: term.semesterID,
              schoolCode: term.schoolCode,
              name: term.name,
              lastDay: new Date(term.lastDay),
              firstDay: new Date(term.firstDay),
            },
            update: {
              uniqueTermId: term.uniqueTermID,
              semesterId: term.semesterID,
              schoolCode: term.schoolCode,
              name: term.name,
              lastDay: new Date(term.lastDay),
              firstDay: new Date(term.firstDay),
            },
            where: {
              termId_yearId: {
                termId: term.termID,
                yearId: term.yearID,
              },
            },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBClasses(classes: Class[], enrollments: Enrollment[]) {
  try {
    return (
      await db.$transaction(
        classes.map((c) => {
          const es = enrollments.filter((e) => e.classId === c.classId);
          return db.class.upsert({
            create: {
              ...(c.aideId && { aideId: c.aideId }),
              closed: c.closed,
              courseId: c.courseID,
              name: c.name,
              pattern: c.pattern,
              section: c.section,
              ...(c.staffId && { teacherId: c.staffId }),
              term1: c.term1,
              term2: c.term2,
              term3: c.term3,
              term4: c.term4,
              term5: c.term5,
              term6: c.term6,
              yearId: c.yearId,
              ...(c.instructor2Id && { teacher2Id: c.instructor2Id }),
              classId: c.classId,
              // Enrollment: {
              //   connectOrCreate: [
              //     ...es.map((e) => ({
              //       create: {
              //         altYearId: e.altYearId || 0,
              //         // classId: e.classId,
              //         enrolled: e.enrolled,
              //         enrolled1: e.enrolled1,
              //         enrolled2: e.enrolled2,
              //         enrolled3: e.enrolled3,
              //         enrolled4: e.enrolled4,
              //         enrolled5: e.enrolled5,
              //         enrolled6: e.enrolled6,
              //         gradeLevel: e.gradeLevel || "",
              //         studentId: e.studentId,
              //       },
              //       where: {
              //         studentId_classId: {
              //           classId: e.classId,
              //           studentId: e.studentId,
              //         },
              //       },
              //     })),
              //   ],
              // },
            },
            // include: {
            //   Enrollment: false,
            // },
            update: {
              ...(c.aideId && { aideId: c.aideId }),
              closed: c.closed,
              courseId: c.courseID,
              name: c.name,
              pattern: c.pattern,
              section: c.section,
              ...(c.staffId && { teacherId: c.staffId }),
              term1: c.term1,
              term2: c.term2,
              term3: c.term3,
              term4: c.term4,
              term5: c.term5,
              term6: c.term6,
              yearId: c.yearId,
              ...(c.instructor2Id && { teacher2Id: c.instructor2Id }),
            },
            where: { classId: c.classId },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBCourses(courses: Course[]) {
  try {
    return (
      await db.$transaction(
        courses.map((c) => {
          return db.course.upsert({
            create: {
              levelID: c.levelID,
              title: c.title,
              abbreviation: c.abbreviation,
              homeRoom: c.homeRoom,
              schoolCode: c.schoolCode,
              department: c.department,
              active: c.active,
              elective: c.elective,
              hs: c.hs,
              preSchool: c.preSchool,
              elementary: c.elementary,
              middleSchool: c.middleSchool,
              courseType: c.courseType,
              departmentId: c.departmentID,
              description: c.description,
              courseId: c.courseID,
            },
            update: {
              levelID: c.levelID,
              title: c.title,
              abbreviation: c.abbreviation,
              homeRoom: c.homeRoom,
              schoolCode: c.schoolCode,
              department: c.department,
              active: c.active,
              elective: c.elective,
              hs: c.hs,
              preSchool: c.preSchool,
              elementary: c.elementary,
              middleSchool: c.middleSchool,
              courseType: c.courseType,
              departmentId: c.departmentID,
              description: c.description,
            },
            where: { courseId: c.courseID },
          });
        })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function loadDBEnrollments(
  enrollments: Enrollment[],
  students: Student[]
) {
  try {
    return (
      await db.$transaction(
        enrollments
          .filter(
            (e) =>
              students.find((s) => s.studentId === e.studentId) && e.classId
          )
          .map((e) => {
            return db.enrollment.upsert({
              create: {
                // ...(e.altYearId && { altYearId: e.altYearId }),
                enrolled: e.enrolled,
                enrolled1: e.enrolled1,
                enrolled2: e.enrolled2,
                enrolled3: e.enrolled3,
                enrolled4: e.enrolled4,
                enrolled5: e.enrolled5,
                enrolled6: e.enrolled6,
                gradeLevel: e.gradeLevel || "",
                studentId: e.studentId || 0,
                classId: e.classId || 0,
              },
              update: {
                // ...(e.altYearId && { altYearId: e.altYearId }),
                enrolled: e.enrolled,
                enrolled1: e.enrolled1,
                enrolled2: e.enrolled2,
                enrolled3: e.enrolled3,
                enrolled4: e.enrolled4,
                enrolled5: e.enrolled5,
                enrolled6: e.enrolled6,
                gradeLevel: e.gradeLevel || "",
              },
              where: {
                studentId_classId: {
                  studentId: e.studentId,
                  classId: e.classId,
                },
              },
            });
          })
      )
    ).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
