# Guía de Uso y Pruebas de Nuevas Características
Este archivo proporciona una guía detallada sobre cómo usar y probar las nuevas características implementadas en el proyecto.

## Nuevas Características
Se incorporó una nueva categoría en el sistema de Nodebb: **Questions and Answers (Preguntas y Respuestas)**. Esta sección ha sido diseñada para fomentar la interacción y el intercambio de conocimientos entre los usuarios de la comunidad de la USB, ofreciendo un espacio dedicado a plantear preguntas y recibir respuestas de manera efectiva.
A diferencia de otras categorías, la sección de Questions and Answers incluye funcionalidades innovadoras que mejoran la experiencia del usuario. Entre estas características se encuentran:

- **Filtros de preguntas por etiquetas de cursos:** Permite a los usuarios encontrar preguntas específicas relacionadas con temas de interés.
- **Buscador para preguntas:** Facilita la búsqueda directa de preguntas existentes.
- **Buscador dinámico:** Muestra coincidencias en tiempo real mientras se escribe el título de una pregunta, mejorando la accesibilidad a información relevante.
- **Opción de marcar respuestas como favoritas o oficiales:** Dependiendo del rol del usuario, se puede destacar información valiosa y facilitar su acceso posterior.


## Instalación de NodeBB en Ubuntu

### Software Requerido
Para instalar NodeBB, primero necesitas instalar Node.js. A continuación, se detallan los pasos para hacerlo.


### Instalando Node.js
Node.js está disponible desde el repositorio de distribuciones binarias de NodeSource para Ubuntu. Comienza agregando este repositorio al índice de apt:

    ```sh
    curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    ```

Luego, actualiza los paquetes apt e instala Node.js:

    ```sh
    sudo apt-get update
    sudo apt-get install -y nodejs
    ```

Verifica la instalación de Node.js y npm. Debes tener instalada la versión LTS de Node.js y la versión 9 o más reciente de npm:

    ```sh
    node -v     # idealmente v18.x o v20.x
    npm -v      # idealmente 10.0 o superior
    ```

## Configuración de Plugins en NodeBB
Después de completar la instalación de NodeBB, es importante configurar los plugins adecuados para asegurar el correcto funcionamiento del sistema. A continuación, se detallan los plugins que debes activar y desactivar:

### Plugins a Activar

- [nodebb-plugin-questions-and-answers]
- [nodebb-plugin-composer-question]

### Plugins a Desactivar

- [nodebb-plugin-composer-default]

### Activar y desactivar plugins
Ejecutar:

```sh
./nodebb activate questions-and-answers && ./nodebb activate composer-question && ./nodebb reset -p composer-default 
```

Luego de ejecutar lo anterior, si se ejecuta `./nodebb plugins` debería mostrar algo como:
```sh
Active plugins:
        * nodebb-plugin-2factor@7.5.3 (installed, disabled)
        * nodebb-plugin-composer-default@10.2.36 (installed, disabled)
        * nodebb-plugin-composer-question@10.2.36 (installed, enabled)
        * nodebb-plugin-dbsearch@6.2.5 (installed, disabled)
        * nodebb-plugin-emoji@5.1.15 (installed, enabled)
        * nodebb-plugin-emoji-android@4.0.0 (installed, enabled)
        * nodebb-plugin-markdown@12.2.6 (installed, enabled)
        * nodebb-plugin-mentions@4.4.3 (installed, enabled)
        * nodebb-plugin-ntfy@1.7.4 (installed, disabled)
        * nodebb-plugin-questions-and-answers@1.0.0 (installed, enabled)
        * nodebb-plugin-spam-be-gone@2.2.2 (installed, disabled)
        * nodebb-rewards-essentials@1.0.0 (installed, enabled)
        * nodebb-theme-harmony@1.2.63 (installed, enabled)
        * nodebb-theme-lavender@7.1.8 (installed, disabled)
        * nodebb-theme-peace@2.2.6 (installed, disabled)
        * nodebb-theme-persona@13.3.25 (installed, disabled)
        * nodebb-widget-essentials@7.0.18 (installed, enabled)
```
Donde debe estar lo siguiente:
```sh
Active plugins:
        * nodebb-plugin-composer-default@10.2.36 (installed, disabled)
        * nodebb-plugin-composer-question@10.2.36 (installed, enabled)
        * nodebb-plugin-questions-and-answers@1.0.0 (installed, enabled)
```

