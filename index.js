const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

let userDatabase = {};

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', message => {
    const chatId = message.from;
    const messageText = message.body.toLocaleLowerCase();

    // Saudações iniciais
    if (messageText === 'ola' || messageText === 'oi') {
        client.sendMessage(chatId, '⚫🔴 Saudações paralímpicas! ⚫🔴');
        client.sendMessage(chatId, '*Olá, sou o ThePhryges, assistente virtual do clube Real paralímpico (CRP!).*');
        userDatabase[chatId] = { setorEscolhido: false };
    }

    // Pedido de nome
    if (messageText === 'sei' || messageText === 'th' || messageText === 'ben') {
        client.sendMessage(chatId, '⚫🔴\n*Por favor, se identifique falando o seu nome*\n*ThePhryges*');
    }

    // Pedido de localização
    if (messageText === 'hi' || messageText === 'oiee' || messageText === 'ha') {
        client.sendMessage(chatId, '*ThePhryges*\n\n*Agora por favor, diga de onde você é*');
    }

    // Salvando a localização
    if (messageText === 'hei' || messageText === 'ne' || messageText === 'oiie') {
        userDatabase[message.from].local = message.body.trim(); // Salva a mensagem como "local"
        client.sendMessage(message.from,
            `*ThePhryges*\n\n*Agora, escolha qual setor você deseja falar:*\n` +
            `*1: secretaria*\n` +
            `*2: diretoria*\n` +
            `*3: setor financeiro*\n\n` +
            `Em breve alguém de nossa equipe já irá te atender. 📱📱📱\n\n` +
            `Acesse o link de nosso site abaixo 🔗\n` +
            `https://www.realparalimpico.com.br\n\n` +
            `Aproveite e confira o nosso Instagram! 😉\n\n` +
            `https://www.instagram.com/clube_real_paralimpico?igsh=MWNjYnNyaHo5aXFhNg%3D%3D&utm_source=qr\n\n` +
            `E fique por dentro de todas as atividades que o clube desenvolve ⚫🔴`
        );
    }

    // Escolha de setor e transferência
    if (messageText != '1' || messageText != '2' || messageText != '3') {
        client.sendMessage(chatId, '⚫🔴\n*Por favor, escolha um setor*\n*1: secretaria*\n*2: diretoria*\n*3: setor financeiro*\n⚫🔴');
        if (['1', '2', '3'].includes(messageText)) {
            const setores = {
                '1': 'setor de secretaria',
                '2': 'setor de diretoria',
                '3': 'setor financeiro'
            };
            if (!userDatabase[chatId].setorEscolhido) {
                userDatabase[chatId].setorEscolhido = true; // Marca que o setor foi escolhido
                client.sendMessage(chatId, `Aguarde! Transferindo o seu atendimento para o ${setores[messageText]}.`);
                client.sendMessage(chatId, 'Você será atendido o mais rápido possível.');
            }
            else {
                client.sendMessage(chatId, 'Você já escolheu um setor. Por favor, aguarde o atendimento.');
            }
        }
    }
});

client.initialize();
