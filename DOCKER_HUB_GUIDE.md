# 🐳 Guía de Docker Hub - ciwokBot

## 🎯 Objetivo

Crear y subir TU propia imagen Docker a Docker Hub para reemplazar la de `cue2g/ciwokbot`.

---

## 📋 **Requisitos**

1. ✅ Cuenta en Docker Hub (https://hub.docker.com)
2. ✅ Docker instalado en tu computadora (opcional, podés usar GitHub Actions)
3. ✅ Acceso al repo de GitHub

---

## 🚀 **OPCIÓN A: Build Local (Recomendado para primera vez)**

### **Paso 1: Iniciar sesión en Docker Hub**

```bash
docker login
```

Ingresá tu username (`toyoenohio`) y password de Docker Hub.

---

### **Paso 2: Clonar el repo (si no lo tenés local)**

```bash
git clone https://github.com/toyoenohio/ciwok_bot.git
cd ciwok_bot
```

---

### **Paso 3: Build de la imagen**

```bash
docker build -t toyoenohio/ciwokbot:latest .
```

**Explicación:**
- `-t toyoenohio/ciwokbot:latest` → Tag de la imagen
- `.` → Build desde el directorio actual

---

### **Paso 4: Testear la imagen localmente**

```bash
docker run --rm -it \
  -e TOKEN=tu_bot_token \
  -e DB_USER=tu_user \
  -e DB_PW=tu_password \
  -e DB_NAME=ciwok_bot \
  -e BOTNAME=ciwokBot \
  -e CLIENT_TOKEN=tu_token \
  toyoenohio/ciwokbot:latest
```

---

### **Paso 5: Subir a Docker Hub**

```bash
docker push toyoenohio/ciwokbot:latest
```

**Listo!** Tu imagen ahora está en: https://hub.docker.com/r/toyoenohio/ciwokbot

---

## 🚀 **OPCIÓN B: GitHub Actions (Automático)**

### **Paso 1: Crear GitHub Secret**

1. Andá a tu repo: https://github.com/toyoenohio/ciwok_bot
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **"New repository secret"**
4. Agregá estos secrets:

```
DOCKERHUB_USERNAME: toyoenohio
DOCKERHUB_TOKEN: tu_docker_hub_token
```

**¿Cómo obtener el Docker Hub Token?**
- https://hub.docker.com/settings/security
- Click en **"New Access Token"**
- Copiá el token y guardalo en GitHub Secrets

---

### **Paso 2: Crear Workflow de GitHub Actions**

Creá el archivo `.github/workflows/docker-build.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ master ]
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
      
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          toyoenohio/ciwokbot:latest
          toyoenohio/ciwokbot:${{ github.sha }}
        cache-from: type=registry,ref=toyoenohio/ciwokbot:buildcache
        cache-to: type=registry,ref=toyoenohio/ciwokbot:buildcache,mode=max
```

---

### **Paso 3: Commit y Push**

```bash
git add .github/workflows/docker-build.yml
git commit -m "ci: Agregar GitHub Actions para build automático de Docker"
git push origin master
```

**Ahora:** Cada vez que hagas push a `master`, se va a buildar y subir la imagen automáticamente. 🚀

---

## 🔄 **Actualizar DigitalOcean**

### **Si usás App Platform:**

1. https://cloud.digitalocean.com/apps
2. Seleccioná tu app
3. **Settings** → **Components**
4. En **"Docker Hub"**, cambiá:
   - De: `cue2g/ciwokbot:latest`
   - A: **`toyoenohio/ciwokbot:latest`**
5. **Save** → Redeploy automático

### **Si usás Droplet:**

```bash
ssh root@tu_droplet_ip

# Parar contenedor actual
docker-compose down

# Pull de la nueva imagen
docker pull toyoenohio/ciwokbot:latest

# Actualizar docker-compose.yml (ya lo hice en el repo)
# Asegurate que diga: image: toyoenohio/ciwokbot:latest

# Levantar
docker-compose up -d
```

---

## 📝 **Versionado de Imágenes**

Te recomiendo usar tags de versión:

```bash
# Versión específica
docker tag toyoenohio/ciwokbot:latest toyoenohio/ciwokbot:v1.0.5
docker push toyoenohio/ciwokbot:v1.0.5

# En DigitalOcean usás: toyoenohio/ciwokbot:v1.0.5
```

**Ventajas:**
- ✅ Podés hacer rollback si algo sale mal
- ✅ Sabés exactamente qué versión está corriendo
- ✅ Mejor para producción

---

## 🛠️ **Comandos Útiles**

```bash
# Ver imágenes locales
docker images

# Ver logs del contenedor
docker logs -f ciwok_bot

# Entrar al contenedor (debug)
docker exec -it ciwok_bot sh

# Eliminar imagen local
docker rmi toyoenohio/ciwokbot:latest

# Pull de la última versión
docker pull toyoenohio/ciwokbot:latest
```

---

## 🆘 **Problemas Comunes**

### **Error: "denied: requested access to the resource is denied"**

- ❌ No estás logueado en Docker Hub
- ✅ Solución: `docker login`

### **Error: "repository does not exist"**

- ❌ El repo no existe en Docker Hub
- ✅ Solución: Creá el repo en https://hub.docker.com/repos (o hace push, se crea automático)

### **Error: "unauthorized: authentication required"**

- ❌ Token inválido o expirado
- ✅ Solución: `docker logout` → `docker login` de nuevo

---

## ✅ **Checklist Final**

- [ ] 1. Crear cuenta Docker Hub (`toyoenohio`)
- [ ] 2. Build local: `docker build -t toyoenohio/ciwokbot:latest .`
- [ ] 3. Test local: `docker run --rm ...`
- [ ] 4. Push: `docker push toyoenohio/ciwokbot:latest`
- [ ] 5. Actualizar DigitalOcean a `toyoenohio/ciwokbot:latest`
- [ ] 6. Verificar logs en DigitalOcean
- [ ] 7. (Opcional) Configurar GitHub Actions para builds automáticos

---

## 📞 **¿Necesitás ayuda?**

Decime:
1. ¿Ya tenés cuenta en Docker Hub?
2. ¿Tenés Docker instalado en tu computadora?
3. ¿Qué error te apareció cuando intentaste cambiar el repo?

Y te guío paso a paso. 🚀
