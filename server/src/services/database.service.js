const oracledb = require("oracledb");

class DatabaseService {
  constructor() {
    this.connection = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      if (this.initialized && this.connection) {
        return this.connection;
      }

      this.connection = await oracledb.getConnection({
        user: process.env.DB_USER || "C123",
        password: process.env.DB_PASSWORD || "12345",
        connectionString: `${process.env.DB_HOST || "localhost"}:${
          process.env.DB_PORT || "1521"
        }/${process.env.DB_SID || "xe"}`,
      });

      this.initialized = true;
      console.log("✅ Conexión a Oracle establecida");
      return this.connection;
    } catch (error) {
      console.error("❌ Error conectando a Oracle:", error.message);
      throw error;
    }
  }

  async execute(query, params = []) {
    try {
      if (!this.connection) {
        await this.initialize();
      }

      const result = await this.connection.execute(query, params, {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      return result;
    } catch (error) {
      console.error("❌ Error ejecutando query:", error.message);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      try {
        await this.connection.close();
        this.connection = null;
        this.initialized = false;
        console.log("✅ Conexión a Oracle cerrada");
      } catch (error) {
        console.error("❌ Error cerrando conexión:", error.message);
      }
    }
  }
}

module.exports = new DatabaseService();
