# Pessoas Desaparecidas MT - Frontend

## Desafios Encontrados e Decisões de Projeto

- Swagger https://abitus-api.geia.vip/swagger-ui/index.html

### API de Pessoas Desaparecidas - Endpoint de Paginação

Durante o desenvolvimento, foi identificado que o endpoint `GET /v1/pessoas/aberto/filtro` apresenta um comportamento inesperado:

1.  **Diagnóstico:** Independentemente do valor enviado no parâmetro de query `pagina` (ex: `pagina=1`, `pagina=2`, etc.), a API sempre retorna a primeira página de resultados (correspondente a `pagina=0`).
2.  **Decisão de Implementação:** A estratégia adotada foi manter a implementação do frontend correta, utilizando `react-query` para gerenciar o estado da página e passando os parâmetros `pagina` e `porPagina` conforme a documentação e as melhores práticas para consumo de APIs paginadas.
3.  **Contorno (Workaround):** Para garantir uma experiência de usuário funcional e não confusa, os botões de navegação da paginação foram desabilitados na interface, e um aviso foi adicionado. O filtro por nome, no entanto, permanece funcional.

Essa abordagem foi escolhida para demonstrar a capacidade de consumir o endpoint da maneira correta e profissional, ao mesmo tempo em que se lida de forma transparente com as limitações de um serviço externo.
