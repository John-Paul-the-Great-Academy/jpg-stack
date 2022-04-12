// import { Headers } from "node-fetch";
import fetch from "cross-fetch"

export type List<T> = {
  results: T[]
  currentPage: number
  pageCount: number
  pageSize: number
  rowCount: number
  nextPage: string
}
export type Class = {
  aideId: number
  closed: boolean
  color: string
  colorText?: string
  courseID: number
  googleCourseId: string
  legacyClassId: string
  linkedClassId: number
  maleFemale: {}
  modifiedBy: number
  modifiedDate: string
  name: string
  pattern: number
  requiredRoom: number
  section: string
  staffId: number
  term1: boolean
  term2: boolean
  term3: boolean
  term4: boolean
  term5: boolean
  term6: boolean
  yearId: number
  instructor2Id: number
  classId: number
}
export type Course = {
  levelID: number
  legacyCourseID: string
  title: string
  abbreviation: string
  activity: boolean
  attendance: boolean
  homeRoom: boolean
  schoolCode: string
  department: string
  active: boolean
  elective: boolean
  hs: boolean
  preSchool: boolean
  elementary: boolean
  middleSchool: boolean
  modifiedBy: number
  modifiedDate: string
  courseType: string
  defaultStaffID: number
  departmentID: number
  description: string
  stateID: string
  courseID: number
}
export type SchoolInformation = {
  active: boolean
  address: string
  city: string
  configSchoolID: number
  defaultTermId: number
  defaultYearId: number
  districtName: string
  email: string
  nextYearId: number
  parentAlert: boolean
  pwTermID: number
  pwTermID2: number
  pwYearID: number
  schoolCode: string
  schoolLMS: boolean
  schoolName: string
  state: string
  zip: string
  fax: string
  phone: string
}
export type Person = {
  personId: number
  firstName: string
  lastName: string
  middleName: string
  nickName: string
  salutation: string
  suffix: string
  email: string
  email2: string
  username: string
  homePhone: string
  cellPhone: string
  addressID: number
  deceased: false
  modifiedDate: string
}
export type Student = {
  school: {
    status: string
    substatus: string
    enrollDate: string
    withdrawDate: string
    withdrawReason: string
    graduationDate: string
    gradeLevel: string
    nextStatus: string
    nextSchoolCode: string
    nextGradeLevel: string
  }
  configSchoolId: number
  personStudentId: number
  studentId: number
  schoolCode: string
}
export type ParentStudent = {
  parentID: number
  studentID: number
  custody: boolean
  correspondence: boolean
  relationship: string
  grandparent: boolean
  emergencyContact: boolean
  reportCard: boolean
  pwBlock: boolean
  pickUp: boolean
  parentsWeb: boolean
  reEnroll: boolean
}
export type Enrollment = {
  altYearId: number
  classId: number
  enrolled: boolean
  enrolled1: boolean
  enrolled2: boolean
  enrolled3: boolean
  enrolled4: boolean
  enrolled5: boolean
  enrolled6: boolean
  gradeLevel: string
  modifiedBy: number
  modifiedDate: string
  studentId: number
}
export type Faculty = {
  staffId: number
  name: string
  active: boolean
  administrator: boolean
  elementary: boolean
  faculty: boolean
  fullTime: boolean
  highSchool: boolean
  middleSchool: boolean
  preschool: boolean
  substitute: boolean
  startDate: string
  fte: number
  roomId: number
  schools: string[]
  department: string
  firstName: string
  lastName: string
  middleName: string
}
export type SchoolYear = {
  yearName: string
  allowInquiry: boolean
  blockAcademicYear: boolean
  yearId: number
  firstDay: string
  lastDay: string
  schoolCode: string
}
export type SchoolTerm = {
  termID: number
  yearID: number
  name: string
  firstDay: string
  lastDay: string
  schoolCode: string
  semesterID: number
  modifiedBy: number
  modifiedDate: string
  uniqueTermID: number
}
export type Family = {
  familyName: string
  enableWeb: boolean
  unlisted: number
  note: string
  modifiedBy: number
  modifiedDate: string
  familyNameBP: string
  parentsWebFinancialBlock: boolean
  familyID: number
}
export type PersonFamily = {
  personId: number
  familyId: number
  parent: boolean
  student: boolean
  financialResponsibility: boolean
  financialResponsibilityPercent: string
  familyOrder: number
  factsCustomer: boolean
}
export type Address = {
  addressID: number
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
  modifiedBy: number
  modifiedDate: string
  greeting1: string
  greeting2: string
  greeting3: string
  greeting4: string
  greeting5: string
  newStudentInquiryID: number
}
export type ClassCategory = {
  sisCategoryId: number
  classCategoryId: number
  weight: number
  classId: number
  title: string
  description: string
  meetsInTerm1: boolean
  meetsInTerm2: boolean
  meetsInTerm3: boolean
  meetsInTerm4: boolean
  meetsInTerm5: boolean
  meetsInTerm6: boolean
  drop: number
}
export type Assignment = {
  sisAssignmentId: number
  classCategoryId: number
  classId: number
  classAssignmentId: number
  title: string
  description: string
  dateAssigned: string
  dateDue: string
  assignmentNumber: number
  maxPoints: number
  weight: number
  extraCreditType: number
  modifiedBy: number
  modifiedDate: string
  publish: boolean
  calculate: boolean
  markedAsTest: boolean
  isLmsAssignment: boolean
  lmsItemId: number
  lmsItemTypeId: number
  descriptionHtml: string
  dateAssignedUtc: string
  dateDueUtc: string
  systemOfRecord: string
  googleAssignmentId: string
}

