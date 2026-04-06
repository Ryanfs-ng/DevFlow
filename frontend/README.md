# Frontend DevFlow

O app Angular fica na pasta **`DevFlow`**.

**Opção A — na raiz do repositório `devflow`:**

```bash
npm run install:web
npm start
```

**Opção B — só o frontend:**

```bash
cd DevFlow
npm install
npm start
```

Por padrão o Angular usa `http://localhost:4200`. O backend deve estar em `http://localhost:8080` (veja `DevFlow/src/app/core/api.config.ts`).

## Login de desenvolvimento

Após o seed do `data.sql` (primeira carga do banco):

- **E-mail:** `admin@devflow.com`
- **Senha:** `admin123`

Se o usuário já existia antes da correção do hash, apague o registro em `users` ou atualize o campo `password` manualmente para poder usar essa senha.

## Mapeamento telas → API (`/api`)

| Rota Angular | Componente | Endpoints usados |
|--------------|------------|------------------|
| `/auth/login` | `LoginComponent` | `POST /auth/login` |
| `/dashboard` | `DashboardComponent` | `GET /boards`, `GET /tasks`, `GET /dashboard/metrics` |
| `/boards` | `BoardsComponent` | `GET/POST /boards`, `PUT/DELETE /boards/{id}` (menu ⋯ em cada card) |
| `/board/:id` | `BoardComponent` | `GET /boards`, `GET /boards/{id}/tasks`, `PUT/DELETE /boards/{id}` (menu ⋯ no topo), tarefas via `PUT/POST/DELETE /tasks` |
| `/tasks` | `TasksComponent` | `GET /tasks` |
| `/team` | `TeamComponent` | `GET /users`, `GET /tasks` (para contagens por membro) |

Todas as chamadas autenticadas passam pelo `BoardService` (exceto login no `AuthService`), com JWT no interceptor.

## Backend

Na pasta irmã `DevFlow-BackEnd`, com MySQL local configurado em `application.properties`:

```bash
./mvnw spring-boot:run
```

(Windows: `mvnw.cmd spring-boot:run`.)
