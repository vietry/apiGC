# Guía: Campos a quitar en la App Flutter (Demoplots)

## ¿Por qué?

La API ahora **ignora** los campos de validación cuando se envían por **POST** (crear) y **PUT** (actualizar) desde Flutter. Estos campos solo los gestiona la app web mediante **PATCH**.

Aunque la API ya los descarta, es buena práctica limpiar el código de Flutter para no enviar datos innecesarios.

---

## Campos a eliminar del modelo/formulario de Flutter

### 🔴 Quitar completamente (12 campos)

| Campo                  | Tipo        | Descripción                     |
| ---------------------- | ----------- | ------------------------------- |
| `validacion`           | `bool?`     | Validación de gabinete por RTC  |
| `checkJefe`            | `bool?`     | Aprobación de gabinete por Jefe |
| `validatedAt`          | `DateTime?` | Fecha de validación gabinete    |
| `approvedAt`           | `DateTime?` | Fecha de aprobación gabinete    |
| `comentariosRtc`       | `String?`   | Comentarios del RTC gabinete    |
| `comentariosJefe`      | `String?`   | Comentarios del Jefe gabinete   |
| `validacionCampo`      | `bool?`     | Validación de campo por RTC     |
| `checkJefeCampo`       | `bool?`     | Aprobación de campo por Jefe    |
| `validatedCampoAt`     | `DateTime?` | Fecha de validación campo       |
| `approvedCampoAt`      | `DateTime?` | Fecha de aprobación campo       |
| `comentariosRtcCampo`  | `String?`   | Comentarios del RTC campo       |
| `comentariosJefeCampo` | `String?`   | Comentarios del Jefe campo      |

---

## Dónde buscar en el código Flutter

### 1. Modelo de Demoplot (ej: `demoplot_model.dart`)

Quitar estas propiedades de la clase:

```dart
// ❌ QUITAR estas propiedades
bool? validacion;
bool? checkJefe;
DateTime? validatedAt;
DateTime? approvedAt;
String? comentariosRtc;
String? comentariosJefe;
bool? validacionCampo;
bool? checkJefeCampo;
DateTime? validatedCampoAt;
DateTime? approvedCampoAt;
String? comentariosRtcCampo;
String? comentariosJefeCampo;
```

### 2. fromJson / fromMap

Quitar las líneas que parsean estos campos del JSON:

```dart
// ❌ QUITAR estas líneas del fromJson/fromMap
validacion: json['validacion'],
checkJefe: json['checkJefe'],
validatedAt: json['validatedAt'],
approvedAt: json['approvedAt'],
comentariosRtc: json['comentariosRtc'],
comentariosJefe: json['comentariosJefe'],
validacionCampo: json['validacionCampo'],
checkJefeCampo: json['checkJefeCampo'],
validatedCampoAt: json['validatedCampoAt'],
approvedCampoAt: json['approvedCampoAt'],
comentariosRtcCampo: json['comentariosRtcCampo'],
comentariosJefeCampo: json['comentariosJefeCampo'],
```

### 3. toJson / toMap (LO MÁS IMPORTANTE)

Quitar estas líneas del método que genera el JSON para enviar al API:

```dart
// ❌ QUITAR estas líneas del toJson/toMap
'validacion': validacion,
'checkJefe': checkJefe,
'validatedAt': validatedAt,
'approvedAt': approvedAt,
'comentariosRtc': comentariosRtc,
'comentariosJefe': comentariosJefe,
'validacionCampo': validacionCampo,
'checkJefeCampo': checkJefeCampo,
'validatedCampoAt': validatedCampoAt,
'approvedCampoAt': approvedCampoAt,
'comentariosRtcCampo': comentariosRtcCampo,
'comentariosJefeCampo': comentariosJefeCampo,
```

### 4. Constructor

Quitar los parámetros del constructor:

```dart
// ❌ QUITAR del constructor
this.validacion,
this.checkJefe,
this.validatedAt,
this.approvedAt,
this.comentariosRtc,
this.comentariosJefe,
this.validacionCampo,
this.checkJefeCampo,
this.validatedCampoAt,
this.approvedCampoAt,
this.comentariosRtcCampo,
this.comentariosJefeCampo,
```

### 5. Base de datos local (SQLite/Drift/Isar)

Si guardas demoplots offline, quitar estas columnas de la tabla local:

```
validacion, checkJefe, validatedAt, approvedAt,
comentariosRtc, comentariosJefe,
validacionCampo, checkJefeCampo, validatedCampoAt, approvedCampoAt,
comentariosRtcCampo, comentariosJefeCampo
```

### 6. UI / Vistas

Buscar si alguna pantalla de Flutter muestra estos campos y quitarlos (no deberían mostrarse en la app de campo).

---

## Búsqueda rápida

Busca estas palabras en tu proyecto Flutter para encontrar todas las referencias:

```
validacion
checkJefe
validatedAt
approvedAt
comentariosRtc
comentariosJefe
validacionCampo
checkJefeCampo
validatedCampoAt
approvedCampoAt
comentariosRtcCampo
comentariosJefeCampo
```

> **Tip:** En VS Code usa `Ctrl+Shift+F` para buscar en todo el proyecto.

---

## Resumen del flujo actual

```
┌─────────────┐     POST/PUT      ┌─────────────┐
│  App Flutter │ ──────────────►   │   API (Node) │
│  (Campo)    │  Sin campos de    │  Ignora los  │
│             │  validación       │  campos de   │
└─────────────┘                   │  validación  │
                                  └──────┬───────┘
                                         │
┌─────────────┐     PATCH          ┌─────┴────────┐
│  App Web     │ ──────────────►   │   API (Node)  │
│  (Oficina)  │  CON campos de    │  SÍ acepta    │
│             │  validación       │  validación   │
└─────────────┘                   └───────────────┘
```

---

## ⚠️ Nota importante

Aunque la API ya ignora estos campos desde Flutter (los descarta en el backend), es recomendable quitarlos del código Flutter para:

1. **Reducir tamaño** del JSON enviado en cada request
2. **Evitar confusión** futura en el código
3. **Mejorar rendimiento** de la base de datos local (menos columnas)
4. **Código más limpio** y mantenible
