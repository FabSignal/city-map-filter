# 🌆 City Map Filter 

Código JavaScript reutilizable que permite filtrar servicios en un mapa según ciudad y categoría, cargando todos los datos desde un archivo JSON externo.

## 📌 ¿Qué hace esta código?

- Carga datos de ciudades e instituciones desde un archivo `data.json`.
- Inicializa un mapa con Leaflet centrado en la ciudad seleccionada.
- Filtra dinámicamente los marcadores en función de la ciudad y el tipo seleccionado.

---

## 🧠 ¿Por qué es útil o necesario?

- **Reutilizable:** Se adapta fácilmente a nuevos datos sin modificar la lógica JS.
- **Separación de datos y lógica:** Todos los datos están en un JSON, lo que facilita mantenimiento, escalabilidad y separación de responsabilidades.
- **Accesible:** Funciona con un diseño minimalista y accesible desde cualquier navegador.
- **Tecnologías gratuitas y abiertas:** Utiliza herramientas como Leaflet, HTML, CSS y JavaScript puro, sin depender de servicios pagos o librerías propietarias, lo que facilita su implementación en proyectos públicos o de bajo presupuesto.

---

## 🛠️ ¿Cómo funciona? (paso a paso)

### 1. Espera a que el DOM esté completamente cargado

Se utiliza el método `.addEventListener()` sobre el objeto `document` (todo el HTML de la página) para detectar el evento `DOMContentLoaded`.

Es una buena práctica usar `DOMContentLoaded` porque asegura que el código dentro de su función (o "callback") se ejecute solo una vez que todo el contenido HTML de la página se ha cargado completamente, evitando así posibles errores al intentar interactuar con elementos que aún no existen en el DOM (representación en memoria de la página web).

---

### 2. Se declaran variables y constantes globales

Se declaran las variables:
- `map`: Almacena el objeto que permite interactuar con el mapa.
- `markers = []`: Array inicialmente vacío que almacenará todos los marcadores de Leaflet que se añadan al mapa.
- `appData = {}`: Objeto inicialmente vacío donde se guardarán los datos cargados del archivo `data.json`.

Se declaran las constantes:
- `citySelect` y `typeSelect`: Almacenan las referencias a los elementos HTML con los IDs "city-select" y "type-select", respectivamente, utilizando `document.getElementById()`.

---

### 3. Se define la función asíncrona `loadAndInitializeMap()`

`async` permite ejecutar operaciones que tardan tiempo (como cargar un archivo de la red) sin congelar la página. Usa `fetch()` para obtener datos (en este caso del archivo `data.json`). El operador `await` pausa la ejecución de la función hasta que termine la operación (que puede ser lenta), pero el resto de la web sigue funcionando. Una vez que la petición de red culmina con una respuesta, el valor resultante, que es un objeto `Response`, se asigna a la constante `response`.

Una vez que `loadAndInitializeMap()` ha cargado y procesado exitosamente el `data.json`, guarda los datos en la variable `appData`.
Luego, para definir la interfaz de usuario, se llama a las funciones:

- `populateCityDropdown()`:
  Lee la lista de ciudades de `appData` y, por cada ciudad, crea un nuevo elemento `<option>` (una opción para el menú). Luego, añade estas opciones al elemento `<select>` de las ciudades en el HTML. También se asegura de que la primera ciudad de la lista quede preseleccionada al inicio. Sin esta función, el usuario vería un menú de ciudades vacío, y no podría elegir una ubicación.

- `initializeMap()`:
  Crea y configura el mapa interactivo en la página usando la librería Leaflet. Toma las coordenadas de la primera ciudad seleccionada (o la predeterminada) del menú desplegable de ciudades. Con esas coordenadas, crea una nueva instancia del mapa de Leaflet, la centra en esa ubicación y establece un nivel de zoom inicial. También añade la capa base del mapa, que son las imágenes del mapa (tiles) de OpenStreetMap. Es la función que hace que el mapa aparezca en la pantalla y se vuelva interactivo. Sin ella, no habría mapa.

