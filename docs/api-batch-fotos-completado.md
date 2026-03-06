# Endpoint: Carga Batch de Fotos - Estado "Completado"

## `POST /api/upload/foto/demoplots/batch-completado`

Permite cargar **exactamente 3 fotos** de forma atómica para marcar un DemoPlot como "Completado".  
Si alguna validación falla, no se guarda ninguna foto.

---

## Reglas de negocio

| #   | Validación                                                                  | Error si falla                                             |
| --- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | Deben enviarse exactamente **3 archivos**                                   | `400` - Se requieren exactamente 3 fotos                   |
| 2   | Todas las fotos deben pertenecer al **mismo DemoPlot**                      | `400` - Todas las fotos deben pertenecer al mismo DemoPlot |
| 3   | El estado se fuerza a `"Completado"` automáticamente                        | —                                                          |
| 4   | El DemoPlot debe **existir** en la BD                                       | `400` - IdDemoplot no existe                               |
| 5   | El DemoPlot **no debe tener ya 3 fotos** en estado "Completado"             | `400` - Ya tiene el máximo de 3 fotos                      |
| 6   | Cada foto debe incluir un **`fotoHash`** (obligatorio)                      | `400` - fotoHash obligatorio                               |
| 7   | Los 3 hashes deben ser **distintos entre sí**                               | `400` - Hashes duplicados en el lote                       |
| 8   | Ningún hash debe **existir previamente** en la BD                           | `400` - Ya existen fotos con los mismos hashes             |
| 9   | Si falla el guardado en BD, los archivos subidos se **eliminan** (rollback) | `500`                                                      |

---

## Request

**Content-Type:** `multipart/form-data`

### Archivos (obligatorio: exactamente 3)

| Campo  | Tipo        | Descripción                           |
| ------ | ----------- | ------------------------------------- |
| `file` | `File` (×3) | 3 archivos de imagen (png, jpg, jpeg) |

### Campos del body

| Campo            | Tipo     | Obligatorio | Descripción                                 |
| ---------------- | -------- | :---------: | ------------------------------------------- |
| `idDemoPlot`     | `number` |     ✅      | ID del DemoPlot al que pertenecen las fotos |
| `createdBy`      | `number` |     ❌      | ID del usuario que crea                     |
| `updatedBy`      | `number` |     ❌      | ID del usuario que actualiza                |
| `comentarios[0]` | `string` |     ✅      | Comentario para la foto 1                   |
| `comentarios[1]` | `string` |     ✅      | Comentario para la foto 2                   |
| `comentarios[2]` | `string` |     ✅      | Comentario para la foto 3                   |
| `fotoHashes[0]`  | `string` |     ✅      | Hash único de la foto 1                     |
| `fotoHashes[1]`  | `string` |     ✅      | Hash único de la foto 2                     |
| `fotoHashes[2]`  | `string` |     ✅      | Hash único de la foto 3                     |
| `latitudes[0]`   | `number` |     ❌      | Latitud GPS de la foto 1                    |
| `latitudes[1]`   | `number` |     ❌      | Latitud GPS de la foto 2                    |
| `latitudes[2]`   | `number` |     ❌      | Latitud GPS de la foto 3                    |
| `longitudes[0]`  | `number` |     ❌      | Longitud GPS de la foto 1                   |
| `longitudes[1]`  | `number` |     ❌      | Longitud GPS de la foto 2                   |
| `longitudes[2]`  | `number` |     ❌      | Longitud GPS de la foto 3                   |

> **Nota:** El campo `estado` no se envía; se asigna automáticamente como `"Completado"`.

---

## Responses

### ✅ `201 Created` — Éxito

```json
{
    "message": "3 fotos en estado \"Completado\" cargadas exitosamente para el DemoPlot 42",
    "fotos": [
        {
            "id": 101,
            "fileName": "a1b2c3d4-uuid.jpeg",
            "rutaFoto": "uploads/demoplots/a1b2c3d4-uuid.jpeg"
        },
        {
            "id": 102,
            "fileName": "e5f6g7h8-uuid.jpeg",
            "rutaFoto": "uploads/demoplots/e5f6g7h8-uuid.jpeg"
        },
        {
            "id": 103,
            "fileName": "i9j0k1l2-uuid.jpeg",
            "rutaFoto": "uploads/demoplots/i9j0k1l2-uuid.jpeg"
        }
    ]
}
```

### ❌ `400 Bad Request` — Errores de validación

```json
{
    "error": "Se requieren exactamente 3 fotos para el estado \"Completado\". Se recibieron 2 archivo(s)."
}
```

```json
{
    "error": "Las 3 fotos deben ser diferentes entre sí. Se detectaron hashes duplicados en el lote."
}
```

