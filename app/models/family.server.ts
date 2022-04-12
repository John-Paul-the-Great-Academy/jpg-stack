import {db} from './db.server'

// Get Families
export const getFamilies = async () => {
  const families = await db.family.findMany({
  })
  return families
}
