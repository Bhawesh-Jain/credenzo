import mysql from 'mysql2/promise';
import db from '../db';

export class DatabaseError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}


export async function executeQuery<T>(
  query: string,
  params?: any[],
  transaction?: mysql.Connection
): Promise<T> {
  const connection = transaction || db;
  
  try {
    const [rows] = await connection.execute(query, params);
    return rows as T;
  } catch (error: any) {
    throw new DatabaseError(
      `Query execution failed: ${error.message}`,
      error.code
    );
  }
}

// Transaction wrapper
export async function withTransaction<T>(
  operation: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await operation(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


export class QueryBuilder {
  private table: string;
  private conditions: string[] = [];
  private parameters: any[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private orderByFields: string[] = [];
  private connection?: mysql.Connection
  
  constructor(table: string) {
    this.table = table;
  }

  setConnection(connection?: mysql.Connection) {
    this.connection = connection;
    return this;
  }
  
  where(condition: string, ...params: any[]) {
    this.conditions.push(condition);
    this.parameters.push(...params);
    return this;
  }
  
  limit(value: number) {
    this.limitValue = value;
    return this;
  }
  
  offset(value: number) {
    this.offsetValue = value;
    return this;
  }
  
  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC') {
    this.orderByFields.push(`${field} ${direction}`);
    return this;
  }
  
  async select<T>(fields: string[] = ['*']): Promise<T[]> {
    let query = `SELECT ${fields.join(', ')} FROM ${this.table}`;
    
    if (this.conditions.length) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    
    if (this.orderByFields.length) {
      query += ` ORDER BY ${this.orderByFields.join(', ')}`;
    }
    
    if (this.limitValue !== undefined) {
      query += ` LIMIT ${this.limitValue}`;
    }
    
    if (this.offsetValue !== undefined) {
      query += ` OFFSET ${this.offsetValue}`;
    }
    
    console.log(query, this.parameters);
    
    return executeQuery<T[]>(query, this.parameters, this.connection);
  }
  
  async insert<T>(data: Record<string, any>): Promise<number> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = new Array(fields.length).fill('?').join(', ');
    
    const query = `
      INSERT INTO ${this.table} 
      (${fields.join(', ')}) 
      VALUES (${placeholders})
    `;

    
    const result = await executeQuery<mysql.ResultSetHeader>(query, values, this.connection);
    return result.insertId;
  }
  
  async update(data: Record<string, any>): Promise<number> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const query = `
      UPDATE ${this.table}
      SET ${fields.map(field => `${field} = ?`).join(', ')}
      ${this.conditions.length ? `WHERE ${this.conditions.join(' AND ')}` : ''}
    `;

    

    const result = await executeQuery<any>(query, [...values, ...this.parameters], this.connection);
    return result.affectedRows;
  }

  async count(column: string = '*'): Promise<number> {
    if (column !== '*') {
      column = `\`${column}\``;
    }

    let query = `SELECT COUNT(${column}) AS count FROM ${this.table}`;

    if (this.conditions.length) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }

    const result = await executeQuery<{ count: number }[]>(
      query,
      this.parameters,
      this.connection
    );
    
    return result[0]?.count || 0;
  }
}