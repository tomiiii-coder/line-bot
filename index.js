require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

// Webhookエンドポイント
app.post('/webhook', async (req, res) => {
    const events = req.body.events;
    for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
            await replyMessage(event.replyToken, event.message.text);
        }
    }
    res.sendStatus(200);
});

async function replyMessage(replyToken, text) {
    const message = {
        replyToken: replyToken,
        messages: [{ type: 'text', text: `あなたのメッセージ: ${text}` }]
    };

    await axios.post('https://api.line.me/v2/bot/message/reply', message, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
        }
    });
}

const PORT = process.env.PORT || 3000; // 環境変数 PORT を優先
app.listen(PORT, () => console.log(`Bot is running on port ${PORT}`));
