import { ProductsRepository } from "../repositories/ProductsRepository.js";

export class UpdateProductService {
    private productsRepository: ProductsRepository;

    constructor() {
        this.productsRepository = new ProductsRepository();
    }

    async execute(id: string, nome: string | undefined, preco: number | undefined) {
        // 1. Verifica se o produto existe e está ativo
        const produtoExistente = await this.productsRepository.findById(id);
        if (!produtoExistente) {
            throw new Error("Produto não encontrado para atualização.");
        }

        // 2. Regra de Negócio: Se enviou preço, não pode ser menor que zero
        if (preco !== undefined && preco < 0) {
            throw new Error("O preço do produto não pode ser menor que zero.");
        }

        // 3. Executa a atualização no banco
        const produtoAtualizado = await this.productsRepository.update(id, nome, preco);
        return produtoAtualizado;
    }
}
