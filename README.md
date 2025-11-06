# Weather-app
Web-App com base nos estudos relacionados ao curso ministrado pelo professor Matheus Battisti - Hora de Codar

-------------------------------------------------------------------------------------------------------------

- Com base no que foi apresentado, criei um webview para trabalhar no conceito android também para melhor apresentação do mesmo.

-------------------------------------------------------------------------------------------------------------

![Projeto](https://user-images.githubusercontent.com/65917790/190046981-97741194-ab0b-4008-abdf-71751c36cc5d.png)

## Como rodar localmente

### Opção 1: Usando http-server (Recomendado)
```bash
npx http-server -p 8080 -o
```
O site será aberto automaticamente no navegador em `http://localhost:8080`

### Opção 2: Usando serve
```bash
npx serve
```
Acesse `http://localhost:3000` (ou a porta indicada no terminal)

### Opção 3: Abrir diretamente
Abra o arquivo `index.html` diretamente no navegador (pode apresentar problemas com recursos externos)

**Nota:** É recomendado usar um servidor local (opções 1 ou 2) para garantir que todos os recursos sejam carregados corretamente.

## Configurar imagens de background dinâmicas

O app muda o background dinamicamente baseado na cidade pesquisada. Para ter imagens específicas de cada cidade:

### Opção 1: Usar API do Unsplash (Recomendado - Imagens específicas da cidade)

1. Acesse [https://unsplash.com/developers](https://unsplash.com/developers)
2. Crie uma conta gratuita (se não tiver)
3. Crie uma nova aplicação
4. Copie o **Access Key**
5. Cole a API key no arquivo `js/main.js` na variável `unsplashApiKey`

```javascript
const unsplashApiKey = "SUA_API_KEY_AQUI";
```

**Benefícios:** 
- Imagens específicas da cidade pesquisada
- Imagens de alta qualidade do Unsplash
- 50 requisições por hora no plano gratuito (suficiente para uso pessoal)

### Opção 2: Usar sem API key

Se não configurar a API key, o app usará Picsum Photos como fallback. As imagens serão consistentes (mesma cidade = mesma imagem), mas não serão específicas da cidade pesquisada.