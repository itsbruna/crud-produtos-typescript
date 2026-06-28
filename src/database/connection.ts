import pg from 'pg';

const { Pool } = pg;

// Este pool irá gerenciar multiplas conexões com o banco de dados automaticamente
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432, // Porta padrão do PostgreSQL
});

// Testando a conexão com o banco de dados
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
        client.release(); // Liberando o cliente de volta para o pool
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
    }
};

export default pool;

export const setupDatabase = async () => {
    // 1. Garante que a tabela existe
    try {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10, 2) NOT NULL
      );
    `;
        await pool.query(createTableQuery);
        // 2. Adiciona a coluna (deletado_em) se não existir
        const addColumnQuery = `
      ALTER TABLE produtos 
      ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    `;
        await pool.query(addColumnQuery);

        console.log('Tabela "produtos" e colunas verificadas com sucesso!');
    } catch (error) {
        console.error('Erro ao configurar as tabelas:', error);
    }
};
