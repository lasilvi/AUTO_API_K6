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

| Parámetro       | Valor                              |
|-----------------|------------------------------------|
| VUs máximos     | 10                                 |
| Duración total  | 70s (ramp-up progresivo)           |
| Stages          | 10s→5VU, 20s→10VU, 30s→10VU, 10s→0VU |

### Thresholds

| Métrica                              | Umbral       |
|--------------------------------------|--------------|
| `http_req_duration` p(95)            | < 1000 ms    |
| `http_req_failed`                    | < 1%         |
| `checks`                             | > 95%        |
| `http_req_duration{operation:create}` p(95) | < 1500 ms |
| `http_req_duration{operation:get}` p(95)    | < 1000 ms |
| `http_req_duration{operation:update}` p(95) | < 1500 ms |
| `http_req_duration{operation:delete}` p(95) | < 1500 ms |
| Custom error counters (per operation) | < 5 each    |

