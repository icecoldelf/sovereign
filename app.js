const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/buck', (req, res) => res.send('Buck is amazing!'));

app.listen(80, () => console.log('Example app listening on port 3000!'));

//luke's comment
