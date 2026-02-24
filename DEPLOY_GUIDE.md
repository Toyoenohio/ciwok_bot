# 🚀 Guía de Deploy en DigitalOcean

## 📋 Problemas a Resolver

1. ✅ La app está apuntando al repo viejo (`Cue2g/ciwok_bot`)
2. ✅ Error en consola: "error al enviar la data"

---

## 🔧 SOLUCIÓN 1: Cambiar el Repo en DigitalOcean

### **Opción A: DigitalOcean App Platform** (Más común)

1. **Ingresá al Dashboard:**
   - https://cloud.digitalocean.com/apps

2. **Seleccioná tu App** (ciwok_bot o el nombre que tenga)

3. **Click en "Settings"** (arriba)

4. **En la sección "Source":**
   - Click en **"Edit"**
   - Buscá el repo: `Cue2g/ciwok_bot`
   - Cambialo a: `toyoenohio/ciwok_bot`
   - Click en **"Save"**

5. **Redeploy automático:**
   - La App Platform va a detectar el cambio
   - Va a hacer pull del nuevo repo
   - Va a rebuildar y redeployar automáticamente

6. **Verificá los logs:**
   - Andá a "Deployments"
   - Click en el deployment más reciente
   - Verificá que no haya errores

---

### **Opción B: Droplet con Docker**

```bash
# 1. Conectate por SSH
ssh root@TU_DROPLET_IP

# 2. Parar la app actual
cd /path/a/tu/app  # Ej: /var/www/ciwok_bot
docker-compose down

# 3. Actualizar el código
git pull origin master

# 4. Reconstruir y levantar
docker-compose up -d --build

# 5. Ver logs
docker-compose logs -f
```

---

### **Opción C: Droplet con PM2/Node**

```bash
# 1. Conectate por SSH
ssh root@TU_DROPLET_IP

# 2. Ir al directorio del bot
cd /var/www/ciwok_bot  # o donde esté

# 3. Parar el bot
pm2 stop ciwok_bot  # o el nombre que tenga

# 4. Actualizar código
git pull origin master

# 5. Reinstalar dependencias
yarn install

# 6. Rebuild TypeScript
yarn build

# 7. Reiniciar
pm2 restart ciwok_bot

# 8. Ver logs
pm2 logs ciwok_bot
```

---

## 🔧 SOLUCIÓN 2: Arreglar el Error de la API

### **El Problema:**

El error `Error: error al enviar la data` viene de que la API de WordPress no está respondiendo correctamente.

### **Causas Posibles:**

1. ❌ La URL cambió o no existe
2. ❌ El token `CLIENT_TOKEN` es inválido
3. ❌ El servidor WordPress está caído
4. ❌ Problema de firewall/red

---

### **Pasos para Debuggear:**

#### **Paso 1: Verificar la URL**

```bash
# Probar la API desde tu computadora
curl -X POST https://scc.ciwok.com/wp-json/jet-cct/comisiones_dec \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"usuario":"test","tarea":"test","grupo":"test","autor":"test","cantidad":"1","fecha":"2026-02-24","cct_status":"publish"}'
```

**Respuestas posibles:**
- `200 OK` → La API funciona ✅
- `401 Unauthorized` → Token inválido ❌
- `404 Not Found` → URL incorrecta ❌
- `Connection refused` → Servidor caído ❌

---

#### **Paso 2: Verificar Variables de Entorno**

En DigitalOcean, configurá las variables:

**App Platform:**
- Settings → Environment Variables
- Agregá:
  ```
  CLIENT_TOKEN=tu_token_real
  API_URL=https://scc.ciwok.com/wp-json/jet-cct/comisiones_dec
  ```

**Droplet:**
- Editá el archivo `.env` en el server
- Verificá que `CLIENT_TOKEN` sea correcto

---

#### **Paso 3: Ver Logs Detallados**

Con los nuevos cambios que acabo de hacer, ahora los logs van a mostrar:

```
[dataSend] Enviando a: https://scc.ciwok.com/wp-json/jet-cct/comisiones_dec
[dataSend] Body: {"usuario":"juan","tarea":"Post Diseñado",...}
[dataSend] Response status: 401
[dataSend] ERROR HTTP 401: {"code":"rest_forbidden","message":"Unauthorized"}
```

Esto te va a decir **exactamente** cuál es el problema.

---

## 📝 **Checklist de Deploy**

- [ ] 1. Cambiar repo en DigitalOcean (App Platform o SSH)
- [ ] 2. Verificar que el deploy se completó sin errores
- [ ] 3. Configurar variables de entorno (`CLIENT_TOKEN`, `API_URL`)
- [ ] 4. Probar el bot con `/start` en Telegram
- [ ] 5. Ver logs para confirmar que no hay errores
- [ ] 6. Probar crear una tarea y verificar que se guarda

---

## 🆘 **Si el Error Persiste**

### **Opción A: La API de WordPress no existe más**

Si la URL `https://scc.ciwok.com/wp-json/jet-cct/comisiones_dec` ya no funciona:

1. **Conseguí la nueva URL** de tu API
2. **Actualizá la variable `API_URL`** en DigitalOcean
3. **Redeployá la app**

### **Opción B: Querés usar otra API**

Si querés migrar a otra API (Supabase, otra web, etc.):

1. Actualizá `API_URL` en el `.env`
2. Asegurate que la nueva API acepte el mismo formato de body
3. Redeployá

---

## 📞 **Necesitás Ayuda?**

Pasame:
1. ¿Qué tipo de deploy tenés? (App Platform, Droplet Docker, Droplet PM2)
2. ¿Qué error ves en los logs ahora?
3. ¿La API de WordPress sigue activa o cambió?

Y te ayudo paso a paso. 🚀
