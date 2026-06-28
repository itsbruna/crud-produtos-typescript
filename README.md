# CRUD de Produtos com Node.js, TypeScript e SQL Puro

Este projeto nasceu do desejo de revisar e fixar conceitos fundamentais de desenvolvimento back-end, arquitetura em camadas e manipulação de bancos de dados relacionais. Decidi construir esta API REST do zero para ajudar na prática com Node.js, saindo um pouco das abstrações pesadas dos ORMs comerciais.

A proposta inicial aqui foi trabalhar com **SQL Puro** diretamente no código, entendendo de perto o fluxo de conexão, gerenciamento de pools e segurança em consultas estruturadas. Mas irei atualizar o projeto periodicamente, criando versões que utilizem tecnologias e ferramentas que simulem melhor a rotina atual nas empresas, para fins de estudo.

---

## Tecnologias e Ferramentas Utilizadas

* **Runtime & Framework:** Node.js (v24+) com Express
* **Linguagem:** TypeScript 
* **Banco de Dados:** PostgreSQL
* **Driver de Conexão:** `pg` (node-postgres) para execução das queries nativas
* **Ambiente de Desenvolvimento:** `tsx` para execução direta dos arquivos `.ts` e Thunder Client para testes de endpoints

---

## Organização do Código (Arquitetura)

Para manter a separação de responsabilidades limpa, estruturei a aplicação em módulos e camadas de domínio, facilitando a legibilidade para qualquer dev que queira entender o projeto, que atualmente está dividido em:

* **Controllers**
* **Services**
* **Repositories**

---

## Práticas Técnicas que Revisei Neste Projeto

* **Prevenção a SQL Injection:** Uso estrito de queries parametrizadas (`$1`, `$2`), garantindo que os dados de entrada nunca sejam concatenados diretamente como strings de execução.
* **Soft Delete (Exclusão Lógica):** Em vez de usar o (`DELETE`), implementei o carimbo de data/hora dinâmico através do campo `deletado_em` usando `UPDATE`. O método de listagem filtra registros ativos de forma transparente, preservando o dado.
* **Ajuste Dinâmico de Queries:** Uso da função `COALESCE` do PostgreSQL no método `PATCH`, permitindo atualizações parciais eficientes sem a necessidade de reescrever múltiplas queries ou sobrescrever dados indesejados.
* **Configuração de Ambiente:** Isolamento de credenciais locais via variáveis de ambiente (`.env`), carregadas nativamente pelo comando `--env-file` do Node.js.

---

## Executando Localmente

Se você quiser clonar e rodar o projeto para testar:

1. Clone o repositório e instale os pacotes:
   ```bash
   git clone https://github.com
   npm install
   ```
2. Crie um banco vazio chamado `projeto_crm` no seu PostgreSQL.
3. Configure o arquivo `.env` na raiz do projeto com suas credenciais (use o `.env.example` como base).
4. Suba o servidor:
   ```bash
   npm run dev
   ```
   *Nota: O script de inicialização do banco cria a tabela e injeta as colunas necessárias de forma automática no primeiro boot.*

---

## Endpoints Disponíveis

* **GET `/produtos`** - Retorna a lista de produtos (apenas registros onde `deletado_em` é nulo).
* **POST `/produtos`** - Cadastra um novo produto (validação com regras de negócio).
* **PATCH `/produtos/:id`** - Atualização parcial (modifica apenas as propriedades enviadas no JSON).
* **DELETE `/produtos/:id`** - Executa o soft delete e altera o status interno do registro.

---
Se quiser trocar uma ideia sobre a estrutura do código ou debater alguma abordagem que usei, fique à vontade para abrir uma issue ou mandar uma mensagem! 💻
