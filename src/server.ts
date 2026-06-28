import express from 'express';
import { testConnection, setupDatabase } from './database/connection.js';
import { ProductsController } from './modules/products/controllers/ProductsController.js';

const app = express();
app.use(express.json());

// Instanciando o Controller que gerencia as ações
const productsController = new ProductsController();

// Definindo as rotas da API
app.get('/produtos', productsController.index);
app.post('/produtos', productsController.create);
app.patch('/produtos/:id', productsController.update);
app.delete('/produtos/:id', productsController.delete);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor Express rodando com sucesso em http://localhost:${PORT}`);
    await testConnection();
    await setupDatabase();
});
    