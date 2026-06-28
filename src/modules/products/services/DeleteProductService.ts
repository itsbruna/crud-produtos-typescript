import {ProductsRepository} from "../repositories/ProductsRepository.js";

export class DeleteProductService {
    private productsRepository: ProductsRepository;

    constructor() {
        this.productsRepository = new ProductsRepository();
    }

    async execute(id: string) {
        // Verificando se o produto realmente existe no banco de dados antes de tentar deletar
        const produtoExistente = await this.productsRepository.findById(id);
        if (!produtoExistente) {
            throw new Error('Produto não encontrado.');
        }

        await this.productsRepository.delete(id);
    }
}