- `attachEventListeners()`:
  Configura los "listeners" que hacen que la aplicación responda a las acciones del usuario. "Escucha" los cambios en los menús desplegables de ciudad (`city-select`) y de tipo (`type-select`). Cada vez que el usuario selecciona una nueva opción en cualquiera de estos menús, `attachEventListeners` se asegura de que la función `updateMarkers()` se ejecute automáticamente. Esta función hace que la aplicación sea dinámica. Sin ella, no se actualizaría el mapa cuando el usuario cambie las opciones en los menús desplegables.

- `updateMarkers()`:
  Se encarga de mostrar los marcadores correctos en el mapa, basándose en la ciudad y el tipo de institución que estén seleccionados en los menús desplegables. Primero, elimina todos los marcadores que puedan estar actualmente en el mapa (para evitar duplicados o marcadores incorrectos de una selección anterior). Luego, revisa los datos de `appData.institutions` y filtra solo aquellas instituciones que pertenecen a la ciudad seleccionada y que coinciden con el tipo de institución elegido (si hay un filtro de tipo). Finalmente, por cada institución filtrada, crea un marcador en el mapa, le añade un "popup" con su nombre y lo agrega a una lista para poder eliminarlo después. También centra el mapa en la ciudad seleccionada. Es la función que pone los "puntos de interés" en el mapa y asegura que solo se vean los relevantes para los filtros actuales. Se llama al inicio para mostrar los marcadores iniciales y cada vez que el usuario cambia los filtros.

- `attachEventListeners()`:
  Configura los eventos de cambio ("listeners") que hacen que la aplicación responda a las acciones del usuario. "Escucha" los cambios en los menús desplegables de ciudad (`city-select`) y de tipo (`type-select`). Cada vez que el usuario selecciona una nueva opción en cualquiera de estos menús, `attachEventListeners` se asegura de que la función `updateMarkers()` se ejecute automáticamente. Esta función hace que la aplicación sea dinámica. Sin ella, el usuario podría cambiar los menús desplegables todo lo que quisiera, pero el mapa no se actualizaría.

- Se utiliza `catch (error)` para el manejo de errores. Si la carga de datos (`fetch` o `response.json()`) falla dentro del bloque `try`, `catch` intercepta ese error, y luego registra un mensaje descriptivo y los detalles técnicos del error en la consola del navegador, alertando sobre el problema sin detener la ejecución de la aplicación.

En síntesis, la función `loadAndInitializeMap()`, luego de cargar los datos, ejecuta 4 funciones en secuencia para: preparar los menús (`populateCityDropdown()`), dibujar el mapa base (`initializeMap()`), añadir los marcadores iniciales (`updateMarkers()`), y configurar la interactividad para futuros cambios del usuario (`attachEventListeners()`).

---

### 4. Detalle de `populateCityDropdown()`

Esta función dinámicamente construye y llena el menú desplegable de ciudades en la interfaz de usuario. Primero, limpia las opciones existentes (`citySelect.innerHTML = "";`). Luego, recorre cada ciudad en los datos de la aplicación (`Object.entries(appData.cities).forEach(...)`), creando un elemento `<option>` HTML para cada una (`const option = document.createElement("option");`), asignándole un valor interno (la clave de la ciudad) (`option.value = key;`) y un texto visible (el nombre de la ciudad) (`option.textContent = city.name;`). La primera opción se marca como seleccionada por defecto (`if (index === 0) option.selected = true;`). Finalmente, añade cada opción creada al menú desplegable (`citySelect.appendChild(option);`), haciendo que las ciudades sean seleccionables para el usuario.

---

### 5. Detalle de `initializeMap()`

