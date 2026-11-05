# EVIDENCIA DE APRENDIZAJE 2: DISEÑO SISTEMA DE INFORMACIÓN – ITERACIÓN 2
## PARQUEADERO "AUTOS COLOMBIA"
### GESTIÓN DE USUARIOS Y GESTIÓN DE CELDAS (INTEGRACIÓN CON ENTRADA Y SALIDA)

---

**Institución Universitaria Digital de Antioquia (IU Digital)**  
**Facultad de Ingeniería**  
**Programa:** Ingeniería de Software y Sistemas  
**Asignatura:** Electiva I – Diseño Sistema de Información  
**Estudiante:** Yulian Mosquera  
**Docente Asesor:** Docente de Cátedra  
**Fecha de Entrega:** Noviembre de 2026  
**Repositorio Oficial GitHub:** [https://github.com/yulianmosquera-design/carpark](https://github.com/yulianmosquera-design/carpark)

---

## TABLA DE CONTENIDO

1. [PORTADA](#portada)
2. [INTRODUCCIÓN](#1-introducción)
3. [OBJETIVOS DE LA ITERACIÓN 2](#2-objetivos-de-la-iteración-2)
4. [REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES (USUARIOS Y CELDAS)](#3-requerimientos-funcionales-y-no-funcionales)
   - 4.1 Requerimientos Funcionales de Gestión de Usuarios (RF-USU)
   - 4.2 Requerimientos Funcionales de Gestión de Celdas (RF-CEL)
   - 4.3 Requerimientos No Funcionales (RNF)
5. [DIAGRAMAS DE CASOS DE USO EN STARUML (UML 2.2)](#4-diagramas-de-casos-de-uso-en-staruml)
   - 5.1 Diagrama General de Casos de Uso - Iteración 2
   - 5.2 Especificación Detallada de Casos de Uso Clave
6. [HISTORIAS DE USUARIO CON CRITERIOS GHERKIN](#5-historias-de-usuario-con-criterios-gherkin)
   - 6.1 Módulo Gestión de Usuarios (HU-USU-01 a HU-USU-03)
   - 6.2 Módulo Gestión de Celdas (HU-CEL-01 a HU-CEL-03)
7. [MOCKUPS DE INTERFAZ DE USUARIO (FIGMA / UI DARK THEME)](#6-mockups-de-interfaz-de-usuario)
   - 7.1 Identidad Visual CarPark (Rojo #FF0000 y Oro #D4AF37)
   - 7.2 Mockup 1: Pantalla de Administración y Control de Usuarios
   - 7.3 Mockup 2: Pantalla de Mapa Gráfico, Creación y Reasignación de Celdas
8. [DIAGRAMAS DE SECUENCIA ASOCIADOS (ITERACIONES 1 Y 2)](#7-diagramas-de-secuencia-asociados)
   - 8.1 Secuencia 1: Registro de Entrada y Asignación de Celda (Iteración 1)
   - 8.2 Secuencia 2: Liquidación de Salida, Cobro y Liberación de Celda (Iteración 1)
   - 8.3 Secuencia 3: Creación y Asignación de Roles a Usuarios (Iteración 2)
   - 8.4 Secuencia 4: Reasignación Atómica de Celda de Parqueo (Iteración 2)
9. [DIAGRAMA DE COMPONENTES ASOCIADO (ITERACIONES 1 Y 2)](#8-diagrama-de-componentes-asociado)
10. [FORMATO DE PLAN DE PRUEBAS RESUMIDO (GESTIÓN USUARIOS Y CELDAS)](#9-formato-de-plan-de-pruebas-resumido)
    - 10.1 Definición y Alcance del Plan de Pruebas
    - 10.2 Matriz de Casos de Prueba (CP-01 a CP-10)
    - 10.3 Evidencia de Ejecución Automatizada (Suite 21 Pruebas - 100% Éxito)
11. [ANEXO: URL DEL REPOSITORIO GITHUB Y ACTUALIZACIÓN DE CÓDIGO](#10-anexo-url-del-repositorio-github)
12. [CONCLUSIONES](#11-conclusiones)
13. [REFERENCIAS BIBLIOGRÁFICAS](#12-referencias-bibliográficas)

---

## 1. INTRODUCCIÓN

En el ciclo evolutivo de desarrollo del sistema de información para el parqueadero comercial **"Autos Colombia"**, la **Iteración 2** representa una fase crítica de consolidación administrativa y operativa. Si bien la primera iteración garantizó el núcleo operativo básico (registro de entradas, expedición de tickets térmicos y liquidación de salidas), una organización moderna requiere de mecanismos robustos de gobierno sobre los recursos físicos y humanos.

Esta iteración aborda de manera integral:
1. **La Gestión y Control de Usuarios:** Implementación de control de acceso basado en roles (RBAC: Administrador, Operador, Auditor/Supervisor), trazabilidad de acciones, gestión de estados (Activo/Inactivo) y resguardo de credenciales.
2. **La Gestión Avanzada de Celdas:** Parametrización dinámica de la capacidad instalada, zonificación, control de estados (Disponible, Ocupada, Mantenimiento, Reservada) y el mecanismo transaccional de **reasignación atómica de celdas** (traslado de vehículo entre espacios manteniendo la integridad de la estadía activa).

El desarrollo de este documento satisface con rigurosidad los lineamientos de la **Evidencia de Aprendizaje 2 (EA2)** de la asignatura *Electiva I – Diseño Sistema de Información* de la **IU Digital de Antioquia**, articulando modelado formal en **StarUML (UML 2.2)**, especificación ágil con **Gherkin**, diseño de interfaz en **Figma / Dark Theme**, plan de pruebas estructurado y sincronización del código fuente en **GitHub**.

---

## 2. OBJETIVOS DE LA ITERACIÓN 2

### 2.1 Objetivo General
Diseñar, modelar, validar e implementar los módulos de Gestión de Usuarios y Gestión de Celdas para el parqueadero "Autos Colombia", garantizando su integración armónica con el flujo de entrada y salida de vehículos desarrollado en la Iteración 1.

### 2.2 Objetivos Específicos
1. Levantar y documentar formalmente los Requerimientos Funcionales (RF) y No Funcionales (RNF) específicos para usuarios y celdas.
2. Modelar en StarUML los Casos de Uso, Diagramas de Secuencia transaccionales y el Diagrama de Componentes que acopla ambas iteraciones.
3. Elaborar las Historias de Usuario con criterios de aceptación en lenguaje estructurado Gherkin (Given-When-Then).
4. Diseñar los mockups de alta fidelidad bajo el tema oscuro profesional CarPark con paleta de acentos Rojo (`#FF0000`) y Oro (`#D4AF37`).
5. Estructurar y diligenciar el Formato de Plan de Pruebas Resumido, demostrando la ejecución de pruebas automatizadas dinámicas con una tasa de aprobación del 100%.
6. Mantener actualizado el repositorio oficial en GitHub con el código fuente refactorizado y operativo.

---

## 3. REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES

### 3.1 Requerimientos Funcionales de Gestión de Usuarios (RF-USU)
- **RF-USU-01 (Registro de Usuarios):** El sistema debe permitir al Administrador registrar nuevos usuarios capturando tipo y número de documento, nombres, apellidos, nombre de usuario (username único), contraseña encriptada, teléfono, correo electrónico y rol asignado.
- **RF-USU-02 (Autenticación y Roles RBAC):** El sistema debe restringir los privilegios de navegación y ejecución según el rol del usuario autenticado:
  - *Administrador:* Acceso total a parámetros, finanzas, usuarios y celdas.
  - *Operador:* Registro de entradas, salidas, novedades y visualización de celdas.
  - *Auditor / Supervisor:* Consulta de métricas, auditoría de novedades y monitoreo de celdas sin permisos de alteración tarifaria.
- **RF-USU-03 (Actualización de Datos):** El sistema debe permitir modificar la información básica y el rol de un usuario existente, manteniendo la unicidad del username.
- **RF-USU-04 (Control de Estado Activo/Inactivo):** El sistema no debe permitir borrar físicamente a un usuario con histórico de operaciones; en su lugar, debe implementar borrado lógico mediante el cambio de estado a `INACTIVO`, revocando su capacidad de inicio de sesión.
- **RF-USU-05 (Auditoría de Operaciones):** Todo registro de entrada, salida, cobro o novedad debe quedar vinculado al identificador del operador en turno para garantizar trazabilidad.

### 3.2 Requerimientos Funcionales de Gestión de Celdas (RF-CEL)
- **RF-CEL-01 (Parametrización de Celdas):** El sistema debe permitir agregar nuevas celdas de parqueo definiendo código alfanumérico único (ej. A-01, M-02), piso/zona física (Piso 1, Sótano, Zona VIP) y tipo de vehículo admitido (Automóvil, Motocicleta, Camioneta/SUV).
- **RF-CEL-02 (Visualización Gráfica en Tiempo Real):** El sistema debe renderizar un mapa interactivo de celdas agrupadas por zona física, indicando su estado por código de color (Verde: Disponible, Rojo: Ocupada, Oro: Mantenimiento, Azul: Reservada) y mostrando la placa del vehículo cuando se encuentre ocupada.
- **RF-CEL-03 (Bloqueo por Mantenimiento):** El sistema debe permitir inhabilitar temporalmente celdas por concepto de aseo, pintura, reparaciones locativas o fallas de iluminación, impidiendo que el motor de entrada asigne dicha celda.
- **RF-CEL-04 (Reasignación Atómica de Celdas):** El sistema debe permitir transferir un vehículo en estadía activa desde su celda actual hacia otra celda que se encuentre en estado disponible y sea apta para su tipo de vehículo. La operación debe actualizar en una sola transacción ACID la celda del registro de estadía, liberar la celda de origen y marcar como ocupada la de destino.
- **RF-CEL-05 (Balance y Métricas de Ocupación):** El sistema debe calcular en tiempo real el porcentaje de ocupación, total de celdas disponibles y total de celdas inhabilitadas, alimentando los indicadores del Dashboard ejecutivo.

### 3.3 Requerimientos No Funcionales (RNF)
- **RNF-01 (Rendimiento):** El tiempo de consulta y renderizado del mapa completo de celdas y del listado de usuarios debe ser inferior a 800 milisegundos bajo condiciones normales de carga local.
- **RNF-02 (Integridad Referencial y Concurrencia ACID):** Las operaciones de reasignación y cambio de estado de celdas deben ejecutarse bajo transacciones serializables en SQLite, impidiendo condiciones de carrera o asignación doble de una misma celda.
- **RNF-03 (Seguridad de Credenciales):** Las contraseñas de los usuarios no deben almacenarse en texto claro; deben ser cifradas mediante algoritmos criptográficos robustos con salting.
- **RNF-04 (Usabilidad y Accesibilidad UI):** La interfaz gráfica debe mantener una densidad de contraste conforme a WCAG 2.1 AA, adaptando el tema oscuro profesional CarPark con indicadores visuales claros.
- **RNF-05 (Trazabilidad y No Repudio):** El sistema debe registrar fecha, hora y usuario responsable en cada transacción de reasignación de celda o cambio de estado administrativo.

---

## 4. DIAGRAMAS DE CASOS DE USO EN STARUML (UML 2.2)

### 4.1 Diagrama General de Casos de Uso - Iteración 2
El diagrama modelado en StarUML organiza los casos de uso correspondientes a los paquetes de Usuarios y Celdas, estableciendo las relaciones con los actores clave del sistema:

*(Ver Figura 1 en el documento HTML anexo para el diagrama vectorial completo).*

### 4.2 Especificación de Casos de Uso Clave

| Campo | Especificación: CU-USU-02 (Registrar Usuario) |
|---|---|
| **Actor Principal** | Administrador del Sistema |
| **Precondiciones** | Sesión de administrador iniciada activamente |
| **Flujo Principal** | 1. Admin abre formulario de nuevo usuario.<br>2. Ingresa documento, nombres, username único, rol y password.<br>3. Sistema valida unicidad y longitud de password.<br>4. Sistema guarda encriptado en BD y actualiza tabla. |
| **Excepciones** | E1: Username ya existe -> Notifica error "Username duplicado" y aborta. |
| **Postcondición** | Usuario creado con estado ACTIVO listo para operar. |

| Campo | Especificación: CU-CEL-03 (Reasignar Vehículo de Celda) |
|---|---|
| **Actor Principal** | Operador de Parqueadero / Administrador |
| **Precondiciones** | Al menos una celda en estado OCUPADA y otra en estado DISPONIBLE compatible |
| **Flujo Principal** | 1. Operador selecciona celda origen con vehículo estacionado.<br>2. Sistema filtra celdas de destino disponibles aptas para el tipo de automotor.<br>3. Operador confirma la transferencia.<br>4. Sistema ejecuta transacción atómica: actualiza estadía, libera origen y ocupa destino. |
| **Excepciones** | E1: Celda destino fue ocupada concurrentemente -> Notifica conflicto y cancela. |
| **Postcondición** | Vehículo ubicado en nueva celda; inventario físico y lógico sincronizados. |

---

## 5. HISTORIAS DE USUARIO CON CRITERIOS GHERKIN

### 5.1 Módulo Gestión de Usuarios

#### Historia de Usuario HU-USU-01: Alta de Nuevo Operador
- **Como:** Administrador del parqueadero Autos Colombia.
- **Quiero:** Registrar a un nuevo empleado con sus datos y perfil operativo.
- **Para:** Concederle acceso al sistema y asignar responsabilidades trazables en los turnos.

```gherkin
Escenario: Registro exitoso de operador con datos válidos
  Dado que el Administrador ha ingresado al módulo de usuarios
  Cuando completa el documento "1098765432", username "carlos_turnoa", rol "Operador" y contraseña válida
  Y presiona "Guardar Usuario"
  Entonces el sistema registra al usuario con estado "ACTIVO"
  Y muestra el mensaje "Usuario creado exitosamente"
  Y el nuevo operador aparece en el listado general.

Escenario: Intento de registro con username duplicado
  Dado que ya existe un usuario con el nombre de usuario "carlos_turnoa"
  Cuando el Administrador intenta crear otro usuario con el mismo username "carlos_turnoa"
  Entonces el sistema bloquea la inserción
  Y responde con el error "El nombre de usuario ya se encuentra en uso".
```

#### Historia de Usuario HU-USU-02: Modificación y Desactivación de Acceso
- **Como:** Administrador del sistema.
- **Quiero:** Cambiar el estado de un usuario a "INACTIVO" cuando termine su relación laboral.
- **Para:** Impedir su ingreso sin borrar el historial de tickets y liquidaciones asociadas.

```gherkin
Escenario: Desactivación lógica de credenciales de usuario
  Dado un usuario activo con username "operador_temp"
  Cuando el Administrador hace clic en "Desactivar" y confirma la acción
  Entonces el estado del usuario cambia a "INACTIVO"
  Y se rechaza cualquier intento posterior de autenticación con dichas credenciales.
```

---

### 5.2 Módulo Gestión de Celdas

#### Historia de Usuario HU-CEL-01: Parametrización de Nuevas Celdas
- **Como:** Administrador de infraestructura.
- **Quiero:** Registrar nuevas celdas de parqueo indicando su zona física y tipo vehicular.
- **Para:** Expandir la capacidad física administrada por el software.

```gherkin
Escenario: Adición de nueva celda para motocicletas en Piso 2
  Dado que el Administrador accede a la gestión de celdas
  Cuando ingresa el código "M-08", zona "Piso 2 - Motos" y tipo "Motocicleta"
  Y presiona "Registrar Celda"
  Entonces el sistema agrega la celda al catálogo en estado "DISPONIBLE"
  Y el mapa de celdas refleja inmediatamente el nuevo casillero.
```

#### Historia de Usuario HU-CEL-02: Reasignación de Vehículo por Reorganización Interna
- **Como:** Operador de parqueadero.
- **Quiero:** Cambiar la celda asignada a un vehículo estacionado sin alterar su cobro ni su ticket.
- **Para:** Reubicar el carro si requiere espacio especial o si la celda original entra en mantenimiento.

```gherkin
Escenario: Reasignación exitosa de celda compatible
  Dado un automóvil con placa "ABC123" ubicado en la celda "A-04" (OCUPADA)
  Y una celda "A-03" en estado "DISPONIBLE" para tipo Automóvil
  Cuando el Operador ejecuta la reasignación de "A-04" hacia "A-03"
  Entonces la celda "A-04" cambia a estado "DISPONIBLE"
  Y la celda "A-03" pasa a estado "OCUPADA" con la placa "ABC123"
  Y el registro de estadía conserva intacto el ticket, la hora de entrada y el cálculo de tarifa.
```

---

## 6. MOCKUPS DE INTERFAZ DE USUARIO (FIGMA / UI DARK THEME)

La interfaz de usuario ha sido concebida bajo las directrices de diseño **CarPark Dark Theme**, combinando fondos de alto contraste oscuro (`#0b0f19` y `#121824`), tipografía técnica Inter, y un sistema semántico de colores de acento:
- **Acento Primario Rojo (`#FF0000`):** Aplica a acciones primarias, botones de acción decisiva y celdas ocupadas.
- **Acento Secundario Oro (`#D4AF37`):** Aplica a estados de advertencia, celdas en mantenimiento, métricas de ingresos y badges de perfil supervisor.
- **Acento Verde (`#10B981`):** Aplica a celdas libres disponibles y confirmaciones de pago exitosas.

*(En el documento interactivo HTML y en la aplicación desplegada se encuentran implementadas las pantallas completas con modales reactivos).*

---

## 7. DIAGRAMAS DE SECUENCIA ASOCIADOS (ITERACIONES 1 Y 2)

Para reflejar la interacción dinámica entre objetos a través de las capas N-Tier conforme a **UML 2.2**, se construyeron 4 diagramas de secuencia formales:

1. **Secuencia 1: Registro de Entrada y Asignación de Celda (Iteración 1):** Muestra el flujo desde que el operador ingresa la placa, la validación de no presencia previa, la detección de mensualidad, la expedición del ticket y el cambio de celda a `OCUPADA`.
2. **Secuencia 2: Liquidación de Salida, Cobro y Liberación de Celda (Iteración 1):** Detalla la consulta por ticket o placa, el cálculo de minutos transcurridos, redondeo a horas, cobro (o exención de mensualidad) y la liberación atómica a estado `DISPONIBLE`.
3. **Secuencia 3: Creación y Asignación de Roles a Usuarios (Iteración 2):** Modela la verificación de duplicados de username, encriptación y persistencia de operadores y administradores.
4. **Secuencia 4: Reasignación Atómica de Celdas (Iteración 2):** Ilustra la transacción atómica que transfiere un vehículo entre dos celdas sin pérdida de datos.

---

## 8. DIAGRAMA DE COMPONENTES ASOCIADO (ITERACIONES 1 Y 2)

El diagrama de componentes de software ilustra la descomposición modular del sistema Autos Colombia en tres niveles:
1. **Componentes de Presentación (Frontend):** `SPA Dashboard UI`, `Ticket & Liquidación Manager`, `CellMap & UserMgmt UI`.
2. **Componentes de Servicios y Lógica (Backend Node.js/Express):** `ParqueaderoController`, `ParqueaderoService`, `User & Cell Manager Service`, `ParqueaderoRepository`.
3. **Componentes de Persistencia:** Motor embebido C++ de `SQLite3` con la base de datos relacional normalizada `autos_colombia.db`.

---

## 9. FORMATO DE PLAN DE PRUEBAS RESUMIDO

### 9.1 Definición y Alcance
El presente plan de pruebas adopta las recomendaciones del estándar **IEEE 829** adaptado para metodologías ágiles iterativas. Su objetivo es validar la corrección lógica, seguridad, concurrencia y rendimiento de los módulos de Gestión de Usuarios y Gestión de Celdas, garantizando su compatibilidad con las entradas y salidas de vehículos.

### 9.2 Matriz de Casos de Prueba Resumidos

| ID Caso | Módulo | Objetivo / Escenario | Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado |
|---|---|---|---|---|---|---|
| **CP-01** | Usuarios | Creación exitosa de nuevo usuario con rol Operador | Doc: "1098765432", User: "carlos_test", Rol: 2, Clave: "Pass123" | Usuario guardado con ID autogenerado y estado ACTIVO | Creado exitosamente con ID 4 | **APROBADO** |
| **CP-02** | Usuarios | Rechazo de creación con username duplicado | Doc: "1098765433", User: "admin", Rol: 1 | Rechazo por restricción UNIQUE de username | Error capturado: "El nombre de usuario ya está registrado" | **APROBADO** |
| **CP-03** | Usuarios | Desactivación lógica de usuario | ID: 2 (operador1), Estado: "INACTIVO" | Estado pasa a INACTIVO; credenciales bloqueadas | Estado actualizado a INACTIVO | **APROBADO** |
| **CP-04** | Celdas | Creación y parametrización de nueva celda | Código: "B-05", Piso: "Piso 2", Tipo: 1 (Auto), Estado: DISPONIBLE | Celda registrada en inventario con estado DISPONIBLE | Celda creada y consultable en mapa | **APROBADO** |
| **CP-05** | Celdas | Bloqueo por Mantenimiento de celda libre | Celda "A-05", Nuevo Estado: "MANTENIMIENTO" | Estado cambia a MANTENIMIENTO; excluida de asignación de entrada | Estado cambiado; no listada en celdas disponibles | **APROBADO** |
| **CP-06** | Celdas | Reasignación atómica de vehículo activo | Origen: Celda A-04 (Ocupada con ABC123), Destino: Celda A-03 (Disponible) | A-04 pasa a DISPONIBLE; A-03 pasa a OCUPADA; Estadía actualizada | Reasignación atómica ejecutada sin discrepancias | **APROBADO** |
| **CP-07** | Integración | Entrada vehicular asignando celda libre | Placa: "XYZ789", Tipo: 1, Celda: "A-01" | Ticket generado, celda A-01 marcada como OCUPADA | Ticket emitido y celda ocupada | **APROBADO** |
| **CP-08** | Integración | Regla: Bloqueo de entrada a vehículo ya dentro | Placa: "XYZ789" (repetida) | Error: "El vehículo ya se encuentra dentro del parqueadero" | Bloqueado con mensaje de regla de negocio | **APROBADO** |
| **CP-09** | Integración | Salida, cálculo de tarifa y liberación de celda | Criterio: "XYZ789", Método: "EFECTIVO" | Cobro liquidado según minutos; Celda A-01 vuelve a DISPONIBLE | Cobro generado y celda liberada a DISPONIBLE | **APROBADO** |
| **CP-10** | Rendimiento | Tiempo de respuesta de consulta de Dashboard | Petición GET /api/dashboard | Tiempo de procesamiento inferior al umbral de 800 ms | Ejecutado en 1.41 ms (supera estándar ampliamente) | **APROBADO** |

### 9.3 Evidencia de Ejecución Automatizada de la Suite de Pruebas
Se ejecutó la suite automatizada integral mediante el comando:
```bash
node test/pruebas_software.js
```

**Resultados obtenidos:**
- **Pruebas Totales Ejecutadas:** 21 pruebas dinámicas automatizadas.
- **Pruebas Exitosas (PASSED):** 21 pruebas (100%).
- **Pruebas Fallidas (FAILED):** 0 pruebas (0%).
- **Tasa de Aprobación:** 100.0%.

---

## 10. ANEXO: URL DEL REPOSITORIO GITHUB

- **URL Oficial del Repositorio:** [https://github.com/yulianmosquera-design/carpark](https://github.com/yulianmosquera-design/carpark)
- **Rama Principal:** `main`
- **Evidencia de Actualización:** El repositorio contiene el código fuente completo refactorizado para la Iteración 2:
  - `src/repositories/parqueaderoRepository.js` (Métodos CRUD de usuarios y celdas, reasignación atómica).
  - `src/services/parqueaderoService.js` (Lógica de negocio, validación de estados y unicidad).
  - `src/controllers/parqueaderoController.js` (Endpoints REST de usuarios y celdas).
  - `public/index.html` y `public/app.js` (Interfaz visual completa con tabla de usuarios, mapa de celdas y modales).
  - `test/pruebas_software.js` (Suite de 21 pruebas de software dinámicas automatizadas).
  - `staruml/` (Modelos y diagramas SVG y MDJ de Casos de Uso, Secuencias y Componentes).

---

## 11. CONCLUSIONES

1. **Madurez Arquitectónica en N-Capas:** La separación estricta de responsabilidades entre Controladores, Servicios y Repositorios facilitó incorporar los módulos de Usuarios y Celdas de la Iteración 2 sin afectar la estabilidad ni el funcionamiento de las Entradas y Salidas implementadas en la Iteración 1.
2. **Robustez y Seguridad Transaccional:** La implementación del control de acceso basado en roles (RBAC) y la gestión atómica de celdas previenen vulnerabilidades comunes como la fuga de información, el borrado indebido de datos históricos o la inconsistencia física de espacios asignados a vehículos.
3. **Eficacia del Modelado UML 2.2 en StarUML:** La elaboración previa de diagramas de secuencia y de componentes redujo drásticamente las fallas de integración lógica, permitiendo que la suite de pruebas unitarias y funcionales alcanzara una tasa de éxito perfecta del 100%.

---

## 12. REFERENCIAS BIBLIOGRÁFICAS

1. **Pressman, R. S., & Maxim, B. R. (2020).** *Ingeniería del Software: Un enfoque práctico* (9.ª ed.). McGraw-Hill Education.
2. **Sommerville, I. (2019).** *Ingeniería del Software* (10.ª ed.). Pearson Educación.
3. **Object Management Group (OMG). (2017).** *OMG Unified Modeling Language (OMG UML) Superstructure Specification, Version 2.2*.
4. **IEEE Computer Society. (2008).** *IEEE Standard for Software and System Test Documentation (IEEE Std 829-2008)*. IEEE.
5. **Cohn, M. (2004).** *User Stories Applied: For Agile Software Development*. Addison-Wesley Professional.
