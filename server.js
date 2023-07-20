import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import { Configuration, OpenAIApi } from 'openai';
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv config
dotenv.config();
const app = express();
// middleware's
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ useCredentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// routes
app.get('/', (req, res) => {
    res.send('Server Running')
});

const config = new Configuration({
    apiKey: process.env.CHATGPT_API_KEY
});

const openai = new OpenAIApi(config);

app.post('/api/v1/user/chatgpt', async (req, res) => {
    const { prompt } = req.body;
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 1000,
        temperature: 0,
        prompt: prompt,

    });
    res.send(completion.data.choices[0].text)
})
// static files
app.use(express.static(path.join(__dirname,  './client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));