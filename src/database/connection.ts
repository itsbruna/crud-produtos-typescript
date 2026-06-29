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
    try {
        // 1. Cria a tabela "usuarios" antes de tudo
        const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await pool.query(createUsersTableQuery);
        // 2. Garante que a tabela de produtos existe
        const createProductsTableQuery = `
        CREATE TABLE IF NOT EXISTS produtos (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          preco DECIMAL(10, 2) NOT NULL
        );
      `;
        await pool.query(createProductsTableQuery);
        // 3. Adiciona a coluna (deletado_em) se não existir
        const addDeleteColumnQuery = `
        ALTER TABLE produtos 
        ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP WITH TIME ZONE DEFAULT NULL;
        `;
        await pool.query(addDeleteColumnQuery);
        // 4. Cria a relação 1:N entre usuários e produtos
        const addUserRelationQuery = `
        ALTER TABLE produtos
        ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE;
        `;
        await pool.query(addUserRelationQuery);

        console.log('Banco de dados SaaS (Tabelas e Vínculos) verificado com sucesso!');
    } catch (error) {
        console.error('Erro ao configurar as tabelas do banco de dados:', error);
    }
};
