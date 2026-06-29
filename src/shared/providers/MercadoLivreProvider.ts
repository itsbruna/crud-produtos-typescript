export interface MLComparisonResult {
    precoMedioMercado: number;
    menorPrecoMercado: number;
}

export class MercadoLivreProvider {
    async buscarPrecosConcorrentes (nomeProduto: string): Promise<MLComparisonResult> {
        try {
            // Codifica o nome do produto para a URL
            const queryFormatada = encodeURIComponent(nomeProduto);
            const url = `https://mercadolibre.com{queryFormatada}&limit=5`; // Limita a busca aos 5 primeiros para performance
            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao buscar preços no Mercado Livre: ${response.statusText}`);
            }

            const data = await response.json();
            const resultados = data.results || [];

            if (resultados.length === 0) {
                return {precoMedioMercado: 0, menorPrecoMercado: 0};
            }

            // Extrai apenas os preços dos produtos retornados
            const precos: number[] = resultados.map((item: any) => item.price);

            const somaPrecos = precos.reduce((acc, preco) => acc + preco, 0);
            const precoMedio = Number((somaPrecos / precos.length).toFixed(2));
            const menorPreco = Math.min(...precos);

            return {
                precoMedioMercado: precoMedio,
                menorPrecoMercado: menorPreco
            };
        } catch (error) {
            console.error('Falha na integração com Mercado Livre:', error);
            // Retorna 0 para não quebrar a aplicação caso a API externa caia
            return {precoMedioMercado: 0, menorPrecoMercado: 0};
        }
    }
}
