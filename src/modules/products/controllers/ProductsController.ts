import express from 'express';
import type { Request, Response } from 'express';
import { ProductsRepository } from '../repositories/ProductsRepository.js';
import { CreateProductService } from '../services/CreateProductService.js';
import { DeleteProductService } from '../services/DeleteProductService.js';
import { UpdateProductService } from '../services/UpdateProductService.js';

export class ProductsController {
    async index(req: Request, res: Response) {
        try {
            const productsRepository = new ProductsRepository();
            const produtos = await productsRepository.findAll();
            res.status(200).json(produtos);
        } catch (error: any) {
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
    }

    async create(req: Request, res: Response): Promise<any> {
        try {
            const { nome, preco } = req.body;
            const createProductService = new CreateProductService();
            const novoProduto = await createProductService.execute(nome, preco);
            res.status(201).json(novoProduto);
        } catch (error: any) { // Aqui já deve ter, mas garanta que está assim
            res.status(400).json({ error: error.message || 'Erro ao criar produto' });
        }
    }

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            // Garante que o ID é uma string válida
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'O parâmetro ID é obrigatório e deve ser válido.' });
            }
            const deleteProductService = new DeleteProductService();
            await deleteProductService.execute(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Erro ao deletar produto' });
        }
    }

    async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { nome, preco } = req.body;
            // Type Guard para garantir que o ID é uma string válida
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'O parâmetro ID é obrigatório e deve ser válido.' });
            }
            const updateProductService = new UpdateProductService();
            const produtoAtualizado = await updateProductService.execute(id, nome, preco);
            res.status(200).json(produtoAtualizado);
        } catch (error: any) {
            // Trata erros de validacao ou de produtos não encontrados
            const status = error.message.includes('não encontrado') ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    }
}
