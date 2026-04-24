# API REST de Detección de Fraude

Microservicio desarrollado con Node.js y Express para validar posibles casos de fraude en órdenes de venta.

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript
- JSON
- API REST
- Mock de datos

## Funcionalidades

- Exposición de endpoint REST para validación de fraude.
- Análisis de órdenes por usuario.
- Detección por cantidad de órdenes diarias.
- Detección por monto acumulado aprobado.
- Uso de datos simulados mediante archivo JSON.

## Endpoint principal

GET /api/v1/validate/:user_id

### Parámetros

- user_id: identificador del usuario.
- order_date: fecha a evaluar en formato YYYY-MM-DD.

### Ejemplo

GET /api/v1/validate/123?order_date=2024-11-12

### Respuesta esperada

{
  "is_fraud": true
}

## Reglas de negocio

El sistema considera una posible situación de fraude cuando:

- El usuario supera la cantidad máxima permitida de órdenes en un día.
- El monto acumulado de órdenes aprobadas supera el límite definido.

## Cómo ejecutar el proyecto

npm install

npm start

El servidor se ejecuta en:

http://localhost:3000
