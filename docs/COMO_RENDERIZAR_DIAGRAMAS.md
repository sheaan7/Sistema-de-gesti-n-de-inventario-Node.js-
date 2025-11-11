# Guía para Renderizar Diagramas PlantUML

Los diagramas del proyecto están en formato PlantUML (.puml). Aquí tienes varias opciones para visualizarlos:

## Opción 1: Visualizador Online (Más Fácil)

### PlantUML Online Server
1. Visita: https://www.plantuml.com/plantuml/uml/
2. Copia el contenido de cualquier archivo .puml
3. Pégalo en el editor
4. El diagrama se renderiza automáticamente
5. Puedes descargar como PNG, SVG o PDF

## Opción 2: Extensión de VS Code (Recomendado)

### Instalar PlantUML Extension
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "PlantUML" por jebbs
4. Instala la extensión
5. Instala Java (requerido): https://www.java.com/download/

### Usar la extensión
1. Abre cualquier archivo .puml
2. Presiona `Alt+D` para ver preview
3. Click derecho > "Export Current Diagram" para guardar como imagen

## Opción 3: Herramientas de Línea de Comandos

### Instalar PlantUML CLI

**Con NPM:**
```bash
npm install -g node-plantuml
```

**Con Java (Método Oficial):**
```bash
# Descargar PlantUML JAR
wget https://github.com/plantuml/plantuml/releases/download/v1.2023.13/plantuml-1.2023.13.jar

# O visitar: https://plantuml.com/download
```

### Generar imágenes

**Con node-plantuml:**
```bash
# Generar un diagrama
puml generate docs/uml/diagrama_clases.puml

# Generar todos los diagramas
puml generate docs/**/*.puml -o docs/images
```

**Con Java JAR:**
```bash
# Generar un diagrama
java -jar plantuml.jar docs/uml/diagrama_clases.puml

# Generar todos en una carpeta
java -jar plantuml.jar docs/uml/*.puml

# Especificar formato de salida
java -jar plantuml.jar -tpng docs/uml/diagrama_clases.puml
java -jar plantuml.jar -tsvg docs/uml/diagrama_clases.puml
java -jar plantuml.jar -tpdf docs/uml/diagrama_clases.puml
```

## Opción 4: Docker (Sin instalar Java)

```bash
# Generar diagrama con Docker
docker run --rm -v $(pwd):/data plantuml/plantuml docs/uml/diagrama_clases.puml

# Generar todos los diagramas
docker run --rm -v $(pwd):/data plantuml/plantuml docs/**/*.puml
```

## Opción 5: Plugins IDE

### IntelliJ IDEA / WebStorm
1. Instalar plugin "PlantUML Integration"
2. Abrir archivo .puml
3. Preview automático en panel lateral

### Eclipse
1. Instalar PlantUML Plugin desde Eclipse Marketplace
2. Abrir archivo .puml
3. Vista previa automática

## Formatos de Salida Disponibles

PlantUML puede generar varios formatos:

- **PNG** - Imagen raster (por defecto)
- **SVG** - Gráfico vectorial escalable
- **PDF** - Documento PDF
- **EPS** - PostScript
- **LaTeX** - Para documentos LaTeX

## Estructura de Diagramas en el Proyecto

```
docs/
├── diagramas/
│   └── arquitectura_sistema.puml     # Diagrama de arquitectura general
├── uml/
│   ├── diagrama_clases.puml          # UML: Diagrama de clases
│   ├── diagrama_secuencia_crear.puml # UML: Secuencia de creación
│   └── diagrama_secuencia_sync.puml  # UML: Secuencia de sincronización
└── bpmn/
    ├── bpmn_gestion_productos.puml   # BPMN: Gestión de productos
    ├── bpmn_sincronizacion.puml      # BPMN: Proceso de sincronización
    └── bpmn_despliegue.puml          # BPMN: Proceso de despliegue
```

## Script de Generación Automática

Crea un script `generate-diagrams.sh`:

```bash
#!/bin/bash

# Crear directorio de salida
mkdir -p docs/images

# Generar todos los diagramas
echo "Generando diagramas UML..."
java -jar plantuml.jar -tpng docs/uml/*.puml -o ../images

echo "Generando diagramas BPMN..."
java -jar plantuml.jar -tpng docs/bpmn/*.puml -o ../images

echo "Generando diagrama de arquitectura..."
java -jar plantuml.jar -tpng docs/diagramas/*.puml -o ../images

echo "✓ Todos los diagramas generados en docs/images/"
```

O con NPM (`generate-diagrams.js`):

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = 'docs/images';

// Crear directorio de salida
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const folders = ['uml', 'bpmn', 'diagramas'];

folders.forEach(folder => {
  const inputPath = `docs/${folder}`;
  
  exec(`puml generate ${inputPath}/*.puml -o ../${outputDir}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error en ${folder}:`, error);
      return;
    }
    console.log(`✓ Diagramas ${folder} generados`);
  });
});
```

Ejecutar:
```bash
node generate-diagrams.js
```

## Integrar en README

Una vez generadas las imágenes, puedes referenciarlas en el README:

```markdown
## Diagramas del Sistema

### Arquitectura
![Arquitectura del Sistema](docs/images/arquitectura_sistema.png)

### Diagrama de Clases
![Diagrama de Clases](docs/images/diagrama_clases.png)

### Diagramas de Secuencia
![Secuencia - Crear Producto](docs/images/diagrama_secuencia_crear.png)
![Secuencia - Sincronización](docs/images/diagrama_secuencia_sync.png)

### Diagramas BPMN
![BPMN - Gestión de Productos](docs/images/bpmn_gestion_productos.png)
![BPMN - Sincronización](docs/images/bpmn_sincronizacion.png)
![BPMN - Despliegue](docs/images/bpmn_despliegue.png)
```

## Troubleshooting

### Error: "Cannot find Java"
- Instala Java: https://www.java.com/download/
- Verifica: `java -version`

### Error: "Graphviz is needed"
Algunos diagramas complejos requieren Graphviz:
```bash
# Windows (con Chocolatey)
choco install graphviz

# Mac
brew install graphviz

# Ubuntu/Debian
sudo apt-get install graphviz

# Verificar
dot -version
```

### Los diagramas se ven mal
- Usa formato SVG en lugar de PNG para mejor calidad
- Aumenta el DPI: `java -jar plantuml.jar -Sdpi=300 diagram.puml`

### Caracteres especiales no se muestran
Añade al inicio del archivo .puml:
```
@startuml
!pragma layout smetana
!pragma encoding UTF-8
...
@enduml
```

## Recursos Adicionales

- **Documentación oficial:** https://plantuml.com/
- **Guía de sintaxis:** https://plantuml.com/guide
- **Galería de ejemplos:** https://real-world-plantuml.com/
- **PlantUML Cheat Sheet:** https://ogom.github.io/draw_uml/plantuml/

---

**Nota:** Para el proyecto académico, se recomienda incluir tanto los archivos .puml (código fuente) como las imágenes PNG/SVG generadas en el repositorio para facilitar la revisión.
