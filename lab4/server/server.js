const express = require('express');
const bodyParser = require("body-parser");

const corsOptions = {
    origin: 'http://localhost:63342',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};
const cors = require('cors');
const app = express();



app.use(cors());
app.use(cors(corsOptions));
app.use(bodyParser.json());


app.post('/submit', (req, res) => {
    const { name, age, answers } = req.body;
    let house = '';
    console.log('Полученные ответы:', answers);


    const totalScore = answers.reduce((sum, item) => sum + parseInt(item.answer, 10), 0);


    if (totalScore >= 0 && totalScore <= 5) {
        house = 'Гриффиндор';
    } else if (totalScore >= 6 && totalScore <= 10) {
        house = 'Пуффендуй';
    } else if (totalScore >= 11 && totalScore <= 15) {
        house = 'Когтевран';
    } else if (totalScore >= 16 && totalScore <= 20) {
        house = 'Слизерин';
    }



    res.json({
        message: "Данные успешно обработаны!",
        totalScore,
        house,
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
