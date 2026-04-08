# 📊 Análisis de Resultados - Pruebas de Performance con K6

## 1. Resumen General

La prueba de rendimiento fue ejecutada sobre la API pública de AutomationExercise utilizando K6, simulando hasta 10 usuarios virtuales (VUs) en un escenario con incremento progresivo de carga (ramp-up).

### Resultados clave:
- 100% de checks exitosos (891/891)
- 0% de errores HTTP (0/396)
- Cumplimiento de los 11 thresholds definidos
- 99 ciclos CRUD completos sin fallos
- 0 errores en counters custom por operación

**Conclusión:** La prueba es exitosa y el sistema responde de forma confiable bajo la carga evaluada.

---

## 2. Configuración del Escenario

- Máximo de usuarios virtuales: 10 VUs
- Duración total: 1m 12s (stages configurados en 70s + graceful stop)
- Tipo de ejecución: ramp-up progresivo (stages)

| Stage     | Duración | Target VUs |
|-----------|----------|------------|
| Ramp-up   | 10s      | 5          |
| Ramp-up   | 20s      | 10         |
| Sostenido | 30s      | 10         |
| Ramp-down | 10s      | 0          |

Este enfoque permite simular un comportamiento más realista de los usuarios, evitando picos abruptos de carga.

---

## 3. Análisis de Rendimiento

### Tiempos de respuesta (agregados)

| Métrica       | Valor     |
|---------------|-----------|
| Promedio (avg) | 370.34 ms |
| Mediana (med)  | 295.69 ms |
| Percentil 90   | 734.68 ms |
| Percentil 95   | 870.91 ms |
| Mínimo (min)   | 131.99 ms |
| Máximo (max)   | 1.62 s    |

### Desglose por operación CRUD

| Operación | avg      | med      | p(90)    | p(95)    | max      |
|-----------|----------|----------|----------|----------|----------|
| Create    | 358.15 ms | 298.24 ms | 657.92 ms | 848.78 ms | 1.07 s   |
| Get       | 317.75 ms | 238.75 ms | 589.15 ms | 806.93 ms | 956.71 ms |
| Update    | 422.11 ms | 322.93 ms | 779.03 ms | 928.63 ms | 1.62 s   |
| Delete    | 383.34 ms | 299.31 ms | 765.59 ms | 876.43 ms | 1.18 s   |

### Interpretación

- La operación **GET** es la más rápida (avg 317 ms), lo cual es esperado al no modificar datos.
- La operación **UPDATE** es la más lenta (avg 422 ms, p95 928 ms), posiblemente por la carga de procesamiento en el servidor.
- El percentil 95 global (870 ms) se mantiene por debajo del umbral de 1000 ms.
- Los picos máximos (hasta 1.62s en UPDATE) son aislados y no afectan la tendencia general.

---

## 4. Validación de Thresholds

### Thresholds globales

| Threshold                        | Umbral    | Resultado   | Estado |
|----------------------------------|-----------|-------------|--------|
| `http_req_duration` p(95)        | < 1000 ms | 870.91 ms   | ✅ Cumple |
| `http_req_failed`                | < 1%      | 0.00%       | ✅ Cumple |
| `checks`                         | > 95%     | 100.00%     | ✅ Cumple |

### Thresholds por operación

| Threshold                                     | Umbral    | Resultado   | Estado |
|------------------------------------------------|-----------|-------------|--------|
| `http_req_duration{operation:create}` p(95)    | < 1500 ms | 848.78 ms   | ✅ Cumple |
| `http_req_duration{operation:get}` p(95)       | < 1000 ms | 806.93 ms   | ✅ Cumple |
| `http_req_duration{operation:update}` p(95)    | < 1500 ms | 928.63 ms   | ✅ Cumple |
| `http_req_duration{operation:delete}` p(95)    | < 1500 ms | 876.43 ms   | ✅ Cumple |

### Counters custom de errores

