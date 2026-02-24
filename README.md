# ciwokBot

**Version**: 1.0.4

Bot de Telegram para gestión de tareas y comisiones de equipos de trabajo. Permite registrar tareas asignadas entre miembros de un grupo y enviar esa información a un sistema externo (WordPress/WooCommerce o API personalizada).

## 🚀 Características

- ✅ Registro de grupos de Telegram
- ✅ Asignación de tareas con menciones (@usuario)
- ✅ 13 tipos de servicios predefinidos
- ✅ Cálculo automático de comisiones
- ✅ Integración con MongoDB Atlas
- ✅ API REST para envío de datos a WordPress/External

## 📋 Requisitos

- Node.js 18+ 
- Yarn o npm
- MongoDB Atlas (o instancia local de MongoDB)
- Telegram Bot Token (de @BotFather)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/toyoenohio/ciwok_bot.git
cd ciwok_bot
```

### 2. Instalar dependencias

```bash
yarn install
# o
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y completar con tus datos:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
TOKEN=bot_token_de_telegram
BOTNAME=ciwokBot
DB_USER=usuario_mongodb
DB_PW=password_mongodb
DB_NAME=ciwok_bot
CLIENT_TOKEN=token_autorizacion_wordpress
```

### 4. Ejecutar

#### Modo desarrollo (con watch):
```bash
yarn dev
```

#### Modo producción:
```bash
yarn build
yarn start
```

## 🐳 Docker

### Usando Docker Compose (Recomendado)

```bash
docker-compose up -d
```

### Usando Docker directamente

```bash
# Construir imagen
docker build -t ciwok_bot .

# Ejecutar contenedor
docker run -d --name ciwok_bot --env-file .env ciwok_bot
```

## 📖 Comandos Disponibles

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/start` | Inicia el flujo de registro de tarea | `/start` |
| `/agregarGrupo <valor>` | Registra un grupo con su multiplicador | `/agregarGrupo 1.5` |
| `/tarea @user, desc, cant` | Registra tarea manualmente | `/tarea @juan, Post Diseñado, 2` |
| `/version` | Muestra versión del bot | `/version` |

## 🎯 Servicios Disponibles

El bot incluye 13 servicios predefinidos:

- Post Diseñado (1)
- Post Ilustrado (3)
- Edición simple (0.8)
- Edición con montaje (1)
- Edición con diseño (1)
- Carrusel diseño por pieza (0.5)
- Carrusel fotos editadas por pieza (0.25)
- Storie (0.5)
- Gif (1.5)
- Sesión de Fotos (8)
- Vídeo tipo A (2.5)
- Vídeo tipo B (3.5)
- Subtítulos (2)

## 📁 Estructura del Proyecto

```
ciwok_bot/
├── app.ts                      # Punto de entrada principal
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración TypeScript
├── Dockerfile                  # Contenedor Docker
├── docker-compose.yml          # Orquestación Docker
├── .env.example                # Variables de entorno (ejemplo)
├── .env                        # Variables de entorno (no commitear)
└── src/
    ├── cmds.ts                 # Registro de comandos
    ├── cmds/
    │   ├── start.ts            # Comando /start
    │   ├── addGroup.ts         # Comando /agregarGrupo
    │   ├── tarea.ts            # Comando /tarea
    │   └── services.ts         # Selección de servicios
    ├── controllers/
    │   ├── botController.ts    # Lógica principal
    │   ├── usersController.ts  # CRUD usuarios
    │   ├── groupsController.ts # CRUD grupos
    │   └── activeUsersController.ts # Usuarios en sesión
    └── models/
        ├── Users.ts            # Modelo de usuarios
        ├── Groups.ts           # Modelo de grupos
        └── ActiveUsers.ts      # Modelo de usuarios activos
```

## 🔧 Configuración

### Agregar nuevos servicios

Editar `src/controllers/botController.ts`:

```typescript
const listServices = [
    {
        "name": "Nuevo Servicio",
        "valor": 5
    },
    // ... más servicios
]
```

### Cambiar endpoint de API

Editar `src/controllers/botController.ts`, función `dataSend`:

```typescript
const response = await fetch('https://tu-api.com/endpoint', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.CLIENT_TOKEN 
    }
})
```

## 🧪 Desarrollo

### Compilar TypeScript

```bash
yarn build
```

### Modo watch (auto-reload)

```bash
yarn buildWatch
```

## 📝 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado por Gustavo Blanco para Ciwok.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📞 Soporte

Para issues o preguntas, abrir un issue en GitHub.