```json
{
    "error": "Ya existen fotos con los mismos hashes en la BD: hash=abc123 (id=55)"
}
```

```json
{
    "error": "El demoplot ya tiene el máximo de 3 fotos en estado \"Completado\". No se pueden agregar más fotos con este estado."
}
```

---

## Ejemplo en Flutter (Dart)

```dart
import 'package:http/http.dart' as http;
import 'package:crypto/crypto.dart';
import 'dart:convert';
import 'dart:io';

Future<void> uploadFotosCompletado({
  required String baseUrl,
  required int idDemoPlot,
  required int userId,
  required List<File> fotos, // Exactamente 3
  required List<String> comentarios, // Exactamente 3
  List<double?>? latitudes,
  List<double?>? longitudes,
}) async {
  assert(fotos.length == 3, 'Se requieren exactamente 3 fotos');
  assert(comentarios.length == 3, 'Se requieren exactamente 3 comentarios');

  // 1. Generar hashes de las fotos
  final hashes = <String>[];
  for (final foto in fotos) {
    final bytes = await foto.readAsBytes();
    final hash = md5.convert(bytes).toString();
    hashes.add(hash);
  }

  // 2. Validar que no haya fotos iguales en el lote
  if (hashes.toSet().length != 3) {
    throw Exception('Las 3 fotos deben ser diferentes entre sí');
  }

  // 3. (Opcional) Verificar hashes contra el servidor antes de subir
  for (final hash in hashes) {
    final response = await http.get(
      Uri.parse('$baseUrl/api/fotodemoplots/verificar-hash/$hash'),
    );
    final data = jsonDecode(response.body);
    if (data['exists'] == true) {
      throw Exception('La foto con hash $hash ya fue cargada (id: ${data['foto']['id']})');
    }
  }

  // 4. Armar el request multipart
  final request = http.MultipartRequest(
    'POST',
    Uri.parse('$baseUrl/api/upload/foto/demoplots/batch-completado'),
  );

  // Archivos
  for (final foto in fotos) {
    request.files.add(
      await http.MultipartFile.fromPath('file', foto.path),
    );
  }

  // Campos compartidos
  request.fields['idDemoPlot'] = idDemoPlot.toString();
  request.fields['createdBy'] = userId.toString();
  request.fields['updatedBy'] = userId.toString();

  // Campos por foto (arrays)
  for (int i = 0; i < 3; i++) {
    request.fields['comentarios[$i]'] = comentarios[i];
    request.fields['fotoHashes[$i]'] = hashes[i];
    if (latitudes != null && latitudes[i] != null) {
      request.fields['latitudes[$i]'] = latitudes[i].toString();
    }
    if (longitudes != null && longitudes[i] != null) {
      request.fields['longitudes[$i]'] = longitudes[i].toString();
    }
  }

  // 5. Enviar
  final streamedResponse = await request.send();
  final response = await http.Response.fromStream(streamedResponse);

  if (response.statusCode == 201) {
    final data = jsonDecode(response.body);
    print('✅ ${data['message']}');
    for (final foto in data['fotos']) {
      print('  - ID: ${foto['id']}, Archivo: ${foto['fileName']}');
    }
  } else {
    final data = jsonDecode(response.body);
    throw Exception('Error: ${data['error']}');
  }
}
```

---

## Flujo recomendado en la app Flutter

```
┌─────────────────────────────────┐
│  Usuario selecciona 3 fotos     │
│  (cámara o galería)             │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Validar en cliente:            │
│  - ¿Son exactamente 3?         │
│  - Generar hash de cada una     │
│  - ¿Hashes distintos entre sí?  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  (Opcional) Verificar hashes    │
│  GET /verificar-hash/:hash      │
│  para cada foto                 │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  POST /batch-completado         │
│  Enviar 3 archivos + datos      │
└──────────────┬──────────────────┘
               │
          ┌────┴────┐
          │         │
        201       400/500
          │         │
          ▼         ▼
      ✅ Éxito   ❌ Mostrar
      Navegar     mensaje de
      atrás       error
```

---

## Notas importantes

- **Extensiones válidas:** `png`, `jpg`, `jpeg`
- **Transaccional:** Si falla el guardado en BD, los archivos ya subidos al disco se eliminan automáticamente (rollback).
- **Hash obligatorio:** A diferencia del endpoint individual, aquí el `fotoHash` es **obligatorio** para cada foto.
- **Estado fijo:** El endpoint siempre asigna `"Completado"` — no se puede usar para otros estados.
- **El endpoint individual** (`POST /api/upload/foto/:type`) sigue disponible para cargar fotos individuales en estado `"Iniciado"` u otros estados.