## Ejecución del código

Una vez que los plugins estén correctamente instalados y habilitados, se debe reconstruir NodeBB:

```sh
./nodebb build
```

Y luego correr NodeBB con:
```sh
./nodebb start
```

Finalmente, el sitio debería estar disponible con todas las características añadidas descritas en las historias de usuario.

## Pruebas Automáticas
En primer lugar, además de añadir en la configuración de NodeBB en el archivo `config.json` la información del servidor de pruebas, también se deben añadir los plugins para la ejecución de las mismas:
```json
    "test_plugins": [
      "nodebb-plugin-questions-and-answers",
      "nodebb-plugin-composer-questions"
    ],
```

El archivo `config.json` se verá algo como:
```json
{
    "url": "http://localhost:4567",
    "secret": "your-secret",
    "database": "redis",
    "redis": {
        "host": "127.0.0.1",
        "port": "6379",
        "password": "",
        "database": "0"
    },
    "test_database": {
      "host": "127.0.0.1",
      "port": "6379",
      "password": "",
      "database": "1"
    },
    "test_plugins": [
      "nodebb-plugin-questions-and-answers",
      "nodebb-plugin-composer-questions"
    ],
    "port": "4567"
}
```

### Pruebas añadidas

A continuación se detallan todas las pruebas automáticas añadidas:

#### Respuestas oficiales

Se añadieron pruebas en `tests/officialAnswers.js`. Estas pruebas contienen:
- Prueba para marcar una respuesta como oficial.
- Prueba para desmarcar una respuesta como oficial.
- Prueba para verificar el envío de notificaciones a todos los usuarios que están siguiendo un tópico.

Este conjunto de pruebas son suficientes para verificar el conjunto de características que rodean el marcado de respuestas como oficiales. Se encargan de añadir nuevas respuestas, de probar la nueva ruta añadida a la API y de verificar que en la base de datos la respuesta tiene el estatus oficial como es debido. Del mismo modo, para el envío de notificaciones luego del marcado de una respuesta como oficial, revisa que todos los usuarios que estaban siguiendo el tópico al que pertenece la respuesta han sido notificados correctamente al buscar en la base de datos las notificaciones pendientes de esos usuarios.

#### Preguntas con su etiqueta de curso

Se añadieron pruebas en `tests/questions.js`. Estas pruebas contienen:
- Creación exitosa de preguntas con título, contenido y etiqueta de curso.
- Validación de que el título no pueda estar vacío y debe tener al menos 3 caracteres.
- Validación de que el contenido no puede estar vacío y debe tener al menos 8 caracteres.
- Obtención correcta de la etiqueta de curso de una pregunta.

Las pruebas son suficientes porque cubren los casos de uso principales de la funcionalidad de pregunta con etiqueta de curso. Al utilizar los tópicos como preguntas, se aprovecha que NodeBB ya cuenta con pruebas para verificar cualquier operación relacionada con tópicos (`tests/topics.js`), lo que elimina la necesidad de añadir pruebas adicionales para funciones como editar y eliminar. Además, estas pruebas verifican que las preguntas se crean correctamente con los datos necesarios, aseguran que las validaciones de título y contenido funcionan como se espera, y confirman que las etiquetas de curso se manejan adecuadamente en las preguntas.

#### Registro de usuario (nuevos campos)

Se añadieron pruebas en `tests/user.js`. Estas pruebas contienen:
- Verificación del funcionamiento del error al introducir un studentID vacío.
- Verificación del funcionamiento del error al introducir un studentID invalido (que incumpla el formato establecido).

Se modificaron las siguientes pruebas en `tests/user.js`:
- Creación correcta de usuario: Se agregaron los campos "role" y "studentID".
 
Dichas pruebas son suficientes para probar las características agregadas debido a que permiten validar el correcto funcionamiento de los atributos agregados en conjunto con las limitaciones o validaciones requeridas. Además, permiten corroborar que la adición de dichos atributos no perjudican el funcionamiento general de la aplicación.
