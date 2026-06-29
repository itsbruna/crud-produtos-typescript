import { MercadoLivreProvider } from '../../../shared/providers/MercadoLivreProvider.js';
import pool from '../../../database/connection.js'

export class DashboardService {
  private mlProvider = new MercadoLivreProvider();

  async executar(usuarioId: number) {
    // 1. Query SQL pura para pegar métricas gerais do usuário logado (Pegando o rows[0])
    const metricsQuery = `
      SELECT 
        COUNT(*) AS total_produtos,
        COALESCE(SUM(preco), 0) AS valor_total_estoque
      FROM produtos 
      WHERE usuario_id = $1 AND deletado_em IS NULL;
    `;
    const metricsResult = await pool.query(metricsQuery, [usuarioId]);
    const metricas = metricsResult.rows[0]; // Correto: acessa o objeto da primeira linha

    // 2. Query para pegar o nome e preço do produto mais caro para comparar no ML
    const topProductQuery = `
      SELECT nome, preco 
      FROM produtos 
      WHERE usuario_id = $1 AND deletado_em IS NULL 
      ORDER BY preco DESC 
      LIMIT 1;
    `;
    const topProductResult = await pool.query(topProductQuery, [usuarioId]);
    const produtoMaisCaro = topProductResult.rows[0]; // Correto: acessa o objeto da primeira linha

    let analiseMercadoLivre = null; // Corrigido: sem espaço no nome da variável

    // 3. Se o usuário tiver produtos, compara o mais caro com o Mercado Livre
    if (produtoMaisCaro) {
      const dadosML = await this.mlProvider.buscarPrecosConcorrentes(produtoMaisCaro.nome);
      
      const meuPreco = Number(produtoMaisCaro.preco);
      const diferencaPercentual = dadosML.precoMedioMercado > 0 
        ? (((meuPreco - dadosML.precoMedioMercado) / dadosML.precoMedioMercado) * 100).toFixed(1)
        : "0";

      analiseMercadoLivre = {
        produtoComparado: produtoMaisCaro.nome,
        seuPreco: meuPreco,
        precoMedioML: dadosML.precoMedioMercado,
        menorPrecoML: dadosML.menorPrecoMercado,
        statusCompetitivo: meuPreco > dadosML.precoMedioMercado 
          ? `Seu produto esta ${diferencaPercentual}% mais caro que a media` 
          : `Seu produto esta competitivo (${diferencaPercentual}% em relacao a media)`
      };
    }

    // 4. Retorno formatado do "Dashboard" backend
    return {
      resumoGeral: {
        totalProdutosAtivos: Number(metricas.total_produtos),
        investimentoTotalEstoque: Number(metricas.valor_total_estoque),
      },
      insightsDeMercado: analiseMercadoLivre
    };
  }
}
