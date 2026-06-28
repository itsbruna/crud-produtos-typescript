import {ProductsRepository} from '../repositories/ProductsRepository.js';

export class CreateProductService {
    private productsRepository: ProductsRepository;

    constructor() {
        this.productsRepository = new ProductsRepository();
    }

    async execute(nome: string, preco: number) {
        // Regra de negócio: não permitir produtos com preço negativo
        if (preco < 0) {
            throw new Error('Preço não pode ser menor que zero.');
        }

        const produto = await this.productsRepository.create(nome, preco);
        return produto;
    }
}
