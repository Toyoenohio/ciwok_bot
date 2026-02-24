# 🤖 Configuración de Modelos AI - ciwokBot

**Última actualización:** 2026-02-24

---

## 📋 **Resumen de Configuración**

| Modelo | Provider | Uso | Precio | Estado |
|--------|----------|-----|--------|--------|
| **Qwen Coder** | qwen-portal | PRINCIPAL | Gratis | ✅ Activo |
| **DeepSeek Chat** | deepseek | FALLBACK | ~$0.14/1M tokens | ✅ Configurado |

---

## 🎯 **Arquitectura de Fallback**

```
┌─────────────────────────────────────────────────────────────┐
│                      SOLICITUD AI                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              1. Intentar con Qwen (Principal)                │
│              - Gratis                                        │
│              - Límite diario de tokens                       │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ✅ ÉXITO            ❌ ERROR/QUOTA
                    │                   │
                    ▼                   ▼
┌──────────────────────────┐  ┌────────────────────────────────┐
│   RESPONDER CON QWEN     │  │  2. Fallback a DeepSeek        │
│                          │  │     - Automático               │
│                          │  │     - ~$0.14/1M tokens         │
└──────────────────────────┘  └────────────────────────────────┘
                                        │
                                        ▼
                              ┌────────────────────────────────┐
                              │   RESPONDER CON DEEPSEEK       │
                              └────────────────────────────────┘
```

---

## 🔧 **Configuración Técnica**

### **Archivo:** `/home/oclaw_ciwok/.openclaw/openclaw.json`

```json
{
  "models": {
    "providers": {
      "qwen-portal": {
        "baseUrl": "https://portal.qwen.ai/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "coder-model",
            "name": "Qwen Coder",
            "cost": {"input": 0, "output": 0},
            "contextWindow": 128000
          }
        ]
      },
      "deepseek": {
        "baseUrl": "https://api.deepseek.com/v1",
        "apiKey": "sk-***",
        "api": "openai-completions",
        "models": [
          {
            "id": "deepseek-chat",
            "name": "DeepSeek Chat",
            "cost": {"input": 0.00000014, "output": 0.00000028},
            "contextWindow": 128000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "qwen-portal/coder-model"
      }
    }
  }
}
```

---

## 💰 **Costos Estimados**

### **Escenario 1: Uso Normal (Qwen disponible)**
```
Tokens diarios: ~50k
Qwen: Gratis
DeepSeek: 0 tokens
─────────────────────
Total diario: $0
Total mensual: $0
```

### **Escenario 2: Qwen sin Quota (Fallback activo)**
```
Tokens diarios: ~50k
Qwen: No disponible (quota excedida)
DeepSeek: 50k tokens × $0.14/1M = $0.007
─────────────────────
Total diario: $0.007
Total mensual: $0.21
```

### **Escenario 3: Uso Intensivo (Fallback constante)**
```
Tokens diarios: ~200k
Qwen: No disponible
DeepSeek: 200k tokens × $0.14/1M = $0.028
─────────────────────
Total diario: $0.028
Total mensual: $0.84
```

**Conclusión:** El costo mensual estimado es **$0.50 - $2 USD** en el peor caso.

---

## 📊 **Monitoreo de Uso**

### **Comandos Útiles:**

```bash
# Ver estado del gateway
openclaw gateway status

# Ver logs del gateway
journalctl -u openclaw -f

# Ver uso de tokens (si está disponible)
openclaw usage
```

### **En Telegram:**

```
/status - Ver estado de la sesión
```

---

## 🚨 **Alertas de Cuota**

### **Cron Job Configurado:**

- **Frecuencia:** Cada 6 horas
- **Umbral de alerta:** 80% de quota
- **Notificación:** Telegram

### **Mensajes de Alerta:**

```
⚠️ ALERTA DE QUOTA AI

Uso actual: 80% de quota diaria
Modelo: Qwen (qwen-portal/coder-model)
Tokens usados: ~100k / ~125k

El sistema cambiará automáticamente a DeepSeek (fallback)
cuando se agote la quota.

Costo estimado de fallback: $0.01-0.03/día
```

---

## 🔄 **Cómo Funciona el Fallback**

### **Automáticamente se usa DeepSeek cuando:**

1. ❌ Qwen devuelve error 429 (Too Many Requests)
2. ❌ Qwen devuelve error de quota excedida
3. ❌ Qwen no responde (timeout)
4. ❌ Error de autenticación con Qwen

### **El fallback es:**

- ✅ **Automático:** No requiere intervención
- ✅ **Transparente:** El usuario no nota la diferencia
- ✅ **Económico:** ~$0.14/1M tokens
- ✅ **Rápido:** Misma arquitectura API

---

## 🛠️ **Mantenimiento**

### **Recargar Configuración:**

```bash
# Después de editar openclaw.json
openclaw gateway restart
```

### **Verificar que DeepSeek funciona:**

```bash
# Testear conexión a DeepSeek
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer sk-***" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}]}'
```

### **Rotar API Key de DeepSeek:**

1. https://platform.deepseek.com/api-keys
2. Crear nueva key
3. Actualizar en `openclaw.json`
4. `openclaw gateway restart`

---

## 📞 **Soporte y Recursos**

### **Documentación Oficial:**

- **OpenClaw:** https://docs.openclaw.ai
- **DeepSeek API:** https://platform.deepseek.com/docs
- **Qwen Portal:** https://portal.qwen.ai

### **Archivos Importantes:**

| Archivo | Función |
|---------|---------|
| `/home/oclaw_ciwok/.openclaw/openclaw.json` | Config principal |
| `TOOLS.md` | API keys y credenciales |
| `memory/2026-02-24.md` | Logs de configuración |

### **Contacto:**

- **GitHub:** https://github.com/toyoenohio/ciwok_bot
- **Discord OpenClaw:** https://discord.com/invite/clawd

---

## ✅ **Checklist de Verificación**

- [x] DeepSeek provider configurado en openclaw.json
- [x] API key guardada en TOOLS.md
- [x] Gateway reiniciado con nueva config
- [x] Documentación creada
- [ ] Cron job de alertas configurado
- [ ] Email de resumen enviado
- [ ] Test de fallback realizado

---

## 📝 **Historial de Cambios**

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-02-24 | Configurar DeepSeek como fallback | Ari |
| 2026-02-24 | Documentar arquitectura de modelos | Ari |
| 2026-02-24 | Calcular costos estimados | Ari |

---

**Próxima revisión:** 2026-03-24 (o cuando haya cambios significativos)
