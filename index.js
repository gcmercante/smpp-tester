import 'dotenv/config';
import smpp from 'smpp';

const session = smpp.connect('localhost', 9400);
let smppConnected = false;

const {
    SMPP_TRX_SYSTEM_ID,
    SMPP_TRX_PASSWORD,
    SMPP_TRX_SYSTEM_TYPE,
} = process.env;

session.on('connect', () => {
    session.bind_transceiver({
        system_id: SMPP_TRX_SYSTEM_ID,
        password: SMPP_TRX_PASSWORD,
        system_type: SMPP_TRX_SYSTEM_TYPE,
        interface_version: 52,
    }, (pdu) => {
        if (pdu.command_status == 0) {
            smppConnected = true;
            console.log("outsession bind completed ok, status 0");
        }
    })
});

session.on('pdu', function(pdu){
    console.log({smppPdu:pdu}, Boolean(pdu.queue_id));
});

session.on('close', () => {
    console.log('smpp disconnected');
    smppConnected = false;
    console.log('smpp reconnecting');
    session.connect('http://localhost', 9400);
});

session.on('error', (error) => {
    console.log('smpp error', error)
});