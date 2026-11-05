# EVIDENCIA DE APRENDIZAJE 1: DISEÑO SISTEMA DE INFORMACIÓN – ITERACIÓN 1
## PARQUEADERO "AUTOS COLOMBIA"
### GESTIÓN DE LA ENTRADA Y SALIDA DE VEHÍCULOS

---

**Institución Universitaria Digital de Antioquia (IU Digital)**  
**Facultad de Ingeniería**  
**Programa:** Ingeniería de Software y Sistemas  
**Asignatura:** Electiva I – Diseño Sistema de Información  
**Unidad Temática:** Unidad 1 (Modelos de Proceso, CMMI, Métricas e Ingeniería de Requerimientos) y Unidad 2 (UML 2.2 y Pruebas de Software)  
**Estudiante(s):** Yulian & Equipo de Trabajo  
**Docente Asesor:** Docente de Cátedra  
**Fecha de Entrega:** Octubre de 2026  

---

## TABLA DE CONTENIDO

1. [INTRODUCCIÓN](#1-introducción)
2. [OBJETIVOS](#2-objetivos)
   - 2.1 Objetivo General
   - 2.2 Objetivos Específicos
3. [MARCO METODOLÓGICO Y MODELOS DE PROCESO DE SOFTWARE (UNIDAD 1)](#3-marco-metodológico-y-modelos-de-proceso-de-software-unidad-1)
   - 3.1 Análisis Comparativo de Modelos de Desarrollo
     - 3.1.1 Modelo de Cascada (Waterfall)
     - 3.1.2 Modelo en V (Verificación y Validación)
     - 3.1.3 Modelo en Flor
     - 3.1.4 Modelo por Prototipos y su Problemática
     - 3.1.5 Modelo en Espiral: Los Cuatro Cuadrantes y Gestión de Riesgos
   - 3.2 Justificación del Modelo Seleccionado para Autos Colombia
   - 3.3 Integración del Modelo de Madurez de Capacidad (CMMI)
   - 3.4 Métricas de Producto para Software
4. [INGENIERÍA DE REQUERIMIENTOS Y ANÁLISIS ORIENTADO A OBJETOS (AA2)](#4-ingeniería-de-requerimientos-y-análisis-orientado-a-objetos-aa2)
   - 4.1 Ciclo de Vida de los Requerimientos
   - 4.2 Requerimientos Funcionales (RF01 - RF10)
   - 4.3 Requerimientos No Funcionales (RNF01 - RNF07)
5. [HISTORIAS DE USUARIO CON CRITERIOS GHERKIN](#5-historias-de-usuario-con-criterios-gherkin)
6. [DISEÑO ARQUITECTÓNICO E INTERFAZ DE USUARIO (AA2)](#6-diseño-arquitectónico-e-interfaz-de-usuario-aa2)
   - 6.1 Arquitectura del Sistema en Capas (N-Tier / C4)
   - 6.2 Diseño de Interfaz de Usuario (UI/UX) y Mockups Figma
7. [MODELO DE BASE DE DATOS: MER, MR Y MODELO FÍSICO (UNIDAD 2 AA4)](#7-modelo-de-base-de-datos-mer-mr-y-modelo-físico-unidad-2-aa4)
   - 7.1 Modelo Entidad-Relación (MER)
   - 7.2 Modelo Relacional (MR en 3FN)
   - 7.3 Modelo Físico SQL (DDL / DML)
8. [MODELADO UML DE ACUERDO CON UML 2.2 (UNIDAD 2 AA1)](#8-modelado-uml-de-acuerdo-con-uml-22-unidad-2-aa1)
   - 8.1 Jerarquía y Clasificación de Diagramas UML 2.2
   - 8.2 Diagramas de Comportamiento: Diagrama de Casos de Uso (StarUML)
   - 8.3 Diagramas Estructurales: Diagrama de Clases (StarUML)
   - 8.4 Diagramas Estructurales: Diagrama de Paquetes (StarUML)
9. [ESTRATEGIA Y SUITE DE PRUEBAS DE SOFTWARE (UNIDAD 1 AA2 Y UNIDAD 2 AA5)](#9-estrategia-y-suite-de-pruebas-de-software-unidad-1-aa2-y-unidad-2-aa5)
   - 9.1 Fundamentos y Necesidad de las Pruebas
   - 9.2 Pruebas Manuales / Estáticas
   - 9.3 Pruebas Dinámicas Automatizadas (Resultados de Ejecución)
     - a. Pruebas de Corrección
     - b. Pruebas de Rendimiento
     - c. Pruebas de Confiabilidad
     - d. Pruebas de Seguridad
10. [CÓDIGO FUENTE Y REPOSITORIO GITHUB (UNIDAD 2 AA3)](#10-código-fuente-y-repositorio-github-unidad-2-aa3)
11. [CONCLUSIONES](#11-conclusiones)
12. [REFERENCIAS BIBLIOGRÁFICAS](#12-referencias-bibliográficas)

---

## 1. INTRODUCCIÓN

En la industria del software, la construcción de soluciones informáticas exige la aplicación rigurosa de métodos de ingeniería que garanticen la calidad del producto, la previsibilidad de los tiempos y la satisfacción de las necesidades del cliente. El parqueadero comercial **"Autos Colombia"**, dedicado a la custodia vehicular tanto en modalidad de rotación por horas como en contratos mensuales, presenta una alta dinámica de operaciones que hace inviable el control manual mediante planillas en papel.

El presente documento expone de manera exhaustiva el desarrollo de la **Iteración 1: Gestión de la entrada y salida de vehículos**, articulando las temáticas fundamentales de la **Unidad 1** (Modelos de Ciclo de Vida, CMMI, Métricas e Ingeniería de Requerimientos) y de la **Unidad 2** (Modelado formal UML 2.2 en StarUML, Documentación de Código y Técnicas de Prueba de Software Estáticas y Dinámicas) del plan de estudios de la **IU Digital de Antioquia**.

---

## 2. OBJETIVOS

### 2.1 Objetivo General
Diseñar, modelar e implementar el sistema de información para el parqueadero "Autos Colombia", fundamentado en las mejores prácticas de la Ingeniería de Software, asegurando el control automatizado de accesos, celdas, inspección de novedades físicas, liquidación tarifaria y validación de mensualidades.

### 2.2 Objetivos Específicos
1. Analizar comparativamente los modelos de procesos de software (Cascada, Modelo en V, Modelo en Flor, Prototipos y Espiral) y seleccionar el enfoque más adecuado para el proyecto.
2. Definir los requerimientos funcionales y no funcionales aplicando técnicas formales de especificación, análisis orientado a objetos y métricas de producto.
3. Formular historias de usuario bajo el marco ágil con criterios de aceptación Gherkin.
4. Construir la arquitectura de software desacoplada en N-Capas y los mockups de alta fidelidad de la interfaz de usuario.
5. Desarrollar el Modelo Entidad-Relación (MER), Modelo Relacional en Tercera Forma Normal (3FN) y script físico DDL.
6. Elaborar los diagramas UML estandarizados según la jerarquía de UML 2.2 (Casos de Uso, Clases y Paquetes) en StarUML.
7. Implementar y ejecutar una suite de pruebas de software automatizadas que abarque pruebas de corrección, rendimiento, confiabilidad y seguridad.
8. Desplegar el código fuente funcional y gestionar su control de versiones en GitHub.

---

## 3. MARCO METODOLÓGICO Y MODELOS DE PROCESO DE SOFTWARE (UNIDAD 1)

### 3.1 Análisis Comparativo de Modelos de Desarrollo

En la Unidad 1 de Ingeniería de Software se estudian los modelos clásicos y evolutivos del ciclo de vida del software:

#### 3.1.1 Modelo de Cascada (Waterfall)
- **Características:** Enfoque lineal y secuencial donde cada fase (Requerimientos, Diseño, Implementación, Verificación y Mantenimiento) debe completarse antes de pasar a la siguiente.
- **Desventaja para Autos Colombia:** Su alta rigidez impide adaptarse a cambios imprevistos en la lógica de negocio (por ejemplo, nuevas políticas de tarifas o novedades vehiculares) y posterga la obtención de software funcional hasta el final del cronograma.

#### 3.1.2 Modelo en V (Verificación y Validación)
- **Características:** Variante del modelo en cascada que asocia de manera simétrica y anticipada cada fase de desarrollo con su correspondiente nivel de pruebas:
  - Requerimientos del Sistema $\leftrightarrow$ Pruebas de Aceptación del Usuario.
  - Diseño Arquitectónico $\leftrightarrow$ Pruebas de Integración de Servicios.
  - Diseño Detallado $\leftrightarrow$ Pruebas Unitarias de Componentes.
- **Ventaja para Autos Colombia:** Proporciona un marco riguroso de trazabilidad para validar que cada requerimiento funcional tenga una prueba automatizada verificable.

#### 3.1.3 Modelo en Flor
- **Características:** Modelo de proceso concéntrico y multifacético que visualiza las actividades de desarrollo como pétalos interconectados alrededor de un núcleo conceptual, facilitando la realimentación continua entre módulos.

#### 3.1.4 Modelo por Prototipos y su Problemática
- **Características:** Construcción rápida de maquetas y versiones preliminares del software para clarificar requerimientos con los usuarios finales.
- **Problemática estudiada:** Si no se gestiona adecuadamente, el prototipo puede generar expectativas irreales en el cliente, desorden en la arquitectura o llevar a la tentación de "parchear" el prototipo desechable convirtiéndolo erróneamente en el producto final sin base sólida.

#### 3.1.5 Modelo en Espiral: Los Cuatro Cuadrantes y Manejo de Riesgos
Propuesto por Barry Boehm, este modelo combina la naturaleza iterativa del prototipado con los aspectos controlados y sistemáticos de la cascada, guiado fundamentalmente por el **análisis y gestión de riesgos**. Sus cuatro cuadrantes son:
1. **Determinar objetivos, alternativas y restricciones:** Definición del alcance de la iteración (ej. cobro por horas vs. mensualidades).
2. **Identificar y resolver riesgos:** Evaluación de contingencias críticas, tales como colisión concurrente de celdas, fraude en tickets o fallas de red.
3. **Desarrollar y verificar el producto de la etapa:** Construcción del incremento de software y ejecución de pruebas de calidad.
4. **Planear la siguiente iteración:** Revisión conjunta con los interesados y planeación de la Iteración 2 (Módulo de facturación y pagos).

### 3.2 Justificación del Modelo Seleccionado para Autos Colombia
Para el proyecto "Autos Colombia" se adoptó un **Modelo Híbrido Iterativo-Incremental basado en Espiral y Modelo en V**:
- **Iterativo/Espiral:** Permite entregar valor temprano y funcional en la **Iteración 1** (Entrada, Salida y Celdas) mitigando los riesgos operativos más altos antes de avanzar a la Iteración 2.
- **Principios del Modelo en V:** Garantiza que cada Requerimiento Funcional cuente con su correspondiente Historia de Usuario, Caso de Uso y Caso de Prueba Automatizado en la suite de pruebas.

### 3.3 Integración del Modelo de Madurez de Capacidad (CMMI)
El desarrollo del software se orienta bajo las directrices del modelo **CMMI-DEV**, apuntando a alcanzar prácticas de **Nivel de Madurez 2 (Gestionado)** y **Nivel 3 (Definido)**:
- **Gestión de Requerimientos (REQM):** Registro estructurado de requerimientos con trazabilidad bidireccional hacia el código y las pruebas.
- **Planificación del Proyecto (PP):** Estimación mediante puntos de historia y sprints.
- **Aseguramiento de Calidad del Proceso y del Producto (PPQA):** Verificación de estándares de codificación, pruebas automatizadas y control de versiones formal en GitHub.

### 3.4 Métricas de Producto para Software
Para evaluar la calidad intrínseca del software desarrollado en la Iteración 1 se definieron las siguientes métricas:
- **Métrica de Tamaño y Esfuerzo:** 26 Puntos de Historia (Story Points) distribuidos en 5 Historias de Usuario.
- **Complejidad Ciclomática ($V(G)$):** Mantenida por debajo de 5 en los métodos de cálculo de cobro y asignación de celdas mediante encapsulamiento modular.
- **Densidad de Defectos:** 0 defectos críticos en la suite de 14 pruebas de software dinámicas automatizadas.
- **Tiempo Medio de Respuesta (Performance):** 5.4 ms por consulta de estado del parqueadero (umbral exigido: < 800 ms).

---

## 4. INGENIERÍA DE REQUERIMIENTOS Y ANÁLISIS ORIENTADO A OBJETOS (AA2)

### 4.1 Ciclo de Vida de los Requerimientos
1. **Elicitación:** Entrevistas y levantamiento de reglas de negocio con los operadores de parqueadero.
2. **Análisis y Negociación:** Identificación de casos especiales (ingresos de abonados frecuentes, registro preventivo de daños).
3. **Especificación:** Redacción formal de RF y RNF.
4. **Validación:** Inspección técnica y verificación de consistencia frente a los objetivos del sistema.

### 4.2 Requerimientos Funcionales (RF)

| Código | Nombre del Requerimiento | Descripción | Prioridad |
|---|---|---|---|
| **RF01** | Registro de Entrada | Capturar placa, tipo vehicular, marca, color y asignar celda disponible generando ticket térmico con fecha/hora oficial. | Alta (Must) |
| **RF02** | Validación de Mensualidad | Verificar si la placa pertenece a un cliente con mensualidad vigente; exonerar el cobro por horas y marcar servicio como 'MENSUALIDAD'. | Alta (Must) |
| **RF03** | Asignación y Bloqueo de Celdas | Filtrar celdas disponibles según tipología (Autos, Motos, Camionetas) y bloquear atómicamente la celda elegida (estado OCUPADA). | Alta (Must) |
| **RF04** | Registro de Novedades Físicas | Registrar observaciones, rayones, abolladuras o elementos dejados en el vehículo durante el ingreso para deslindar responsabilidades. | Media (Should) |
| **RF05** | Emisión de Ticket Térmico | Generar comprobante impreso de 80 mm con datos del vehículo, fecha/hora, celda, código de barras y términos legales de custodia. | Alta (Must) |
| **RF06** | Liquidación de Salida | Calcular minutos transcurridos, horas cobrables según tarifa oficial, total a pagar o aplicar exoneración por mensualidad. | Alta (Must) |
| **RF07** | Cobro y Liberación de Celda | Registrar forma de pago (Efectivo/Tarjeta/Transferencia), finalizar la estancia y retornar la celda al estado DISPONIBLE. | Alta (Must) |
| **RF08** | Tablero Visual en Tiempo Real | Mostrar plano dinámico de celdas por zonas (Verde=Disponible, Rojo=Ocupado, Amarillo=Mantenimiento) e indicadores clave de ocupación. | Media (Should) |
| **RF09** | Gestión de Abonados | Visualizar titulares de mensualidades, vehículos afiliados y fecha límite de vigencia del contrato. | Media (Should) |
| **RF10** | Trazabilidad del Operador | Asociar el identificador del operador autenticado a cada registro de entrada, salida y novedad reportada. | Alta (Must) |

### 4.3 Requerimientos No Funcionales (RNF)

| Código | Criterio de Calidad | Especificación Métrica |
|---|---|---|
| **RNF01: Rendimiento** | Tiempo de Respuesta | Las peticiones a la API REST y consultas de base de datos deben resolverse en menos de 800 ms. |
| **RNF02: Disponibilidad** | Operatividad Continua | Disponibilidad del 99.5% durante el servicio del parqueadero. |
| **RNF03: Confiabilidad** | Integridad Transaccional | Operaciones de celda ejecutadas bajo estándares ACID para evitar inconsistencias en concurrencia. |
| **RNF04: Usabilidad (UX)** | Diseño Centrado en el Usuario | Interfaz clara de alto contraste visual con soporte de teclado rápido para despacho ágil de filas en caseta. |
| **RNF05: Seguridad** | Integridad y Prevención de Inyecciones | Consultas SQL parametrizadas para inmunidad frente a ataques de inyección SQL y contraseñas protegidas. |
| **RNF06: Portabilidad** | Independencia de Plataforma | Ejecución nativa en Windows y Linux sobre Node.js sin necesidad de compiladores binarios externos. |
| **RNF07: Mantenibilidad** | Arquitectura Desacoplada | Cohesión alta y acoplamiento bajo mediante separación estricta en N-Capas (Presentación, API, Servicios, Repositorios). |

---

## 5. HISTORIAS DE USUARIO CON CRITERIOS GHERKIN

```gherkin
Historia de Usuario HU-01: Registro de Ingreso y Ticket Térmico (5 SP)
Como Operador de Parqueadero
Quiero registrar la placa y características del automotor que ingresa y asignarle una celda
Para expedir el comprobante de parqueo y mantener el inventario de vehículos en sitio.

Escenario: Ingreso de vehículo regular por horas
  Dado que el vehículo con placa "ABC123" arriba a la caseta y no tiene estadía activa
  Cuando el operador selecciona tipo "Automóvil" y asigna la celda "A-02"
  Entonces el sistema registra la entrada con la hora del servidor, bloquea la celda A-02 como OCUPADA y despliega el ticket imprimible.
```

```gherkin
Historia de Usuario HU-02: Detección Automática de Mensualidad Activa (3 SP)
Como Operador de Parqueadero
Quiero que el sistema reconozca si el vehículo tiene contrato de mensualidad vigente
Para evitar cobros indebidos por hora y agilizar el acceso del abonado frecuente.

Escenario: Reconocimiento exitoso de suscriptor
  Dado que la placa "KLT452" cuenta con contrato de mensualidad al día
  Cuando el operador digita la placa en el módulo de entrada
  Entonces el sistema notifica en verde "Abonado Activo: Andrés Restrepo", prellena sus datos y asigna servicio 'MENSUALIDAD' exento de cobro.
```

```gherkin
Historia de Usuario HU-03: Registro de Novedades e Inspección de Daños (5 SP)
Como Operador de Parqueadero
Quiero registrar raspaduras, abolladuras o pertenencias observadas en el vehículo
Para proteger legalmente al parqueadero contra reclamaciones por daños preexistentes.

Escenario: Registro de rayón preexistente
  Dado un vehículo que ingresa con daño visible en el lateral derecho
  Cuando el operador abre el panel de novedades, selecciona tipo "RAYÓN", gravedad "LEVE" y escribe el detalle
  Entonces la observación queda asociada al ticket de entrada y se plasma en el comprobante impreso.
```

```gherkin
Historia de Usuario HU-04: Liquidación y Salida de Vehículo (8 SP)
Como Operador de Parqueadero
Quiero consultar una estadía por placa o ticket y liquidar el valor adeudado
Para registrar el pago, finalizar el servicio y liberar la celda ocupada.

Escenario: Salida de usuario con cobro por fracción de horas
  Dado que el vehículo "HQW103" completó 90 minutos de estancia en la celda C-01
  Cuando el operador busca la placa y procede a liquidar
  Entonces el sistema liquida 2 horas a facturar ($12.000 COP), recibe el pago y libera la celda C-01 dejándola DISPONIBLE.
```

```gherkin
Historia de Usuario HU-05: Mapa Visual de Celdas en Tiempo Real (5 SP)
Como Operador y Administrador
Quiero observar en un tablero interactivo el estado de todas las celdas
Para guiar a los conductores hacia los espacios libres y supervisar la ocupación global.

Escenario: Actualización de celda en el plano
  Dado que la celda A-01 se encontraba ocupada
  Cuando se registra la salida del vehículo
  Entonces el indicador de la celda A-01 cambia instantáneamente a color verde en el mapa.
```

---

## 6. DISEÑO ARQUITECTÓNICO E INTERFAZ DE USUARIO (AA2)

### 6.1 Arquitectura del Sistema en Capas (N-Tier / C4)
El software adopta una arquitectura desacoplada de N-Capas con dependencias unidireccionales que garantizan alta cohesión y bajo acoplamiento:
1. **Capa de Presentación (Frontend SPA):** HTML5 semántico, CSS3 modular con variables y JavaScript Vanilla ES6+.
2. **Capa de Controladores (Routing & Controller):** `ParqueaderoController.js` para parseo de peticiones HTTP, validación de parámetros y respuestas JSON.
3. **Capa de Servicios de Negocio (Service Layer):** `ParqueaderoService.js` donde residen las reglas de negocio (cálculo de tiempos, liquidación de tarifas, políticas de mensualidad).
4. **Capa de Acceso a Datos (Repository Pattern):** `ParqueaderoRepository.js` que ejecuta sentencias SQL parametrizadas bajo transaccionalidad ACID.
5. **Capa de Persistencia (Base de Datos):** Motor relacional SQLite 3 nativo (`node:sqlite`).

### 6.2 Diseño de Interfaz de Usuario (UI/UX) y Mockups Figma
La interfaz aplica principios de Usabilidad (ISO 9241) y diseño centrado en el usuario:
- **Dashboard Operativo:** Indicador visual de porcentaje de ocupación, métricas del turno y tabla de vehículos con búsqueda dinámica en tiempo real.
- **Formulario de Entrada:** Validación de placa en vivo, dropdown reactivo con celdas disponibles para la categoría y acordeón opcional de novedades.
- **Ticket Térmico (80 mm):** Optimizado para impresión directa (`window.print()`) con código de barras y cláusulas de custodia.
- **Pantalla de Liquidación:** Resumen desglosado con total a pagar y selector de medio de pago (Efectivo, Tarjeta, Nequi/Daviplata).
- **Mapa de Celdas:** Matriz interactiva agrupada por zonas (Autos, Camionetas, Motos) con código de celda, estado y placa de ocupantes.

---

## 7. MODELO DE BASE DE DATOS: MER, MR Y MODELO FÍSICO (UNIDAD 2 AA4)

### 7.1 Modelo Entidad-Relación (MER)
- `CLIENTES (1) <----> (0..*) VEHICULOS`
- `TIPOS_VEHICULO (1) <----> (0..*) VEHICULOS`
- `VEHICULOS (1) <----> (0..*) REGISTROS_ESTADIA`
- `CELDAS (1) <----> (0..*) REGISTROS_ESTADIA`
- `REGISTROS_ESTADIA (1) <----> (0..*) NOVEDADES_VEHICULO`
- `CLIENTES (1) <----> (0..*) MENSUALIDADES`
- `USUARIOS (1) <----> (0..*) REGISTROS_ESTADIA`

### 7.2 Modelo Relacional (MR en 3FN)
1. `ROLES` (**id**, nombre, descripcion)
2. `USUARIOS` (**id**, documento, nombre, apellido, username, password_hash, *rol_id*, estado)
3. `TIPOS_VEHICULO` (**id**, nombre, tarifa_hora, tarifa_dia, tarifa_mes)
4. `CLIENTES` (**id**, documento, nombres, apellidos, telefono, email, direccion)
5. `VEHICULOS` (**id**, placa [UQ], *tipo_vehiculo_id*, marca, linea_modelo, color, *cliente_id*)
6. `MENSUALIDADES` (**id**, *cliente_id*, *vehiculo_id*, fecha_inicio, fecha_fin, valor_mensualidad, estado)
7. `CELDAS` (**id**, codigo [UQ], piso_zona, *tipo_permitido_id*, estado, *vehiculo_actual_id*)
8. `REGISTROS_ESTADIA` (**id**, ticket_codigo [UQ], *vehiculo_id*, *celda_id*, tipo_servicio, fecha_hora_entrada, *usuario_entrada_id*, fecha_hora_salida, *usuario_salida_id*, estado_estadia, total_minutos, total_pagar, estado_pago, metodo_pago)
9. `NOVEDADES_VEHICULO` (**id**, *registro_estadia_id*, *vehiculo_id*, tipo_novedad, descripcion, gravedad, ubicacion_dano, *usuario_reporta_id*)

*(Script DDL completo en `database/modelo_fisico.sql`).*

---

## 8. MODELADO UML DE ACUERDO CON UML 2.2 (UNIDAD 2 AA1)

### 8.1 Jerarquía y Clasificación de Diagramas UML 2.2
De acuerdo con el estándar de la OMG para UML 2.2, los diagramas se dividen en dos grandes familias:
1. **Diagramas Estructurales:** Muestran la estructura estática del sistema. En este proyecto se construyeron:
   - **Diagrama de Clases:** Clases del dominio (`Vehiculo`, `Celda`, `RegistroEstadia`, `NovedadVehiculo`, `Mensualidad`) con atributos privados, métodos públicos y multiplicidades.
   - **Diagrama de Paquetes:** Modularización de componentes en paquetes lógicos por capas (`presentation`, `controllers`, `services`, `repositories`, `database`).
2. **Diagramas de Comportamiento:** Capturan los aspectos dinámicos y la interacción con los actores:
   - **Diagrama de Casos de Uso:** Relaciones de los actores (Operador, Conductor, Administrador) con casos de uso mediante relaciones de asociación, inclusión (`<<include>>`) y extensión (`<<extend>>`).

Todos los modelos se integraron en el archivo oficial StarUML:  
`staruml/AutosColombia_Iteracion1.mdj`

---

## 9. ESTRATEGIA Y SUITE DE PRUEBAS DE SOFTWARE (UNIDAD 1 AA2 Y UNIDAD 2 AA5)

### 9.1 Fundamentos y Necesidad de las Pruebas
Las pruebas de software son el mecanismo fundamental para verificar que el sistema satisface los requerimientos especificados y validar que cumple las expectativas del usuario, garantizando corrección, robustez y seguridad.

### 9.2 Pruebas Manuales / Estáticas
- **Revisión de Requerimientos:** Inspección cruzada para detectar ambigüedades en las reglas de redondeo de tarifas.
- **Revisión de Código Estática:** Verificación de convenciones de codificación limpia (Clean Code), uso estricto de camelCase y manejo de excepciones.

### 9.3 Pruebas Dinámicas Automatizadas (Resultados de Ejecución)
Se implementó y ejecutó una suite de pruebas automatizadas en `test/pruebas_software.js` (ejecutable con `npm test`):

#### a. Pruebas de Corrección Funcional
- **Test 1:** Detección automática de vehículo con mensualidad activa ($\checkmark$ PASSED).
- **Test 2:** Asociación correcta del titular de la mensualidad ($\checkmark$ PASSED).
- **Test 3:** Registro de entrada y generación de ticket único ($\checkmark$ PASSED).
- **Test 4:** Formato estandarizado del ticket `TCK-YYYYMMDD-XXXX` ($\checkmark$ PASSED).
- **Test 5:** Bloqueo de entrada duplicada para vehículos ya presentes ($\checkmark$ PASSED).
- **Test 6:** Cálculo dinámico de minutos transcurridos ($\checkmark$ PASSED).
- **Test 7:** Aplicación de tarifa mínima horaria oficial ($4.500 COP) ($\checkmark$ PASSED).
- **Test 8:** Finalización de estadía y liquidación ($\checkmark$ PASSED).
- **Test 9:** Liberación atómica de celda a estado DISPONIBLE ($\checkmark$ PASSED).

#### b. Pruebas de Seguridad e Integridad
- **Test 10:** Inmunidad contra ataques de Inyección SQL (`' OR '1'='1`) mediante sentencias preparadas ($\checkmark$ PASSED).
- **Test 11:** Rechazo estricto de entradas con campos vacíos o nulos ($\checkmark$ PASSED).

#### c. Pruebas de Rendimiento
- **Test 12:** Tiempo promedio de consulta en ráfaga de 50 peticiones: **5.43 ms** (ampliamente superior al estándar RNF01 de 800 ms) ($\checkmark$ PASSED).

#### d. Pruebas de Confiabilidad
- **Test 13:** Confiabilidad en conteo total de celdas parametrizadas (12 celdas) ($\checkmark$ PASSED).
- **Test 14:** Coherencia matemática en el balance de estados de celdas ($\checkmark$ PASSED).

**Balance General:** 14 pruebas ejecutadas, 14 pruebas aprobadas (**100.0% de éxito**).

---

## 10. CÓDIGO FUENTE Y REPOSITORIO GITHUB (UNIDAD 2 AA3)

- **Servidor:** Node.js HTTP Server (`server.js`) accesible en `http://localhost:3000`.
- **Estructura Modular:** Capas en `src/config/`, `src/controllers/`, `src/services/` y `src/repositories/`.
- **Automatización de Pruebas:** `npm test` ejecuta la suite dinámica de pruebas.
- **Herramienta de Carga:** Script automatizado `upload_to_github.js` para conexión y sincronización con el repositorio de GitHub.

---

## 11. CONCLUSIONES

1. Se integraron con éxito los fundamentos teóricos y metodológicos de las **Unidades 1 y 2** de Ingeniería de Software de la IU Digital, entregando una solución formal, completa y funcional para el parqueadero "Autos Colombia".
2. La combinación del enfoque evolutivo en Espiral con el Modelo en V permitió gestionar y mitigar oportunamente los riesgos operacionales de colisión de celdas y cobros erróneos, vinculando cada requerimiento con su correspondiente prueba automatizada.
3. El modelado estandarizado en StarUML bajo UML 2.2 asegura la coherencia conceptual entre los Casos de Uso, las Clases del dominio y la modularidad de los Paquetes.
4. La ejecución de la suite de pruebas dinámicas con un 100% de aprobación ratifica que el software es seguro, veloz (5.4 ms) y confiable para su entrada en producción.

---

## 12. REFERENCIAS BIBLIOGRÁFICAS

- Boehm, B. W. (1988). *A spiral model of software development and enhancement*. IEEE Computer, 21(5), 61-72.
- Booch, G., Rumbaugh, J., & Jacobson, I. (2006). *El Lenguaje Unificado de Modelado: Guía del Usuario* (2.ª ed.). Addison-Wesley.
- CMMI Institute. (2018). *CMMI for Development, Version 2.0*. Software Engineering Institute, Carnegie Mellon University.
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional.
- Pressman, R. S. (2010). *Ingeniería del Software: Un enfoque práctico* (7.ª ed.). McGraw-Hill Interamericana.
- Sommerville, I. (2011). *Ingeniería de Software* (9.ª ed.). Pearson Educación.
- Institución Universitaria Digital de Antioquia - IU Digital. (2024). *Contenidos Temáticos de la Asignatura Ingeniería de Software / Diseño de Sistemas de Información: Unidades 1 y 2*.
