# AUTO_API_K6 — Pruebas de Performance con K6

Proyecto de pruebas de performance para el CRUD de usuarios de la API pública **AutomationExercise**.

## Estructura

```
AUTO_API_K6/
├── data/
│   └── userData.js        # Generador de datos dinámicos de usuario
├── tests/
│   └── crudUsuarios.js    # Script principal: flujo CRUD completo
├── utils/
│   └── config.js          # BASE_URL y thresholds
└── README.md
```

## Requisitos

- [K6](https://k6.io/docs/getting-started/installation/) instalado en el sistema.

## Ejecución

```bash
k6 run tests/crudUsuarios.js
```

## Flujo del test

1. **POST** `/createAccount` — Crea un usuario con email único (timestamp).
2. **GET** `/getUserDetailByEmail` — Consulta el usuario recién creado.
3. **PUT** `/updateAccount` — Actualiza datos del usuario.
4. **DELETE** `/deleteAccount` — Elimina el usuario.

## Configuración de escenario

| Parámetro  | Valor |
|------------|-------|
| VUs        | 5     |
| Duración   | 30s   |
| Threshold  | p(95) < 1000ms |

