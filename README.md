# 🚗 Sistema de Información - Parqueadero "Autos Colombia"
## Evidencia de Aprendizaje 1: Diseño Sistema de Información – Iteración 1
### Gestión de la Entrada y Salida de Vehículos

Bienvenido al repositorio oficial del sistema de información para el parqueadero comercial **"Autos Colombia"**. Este proyecto corresponde a la **Iteración 1**, enfocado en la gestión operativa de entrada y salida de vehículos, control de celdas en tiempo real, registro de novedades e inspección física, y validación automática de contratos de mensualidad.

---

## 📋 Entregables de la Actividad (Rúbrica 100 Puntos)

| # | Entregable | Ubicación en el Repositorio | Estado |
|---|---|---|---|
| **1** | Requerimientos Funcionales y No Funcionales | [`docs/Documento_Entrega_EA1.md`](docs/Documento_Entrega_EA1.md) | ✅ Completo |
| **2** | Historias de Usuario con Criterios Gherkin | [`docs/Documento_Entrega_EA1.md`](docs/Documento_Entrega_EA1.md) | ✅ Completo |
| **3** | Arquitectura del Sistema (StarUML) | [`staruml/diagrama_arquitectura.svg`](staruml/diagrama_arquitectura.svg) | ✅ Completo |
| **4** | Mockups de las Historias de Usuario (Figma / UI) | [`public/index.html`](public/index.html) | ✅ Completo |
| **5** | MER, MR y Modelo Físico SQL | [`database/modelo_fisico.sql`](database/modelo_fisico.sql) | ✅ Completo |
| **6** | Diagrama de Casos de Uso (StarUML) | [`staruml/diagrama_casos_de_uso.svg`](staruml/diagrama_casos_de_uso.svg) | ✅ Completo |
| **7** | Diagrama de Clases (StarUML) | [`staruml/diagrama_clases.svg`](staruml/diagrama_clases.svg) | ✅ Completo |
| **8** | Diagrama de Paquetes (StarUML) | [`staruml/diagrama_paquetes.svg`](staruml/diagrama_paquetes.svg) | ✅ Completo |
| **9** | Código Fuente Operativo y Desplegable | [`server.js`](server.js), [`src/`](src/), [`public/`](public/) | ✅ Funcionando al 100% |

---

## 🛠️ Tecnologías Empleadas

- **Backend:** Node.js (Servidor HTTP modular y arquitectura por capas).
- **Base de Datos:** SQLite 3 nativa (`node:sqlite`) con transaccionalidad ACID y soporte relacional completo.
- **Frontend:** Single Page Application (SPA) con HTML5, CSS3 moderno y JavaScript Vanilla ES6+.
- **Modelado:** StarUML v5/v6 (archivo oficial `.mdj` incluido en `staruml/AutosColombia_Iteracion1.mdj`) y diagramas vectoriales SVG.

---

## 🚀 Instrucciones de Ejecución Local

Para poner en marcha el sistema en cualquier computador:

### 1. Prerrequisitos
- Tener instalado **Node.js** (versión 20+ o superior).

### 2. Iniciar el Servidor
Abra una consola o terminal en la carpeta del proyecto y ejecute:
```bash
node server.js
```

### 3. Abrir la Aplicación
Abra su navegador web favorito e ingrese a:
```text
http://localhost:3000
```

---

## 📂 Estructura del Proyecto

```text
YULIAN/
├── database/
│   ├── modelo_fisico.sql              # Script DDL/DML del Modelo Físico SQL
│   └── autos_colombia.db              # Base de datos SQLite creada
├── docs/
│   ├── Documento_Entrega_EA1.md       # Informe académico completo en Markdown
│   └── Documento_Entrega_EA1.html     # Versión imprimible para exportar a PDF (Ctrl + P)
├── public/                            # Capa de Presentación (Frontend)
│   ├── index.html                     # Tableros, formularios y modal de ticket
│   ├── styles.css                     # Estilos UI/UX profesionales
│   └── app.js                         # Lógica cliente y consumo de API REST
├── src/                               # Capas del Backend
│   ├── config/database.js             # Conexión a la base de datos
│   ├── controllers/parqueaderoController.js # Controlador REST
│   ├── services/parqueaderoService.js # Lógica de negocio (tarifas, cálculo)
│   └── repositories/parqueaderoRepository.js # Capa de persistencia SQL
├── staruml/
│   ├── AutosColombia_Iteracion1.mdj   # Archivo de modelo StarUML oficial
│   ├── diagrama_casos_de_uso.svg      # Diagrama de Casos de Uso
│   ├── diagrama_clases.svg            # Diagrama de Clases
│   ├── diagrama_paquetes.svg          # Diagrama de Paquetes
│   ├── diagrama_arquitectura.svg      # Diagrama de Arquitectura en Capas
│   └── diagrama_mer_mr.svg            # Modelo Relacional y Entidad-Relación
├── package.json                       # Configuración del paquete
├── server.js                          # Servidor principal
└── README.md                          # Este archivo
```

---

## 👥 Autores y Créditos
- **Autor:** Yulian Germayoni Mosquera Cetre
- **Materia:** Ingenieria de Software
- **Institución:** IUDIGITAL
- **Fecha:** 31 de octubre de 2026