const pageSize = 6000

const factsHeaders = () => {
  if (!process.env.FACTS_SUBSCRIPTION_KEY || !process.env.FACTS_KEY) {
    throw new Error("You must set the FACTS_SUBSCRIPTION_KEY and FACTS_KEY")
  }

  const headers = {
    "Ocp-Apim-Subscription-Key": process.env.FACTS_SUBSCRIPTION_KEY,
    "Facts-Api-Key": process.env.FACTS_KEY,
  }
  return headers
}

export async function getFactsEndpoint<T>(url: string): Promise<T> {
  const headers = factsHeaders()
  const init: RequestInit = {
    method: "GET",
    headers: headers,
    cache: "default",
  }
  return (await (await fetch(url, init)).json()) as T
}

export async function getStudents() {
  const url = `https://api.factsmgt.com/Students?PageSize=${pageSize}&Filters=school.status==Enrolled&api-version=1`
  return await (
    await getFactsEndpoint<List<Student>>(url)
  ).results
}

// PERSON FAMILY
export async function getPersonFamilies(studentIds: string) {
  const url2 = `https://api.factsmgt.com/people/PersonFamily?Filters=personId==${studentIds}&PageSize=${1000}&api-version=1`
  return await (
    await getFactsEndpoint<List<PersonFamily>>(url2)
  ).results
}

export async function getFamilies(familyIds: string) {
  const url3 = `https://api.factsmgt.com/families?Filters=familyID==${familyIds}&PageSize=${5000}&api-version=1`
  return (await (await getFactsEndpoint<List<Family>>(url3)).results).filter(
    (f, i, fs) => fs.findIndex(s => s.familyID === f.familyID) === i
  )
}

// const url4 = `https://api.factsmgt.com/people/PersonFamily?Filters=familyId==${familyIds}&PageSize=${4000}&api-version=1`;
// const familyPersons = await (
//   await getFactsEndpoint<List<PersonFamily>>(url4)
// ).results;

export async function getStudentPersons(studentIds: string) {
  const url5 = `https://api.factsmgt.com/People?Filters=personId==${studentIds}&PageSize=${4000}&api-version=1`
  return await (
    await getFactsEndpoint<List<Person>>(url5)
  ).results
}

export async function getParentStudents(studentIds: String) {
  const url6 = `https://api.factsmgt.com/people/ParentStudent?Filters=studentID==${studentIds},correspondence==true&PageSize=${1000}&api-version=1`
  return await (
    await getFactsEndpoint<List<ParentStudent>>(url6)
  ).results
}

export async function getParentPersons(parentIds: string) {
  const url7 = `https://api.factsmgt.com/People?Filters=personId==${parentIds}&PageSize=${4000}&api-version=1`
  return await (
    await getFactsEndpoint<List<Person>>(url7)
  ).results
}

export async function getSchoolInformation() {
  const url8 = "https://api.factsmgt.com/SchoolConfigurations/1?api-version=1"
  return await getFactsEndpoint<SchoolInformation>(url8)
}

export async function getStaff() {
  const url9 = `https://api.factsmgt.com/people/Staff?Filters=active==true&PageSize=${pageSize}&api-version=1`
  return await (
    await getFactsEndpoint<List<Faculty>>(url9)
  ).results
}

export async function getStaffPersons(staffIds: string) {
  const url10 = `https://api.factsmgt.com/People?Filters=personId==${staffIds}&PageSize=${pageSize}&api-version=1`
  return await (
    await getFactsEndpoint<List<Person>>(url10)
  ).results
}

export async function getTerms() {
  const url11 = `https://api.factsmgt.com/SchoolTerms/v2/schools/1?PageSize=${pageSize}&api-version=1`
  return await (
    await getFactsEndpoint<List<SchoolTerm>>(url11)
  ).results
}

export async function getYears() {
  const url12 = `https://api.factsmgt.com/SchoolYears?PageSize=${pageSize}&api-version=1`
  return await (
    await getFactsEndpoint<List<SchoolYear>>(url12)
  ).results
}

export async function getClasses(defaultYear: number) {
  const url13 = `https://api.factsmgt.com/Classes/v2/schoolYears/${defaultYear}?PageSize=${pageSize}`
  return (await getFactsEndpoint<List<Class>>(url13)).results.filter(
    (curr, i, classes) =>
      classes.findIndex(c => c.classId === curr.classId) === i
  )
}

export async function getCourses() {
  const url14 = `https://api.factsmgt.com/Courses?PageSize=${pageSize}`
  return (await getFactsEndpoint<List<Course>>(url14)).results
}

export async function getEnrollments(classIds: string) {
  const url15 = `https://api.factsmgt.com/academics/Enrollments?Filters=classId==${classIds}&PageSize=${6000}&api-version=1`
  return await (
    await getFactsEndpoint<List<Enrollment>>(url15)
  ).results
}
