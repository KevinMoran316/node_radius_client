'use strict'

const radius = require('radius');
const dgram = require("dgram");
const server = dgram.createSocket("udp4"); 

//secret para decodificar el paquete (debe ser el mismo en el servidor)
const secret = 'prueba';


//paquete de datos que le va a llegar al servidor de radius (colocar un circuit id real)
const packet = {
    code: "Access-Request",
    secret: secret,
    attributes: [
        ['User-Name', 'DHCP'],
        ['Vendor-Specific', 3606, [['Incognito-Circuit-ID', '123123123']]]
    ]     
};


//intervalo para enviar paquetes constantemente
setInterval( () => {


    radius.add_dictionary('./incognito-radius.dictionary');

    //codifica el paquete
    const encoded_packet = radius.encode(packet);

    server.send(encoded_packet, 0, encoded_packet.length, 1812, '127.0.0.1' , function (err, bytes) {        
        if (err) {
            console.log(err.toString());
            return;
        }
        console.log('Paquete enviado con exito');
        
    }); 

    

}, 1000) //1000 ms = 1 segundo
