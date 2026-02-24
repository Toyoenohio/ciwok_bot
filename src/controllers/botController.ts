
import { IActiveUsers } from "../models/ActiveUsers";
import { ContextFix } from "../../app";
import groupController from "./groupsControllers";
import usersController from "./usersController";
import bot from "../../app";
interface ListService {
	name: string,
	valor: number
}

interface ResponseItem {
    text: string;
    callback_data: string;
}

export interface BodyTarea {
	usuario: string;
	tarea: String;
	grupo: String;
	autor: string;
	cantidad: String;
	fecha: string
	cct_status: string
}

const listServices = [
    {
        "name": "Post Diseñado",
        "valor": 1
    },
    {
        "name": "Post Ilustrado",
        "valor": 3
    },
    {
        "name": "Edición simple",
        "valor": 0.8
    },
    {
        "name": "Edición con montaje",
        "valor": 1
    },
    {
        "name": "Edición con diseño",
        "valor": 1
    },
    {
        "name": "Carrusel diseño (por pieza)",
        "valor": 0.5
    },
    {
        "name": "Carrusel fotos editadas (por pieza)",
        "valor": 0.25
    },
    {
        "name": "Storie",
        "valor": 0.5
    },
    {
        "name": "Gif",
        "valor": 1.5
    },
    {
        "name": "Sesión de Fotos",
        "valor": 8
    },
    {
        "name": "Vídeo tipo A",
        "valor": 2.5
    },
    {
        "name": "Vídeo tipo B",
        "valor": 3.5
    },
    {
      "name": "Subtitulos",
      "valor": 2
    }

]



function orderListMessage(array: ListService[], colum: number): ResponseItem[][] {
    const response: ResponseItem[] = array.map(val => ({
        text: val.name,
        callback_data: val.name,
    }));

    const arrayR: ResponseItem[][] = [];
    response.forEach((res) => {
        if (arrayR.length === 0) {
            arrayR.push([res]);
        } else {
            if (arrayR[arrayR.length - 1].length < colum) {
                arrayR[arrayR.length - 1].push(res);
            } else {
                arrayR.push([res]);
            }
        }
    });

    return arrayR;
}

function getServices() {
    return orderListMessage(listServices, 2)
}


async function saveTask(responseText: string, data: IActiveUsers, ctx: ContextFix): Promise<boolean> {
    try {


        const splitText = splitFunc(responseText);
        const userMenition = splitText[0].charAt(0)
        const amountInput = Number(splitText[1])
        const TaskToUser = splitText[0].slice(1)
        if (userMenition != '@') {
            ctx.reply('ingrese un usuario valido')
            return false
        }

        if (!amountInput) {
            ctx.reply('Cantidad no ingresada')
            return false
        }

        if (isNaN(amountInput)) {
            ctx.reply('El formato de la cantidad no es un numero')
            return false
        }

        const groupValue = await groupController.getValor(data.idGroup);
        if (!groupValue?.value) {
            ctx.reply('error al capturar el valor del grupo, por favor inicie el proceso nuevamente.');
            return false
        }

        let valorTotal: number = 0;
        if(!data.optionValue) throw new Error('Option Value null')
        if (data.optionName === 'Sesión de Fotos') {
          
            valorTotal = data.optionValue * amountInput
        } else {
          
            const result = amountInput * data.optionValue;
            valorTotal = groupValue.value * result
        }
        const user = await usersController.getUserName(data.idUser)
        const body = {
            usuario: TaskToUser,
            tarea: data.optionName,
            grupo: groupValue.title,
            autor: user?.name,
            cantidad: amountInput.toString(),
            monto: valorTotal.toFixed(2),
            fecha: ctx.update.message ? ctx.update.message.date.toString() : Date.now() ,
            cct_status: "publish",
            tipo_de_pago: "tarea"
        }

        const response = await dataSend(body)

        if (!response) {
            ctx.reply('Erro al enviar la data')
            return false
        }
        bot.telegram.sendMessage(data.idGroup, `@${user?.userName} creo una tarea de:
${data.optionName}
Fue asignada a @${TaskToUser}
cantidad:${body.cantidad} `);


        ctx.reply(`Registro Guardado con Exito!`);
        console.log(`@${user?.userName} created a task: ${data.optionName} Assigned to: @${TaskToUser} Quantity: ${body.cantidad}`);


        return true
    } catch (error) {
        return false
    }
}


function splitFunc(ctxText: string) {
    const responseText = ctxText;
    const resultArray = responseText.split(',')
    return resultArray
}

async function dataSend(body: any) {
    const apiUrl = process.env.API_URL || 'https://scc.ciwok.com/wp-json/jet-cct/comisiones_dec';
    const apiToken = process.env.CLIENT_TOKEN;
    
    try {
        console.log(`[dataSend] Enviando a: ${apiUrl}`);
        console.log(`[dataSend] Body: ${JSON.stringify(body)}`);
        
        if (!apiToken) {
            console.error('[dataSend] ERROR: CLIENT_TOKEN no está configurado');
            return null;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch(apiUrl, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiToken 
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log(`[dataSend] Response status: ${response.status}`);
        
        if (response.status !== 200) {
            const errorText = await response.text();
            console.error(`[dataSend] ERROR HTTP ${response.status}: ${errorText}`);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        const dataResponse = await response.json();
        console.log(`[dataSend] Response OK: ${JSON.stringify(dataResponse)}`);
        return dataResponse;
        
    } catch (error: any) {
        console.error('[dataSend] ERROR:', error.message);
        if (error.name === 'AbortError') {
            console.error('[dataSend] Timeout - la API tardó más de 10 segundos');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('[dataSend] La API no responde - verificar URL y red');
        }
        return null;
    }
}

async function save(body: BodyTarea) {
    return dataSend(body)
}

const botController = {
    save,
    getServices,
    listServices,
    saveTask
}

export default botController