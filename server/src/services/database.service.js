const oracledb = require("oracledb");

class DatabaseService {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    try {
      if (this.pool) {
        return this.pool;
      }

      const connectionString = process.env.DB_CONNECTION_STRING ||
        `${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "1521"}/${process.env.DB_SID || "xe"}`;

      this.pool = await oracledb.createPool({
        user: process.env.DB_USER || "C123",
        password: process.env.DB_PASSWORD || "12345",
        connectionString: connectionString,
        poolMin: 1,
        poolMax: 10,
        poolIncrement: 1,
      });

      console.log("✅ Pool de conexiones Oracle establecido");
      return this.pool;
    } catch (error) {
      console.error("❌ Error creando pool de Oracle:", error.message);
      throw error;
    }
  }

  async getConnection() {
    if (!this.pool) {
      await this.initialize();
    }
    return this.pool.getConnection();
  }

  async execute(query, params = {}) {
    let connection;
    try {
      if (!this.pool) {
        await this.initialize();
      }

      connection = await this.pool.getConnection();

      const options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      };

      const binds = Object.keys(params).length > 0 ? params : [];

      const result = await connection.execute(query, binds, options);

      return result;
    } catch (error) {
      console.error("❌ Error ejecutando query:", error.message);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (e) {
          // ignore close errors
        }
      }
    }
  }

  async close() {
    if (this.pool) {
      try {
        await this.pool.close();
        this.pool = null;
        console.log("✅ Pool de conexiones Oracle cerrado");
      } catch (error) {
        console.error("❌ Error cerrando pool:", error.message);
      }
    }
  }
}

module.exports = new DatabaseService();