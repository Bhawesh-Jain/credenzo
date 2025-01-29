import db from "../db"

export async function executeQuery(query: string, values: any[] = []) {
  try {
    const [results] = await db.execute(query, values)
    return results
  } catch (e) {
    console.log(e);
    throw new Error("Database Error!");
  }
}