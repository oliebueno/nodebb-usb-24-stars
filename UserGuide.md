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

    ```
    curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    ```

Luego, actualiza los paquetes apt e instala Node.js:

    ```
    sudo apt-get update
    sudo apt-get install -y nodejs
    ```

Verifica la instalación de Node.js y npm. Debes tener instalada la versión LTS de Node.js y la versión 9 o más reciente de npm:

    ```
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

### Cómo Activar y Desactivar Plugins

Para activar o desactivar plugins en NodeBB, puedes utilizar los siguientes comandos en la línea de comandos:

#### Para activar un plugin específico:

    ```
    ./nodebb activate name-plugin
    ```

#### Para desactivar un plugin específico:

    ```sh
    ./nodebb reset -p name-plugin
    ```

## Pruebas Automáticas

