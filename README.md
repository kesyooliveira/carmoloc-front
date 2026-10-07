# Carmoloc Front

Front-end em Angular para a Carmoloc API — sistema interno de gestão para locadora de máquinas e equipamentos de construção civil (clientes, catálogo de equipamentos com unidades rastreáveis, ordens de locação, usuários e controle de acesso por papel).

Construído com Angular moderno (standalone, Signals, novo control flow), sem frameworks de UI prontos — estilização própria sobre design tokens, como exercício deliberado de CSS.

## Stack

- **Angular 22** (standalone components, sem NgModules)
- **Signals** para estado reativo local e global
- **Reactive Forms** (incluindo `FormArray` para listas dinâmicas de itens)
- **RxJS** para composição de fluxos assíncronos (ex. coordenação de refresh de token)
- **SCSS** com design tokens via CSS Custom Properties — sem bibliotecas de UI
- **TypeScript** estrito

## Destaques de arquitetura

### Organização por feature, com `core`/`shared` separados do domínio

```
core/        → guards, interceptors, serviços e modelos transversais (existem uma única vez na app)
shared/      → componentes e serviços reutilizáveis entre features, sem conhecimento de regra de negócio
layout/      → casco estrutural da área autenticada (header, sidebar), responsivo via CSS adaptativo
features/    → um domínio por pasta (auth, clients, equipment, rental-orders, users),
               espelhando a divisão do back-end
```

### Autenticação completa, com refresh automático e transparente

- Interceptor HTTP funcional (`HttpInterceptorFn`) que injeta o token em toda requisição autenticada.
- Em caso de `401`, o interceptor **pausa a requisição original, dispara o refresh, e reenvia** automaticamente — sem o usuário perceber nem precisar logar de novo.
- **Coordenação de múltiplos 401 simultâneos**: se várias requisições expiram ao mesmo tempo, apenas a primeira dispara um refresh de verdade; as demais aguardam o resultado e reaproveitam o novo token, evitando corrida contra a rotação de refresh token do back-end.
- Guards funcionais (`CanActivateFn`) para rotas autenticadas e rotas restritas a administradores.

### `ApiService` genérico como base de reuso real (não forçado)

Diferente de abstrações de back-end — onde regra de negócio costuma divergir demais entre entidades para justificar uma classe base —, no front o padrão de chamada HTTP (`GET`/`POST`/`PUT`/`DELETE` contra uma URL) é genuinamente uniforme entre `Client`, `Equipment`, `RentalOrder` e `User`. Um `ApiService<TResponse, TRequest>` abstrato cobre o CRUD padrão; cada serviço específico estende e adiciona apenas o que tem de próprio (ex. `RentalOrderService.confirm()`, `EquipmentService.addUnits()`).

### Paginação como componente de apresentação reutilizável

Um componente `Pagination` "burro" (sem conhecimento de domínio), comunicando-se via `input()`/`output()` baseados em Signal — reutilizado em qualquer listagem paginada da aplicação sem duplicar template ou lógica de navegação entre páginas.

### Formulários complexos com Reactive Forms

O formulário de ordem de locação usa `FormArray` para uma lista de itens de tamanho variável (cada um com seu próprio equipamento, quantidade e período), permitindo adicionar/remover itens dinamicamente antes de submeter — espelhando a estrutura de agregado (`RentalOrder` + N `RentalOrderItem`) do back-end.

### Responsivo sem duplicar componentes por plataforma

Um único layout autenticado (`PrivateLayout`), adaptado via CSS Grid + media queries — sidebar fixa no desktop, menu retrátil no mobile — em vez de componentes de layout separados por dispositivo, evitando duplicação de lógica para uma UI que não exige fluxos de navegação genuinamente diferentes entre plataformas.

### Identidade visual própria

Fonte (Poppins) hospedada localmente via `@font-face`, paleta de cores da marca como CSS Custom Properties — permitindo evolução de tema (ex. modo escuro) sem recompilar.