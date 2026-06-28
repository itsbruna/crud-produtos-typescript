import pool from '../../../database/connection.js';

export class ProductsRepository {
    async findAll() {
        // Busca apenas onde deletado_em não tem valor (nulo)
        const queryText = 'SELECT * FROM produtos WHERE deletado_em IS NULL ORDER BY id ASC;';
        const resultado = await pool.query(queryText);
        return resultado.rows;
    }

    async findById(id: string) {
        const queryText = 'SELECT * FROM produtos WHERE id = $1 AND deletado_em IS NULL;';
        const resultado = await pool.query(queryText, [id]);
        // Retorna a primeira linha encontrada [0] ou null se estiver vazio
        return resultado.rows.length > 0 ? resultado.rows[0] : null;
    }

    async create(nome: string, preco: number) {
        const queryText = `
      INSERT INTO produtos (nome, preco) 
      VALUES ($1, $2) 
      RETURNING *;
    `;
        const resultado = await pool.query(queryText, [nome, preco]);
        return resultado.rows[0]; // Retorna o produto criado diretamente
    }

    async delete(id: string) {
        // Aplica o carimbo de data/hora atual (NOW()) para fazer o Soft Delete
        const queryText = 'UPDATE produtos SET deletado_em = NOW() WHERE id = $1;';
        await pool.query(queryText, [id]);
    }

    async update(id: string, nome: string | undefined, preco: number | undefined) {
        // COALESCE($2, nome) significa: Se $2 for nulo, mantenha o valor atual da coluna 'nome'
        const queryText = `
      UPDATE produtos
      SET
        nome = COALESCE($2, nome),
        preco = COALESCE($3, preco)
      WHERE id = $1 AND deletado_em IS NULL
      RETURNING *;
    `;
        const values = [id, nome ?? null, preco ?? null];
        const resultado = await pool.query(queryText, values);
        return resultado.rows[0] || null; // Retorna o produto atualizado ou null se não encontrado
    }
}