Esta función se encarga de preparar el mapa de Leaflet. Primero, obtiene las coordenadas de la ciudad actualmente seleccionada del menú desplegable. Luego, si la clave de la ciudad no es válida o la ciudad no existe en los datos (`if (!selectedCityKey || !appData.cities[selectedCityKey])`), emite una advertencia y detiene su ejecución para prevenir errores. Asumiendo datos válidos, el código posterior utiliza estas coordenadas para crear la instancia del mapa y añadir su capa base visual.

---

### 6. Se inicia y se hace visible el mapa

`map = L.map("map").setView(coordinates, 13);`: Crea el mapa interactivo en el `div` con `id="map"`, y lo centra en las `coordinates` de la ciudad seleccionada con un `zoom` de `13`. La instancia de este mapa se guarda en la variable `map`.

`L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);`: Añade la capa visual de fondo al mapa. Solicita las imágenes (tiles) de OpenStreetMap a sus servidores y las muestra en la pantalla, asegurando también la atribución a los colaboradores de OSM.

---

### 7. Detalle de `updateMarkers()`

La función `updateMarkers()` es la encargada de filtrar y dibujar los marcadores en el mapa según las selecciones actuales del usuario. Primero, elimina todos los marcadores visibles anteriormente (`markers.forEach(marker => map.removeLayer(marker));`) y vacía su lista interna (`markers = [];`). Luego, obtiene los valores de los filtros (ciudad y tipo) (`const selectedCity = citySelect.value;` y `const selectedType = typeSelect.value;`) y centra el mapa en la ciudad seleccionada (`map.setView(cityCoords, 13);`). Finalmente, recorre todas las instituciones (`appData.institutions.forEach(inst => {...}`), y para cada una que cumpla los criterios de ciudad y tipo (`if (inst.city === selectedCity && (!selectedType || inst.type === selectedType))`), crea un marcador de Leaflet (`const marker = L.marker([inst.lat, inst.lng]).addTo(map);`), lo añade al mapa, le asocia un popup con su nombre (`marker.bindPopup(inst.name);`), y lo guarda en la lista de marcadores activos (`markers.push(marker);`).

---

### 8. Detalle de `attachEventListeners()`

Esta función es responsable de habilitar la **interactividad del mapa**. Adjunta un escuchador de eventos `change` a los menús desplegables de ciudad (`citySelect.addEventListener("change", updateMarkers);`) y tipo (`typeSelect.addEventListener("change", updateMarkers);`). Cuando el usuario modifica la selección en cualquiera de estos menús, se activa automáticamente la función `updateMarkers()`, lo que provoca que el mapa se actualice para reflejar los nuevos filtros.

---

### 9. Llamada inicial a la función `loadAndInitializeMap()`

Esta función pone en marcha toda la aplicación. Cuando se ejecuta, desencadena la carga de datos, la configuración inicial del mapa y los menús, y la activación de la interactividad, asegurando que la aplicación esté lista para el usuario.

---

## 🚀 Tecnologías utilizadas

- JavaScript (ES6+)
- Leaflet.js
- OpenStreetMap
- HTML5 + CSS3

---

## 🌐 Ver la aplicación en funcionamiento

Podés probar la funcionalidad del filtro en el mapa accediendo a la siguiente página:
🔗 <https://fabsignal.github.io/city-map-filter/>

---

## 🧩 Aplicación en el proyecto Salud a Mano

Aunque este repositorio corresponde a un proyecto general, la función desarrollada es especialmente útil para integrarse en **Salud a Mano - Portal de Salud Pública**. En ese proyecto, la posibilidad de filtrar hospitales y centros de salud por ciudad y por especialidad es clave para mejorar la experiencia del usuario. Implementar esta función permite que el mapa muestre únicamente las instituciones relevantes según la ubicación y necesidad del paciente, haciendo más rápida y efectiva la búsqueda de servicios médicos. Además, al mantener los datos en un archivo JSON externo, se facilita la actualización del listado sin tocar el código base, lo que es fundamental para escalar la solución a nivel nacional.

---

## 👩‍💻 Autoría

Proyecto desarrollado por Fabiana.
