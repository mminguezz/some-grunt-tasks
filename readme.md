# Automatizar tareas con GRUNT

## Requisitos

* Tener instalado nodejs y npm


## Instalación

* Instalar el “cliente” de Grunt de forma global _sudo npm install grunt-cli -g_
* Instalar los módulos de Node necesarios _sudo npm install_
* _sudo apt-get install fontforge ttfautohint_ para que funcione la tarea que genera fuentes de iconos
* Listo, ya puedes usar las tareas de Grunt creadas

## Como añadir tareas

No hay que hacer nada especial para añadir una tarea, para saber como visita la documentación de grunt.
Las tareas se han separado por archivos en _tasks_, puedes usar el archivo "taskdemo.js" para crear tu nueva tarea.
Crea un nuevo archivo con tu tarea.
Añade o excluye las tareas en el archivo _gruntfile.js_
