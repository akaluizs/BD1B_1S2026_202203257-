const database = require("../services/database.service");

class BaseRepository {
  constructor(tableName, primaryKey, columns, foreignKeys = []) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.columns = columns;
    this.foreignKeys = foreignKeys;
  }

  buildSelectQuery() {
    return `SELECT * FROM ${this.tableName}`;
  }

  buildInsertQuery() {
    const cols = this.columns.join(", ");
    const values = this.columns.map((col) => `:${col}`).join(", ");
    return `INSERT INTO ${this.tableName} (${cols}) VALUES (${values})`;
  }

  buildUpdateQuery() {
    const setClause = this.columns
      .filter((col) => col !== this.primaryKey)
      .map((col) => `${col} = :${col}`)
      .join(", ");
    return `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = :${this.primaryKey}`;
  }

  async getAll(limit = null, offset = 0) {
    let query = `SELECT * FROM ${this.tableName} ORDER BY ${this.primaryKey}`;
    if (limit !== null) {
      query = `SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (${query}) a WHERE ROWNUM <= :max_row) WHERE rnum > :offset`;
      const result = await database.execute(query, { max_row: offset + limit, offset: offset });
      return result.rows || [];
    }
    const result = await database.execute(query);
    return result.rows || [];
  }

  async getById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result = await database.execute(query, { id });
    return result.rows?.[0] || null;
  }

  async create(data) {
    const insertData = {};
    this.columns.forEach((col) => {
      if (data[col] !== undefined) {
        if (this.isDateColumn(col)) {
          insertData[col] = this.formatDateForOracle(data[col]);
        } else {
          insertData[col] = data[col];
        }
      }
    });
    await database.execute(this.buildInsertQuery(), insertData);
    return data[this.primaryKey];
  }

  isDateColumn(col) {
    const dateColumns = ['fecha', 'date', 'fecha_evaluacion', 'fecha_registro', 'fecha_nacimiento'];
    return dateColumns.some(dc => col.toLowerCase().includes(dc));
  }

  formatDateForOracle(dateStr) {
    if (!dateStr) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async update(id, data) {
    const updateData = { ...data, [this.primaryKey]: id };
    const cleanData = {};
    this.columns.forEach((col) => {
      if (updateData[col] !== undefined) {
        if (this.isDateColumn(col)) {
          cleanData[col] = this.formatDateForOracle(updateData[col]);
        } else {
          cleanData[col] = updateData[col];
        }
      }
    });
    cleanData[this.primaryKey] = id;
    await database.execute(this.buildUpdateQuery(), cleanData);
    return true;
  }

  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result = await database.execute(query, { id });
    return result.rowsAffected > 0;
  }

  async exists(id) {
    const query = `SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result = await database.execute(query, { id });
    return result.rows?.length > 0;
  }

  async count() {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await database.execute(query);
    return result.rows?.[0]?.COUNT || 0;
  }
}

module.exports = BaseRepository;