| Counter              | Umbral | Resultado | Estado |
|----------------------|--------|-----------|--------|
| `crud_create_errors` | < 5    | 0         | ✅ Cumple |
| `crud_get_errors`    | < 5    | 0         | ✅ Cumple |
| `crud_update_errors` | < 5    | 0         | ✅ Cumple |
| `crud_delete_errors` | < 5    | 0         | ✅ Cumple |

Los 11 acuerdos de nivel de servicio (SLA) definidos fueron alcanzados satisfactoriamente.

---

## 5. Comportamiento del Sistema

### Volumen de ejecución

- Total de requests: 396
- Total de iteraciones: 99
- Requests por segundo: 5.48 req/s
- Duración promedio por iteración: 5.54s

Cada iteración ejecuta un flujo CRUD completo agrupado en 4 groups:
- **Create** — Creación de usuario (POST)
- **Read** — Consulta de usuario (GET)
- **Update** — Actualización de usuario (PUT)
- **Delete** — Eliminación de usuario (DELETE)

Esto significa que se ejecutaron 99 ciclos CRUD completos sin fallos.

### Throughput de red

| Métrica        | Valor       |
|----------------|-------------|
| Data received  | 270 kB (3.7 kB/s) |
| Data sent      | 116 kB (1.6 kB/s) |

---

## 6. Concurrencia

- Usuarios virtuales: de 1 a 10 VUs
- VUs máximos alcanzados: 10

El sistema soporta correctamente múltiples usuarios concurrentes sin degradación significativa en el rendimiento. La `iteration_duration` se mantiene estable (p95 = 6.39s) independientemente del número de VUs activos.

---

## 7. Manejo de Errores

- http_req_failed: 0.00% (0 de 396 requests)
- checks_failed: 0.00% (0 de 891 checks)
- crud_create_errors: 0
- crud_get_errors: 0
- crud_update_errors: 0
- crud_delete_errors: 0

No se presentaron:
- Errores de red
- Timeouts
- Fallos en validaciones
- Errores en ninguna operación CRUD individual

Esto indica una ejecución completamente estable.

---

## 8. Manejo de Datos

Se utilizó generación dinámica de datos (emails únicos por iteración con formato `user_{VU}_{ITER}_{timestamp}@test.com`), lo que permitió:

- Evitar colisiones entre usuarios
- Garantizar independencia entre iteraciones
- Asegurar consistencia en el flujo CRUD

---

## 9. Limitaciones

### API pública

- No está diseñada para pruebas de alta carga
- Puede presentar variabilidad externa (los tiempos pueden fluctuar entre ejecuciones)
- No representa un entorno productivo real

### Nivel de carga

- Se probó hasta 10 VUs
- No se evaluó el punto de falla del sistema
- No se validó la integridad del dato retornado en GET (que el email coincida con el enviado)

---

## 10. Recomendaciones

### Pruebas de estrés

Incrementar la carga progresivamente:
- 20 VUs
- 50 VUs
- 100 VUs

Objetivo: identificar el punto de quiebre del sistema.

### Pruebas de resistencia

Ejecutar pruebas durante periodos prolongados (10–15 minutos) para evaluar estabilidad en el tiempo.

### Métricas más estrictas

- Reducir el threshold global a p(95) < 900 ms
- Reducir thresholds por operación (GET < 800 ms, demás < 1000 ms)
- Mantener errores < 1%

### Validación de datos

- Agregar un check en GET que valide que el email retornado coincide con el email consultado.

### Monitoreo

Integrar herramientas como Grafana e InfluxDB para análisis en tiempo real.

---

## 11. Conclusión Final

La prueba de rendimiento demuestra que el sistema es capaz de soportar 10 usuarios concurrentes ejecutando operaciones CRUD completas sin errores, manteniendo tiempos de respuesta estables y dentro de los 11 umbrales definidos.

El sistema presenta:

- Alta estabilidad (0% errores en 396 requests)
- Buen rendimiento (p95 global = 870 ms)
- Correcto manejo de concurrencia (10 VUs sostenidos)
- Adecuada gestión de datos dinámicos (99 ciclos independientes)
- Desglose saludable por operación (GET más rápido, UPDATE más lento)

