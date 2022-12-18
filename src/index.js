const express = require('express');
const app = express();
const {PORT} = require('./config');

//  middlewares
//este sive para que cuando me manden un json lo transformo a objeto y puedo usarlo mas facilmente
app.use(express.json());
//lo mismo como el primero pero para un formulario y el extended a false hace que no acepte imagenes, solo datos simples
app.use(express.urlencoded({extended:false}));


//routes
app.use(require('./routes/index'));

app.listen(PORT, () => {console.log(`Example app listening on port ${PORT}`);
})