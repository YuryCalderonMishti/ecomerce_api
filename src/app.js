import express from 'express';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

const hbs = handlebars.create({
    layoutsDir: join(__dirname, 'views/layouts'),
    partialsDir: join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    helpers: {
        multiply: (a, b) => (a * b).toFixed(2),
        total: (products) =>
            products.reduce((sum, item) => sum + item.quantity * item.product.price, 0).toFixed(2)
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter(io));

io.on('connection', socket => {
    console.log('Cliente conectado:', socket.id);
});

const MONGO_URI = 'mongodb+srv://yurycami13:TsZ8yKzv0BK1w0Am@cluster0.cxltsku.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGO_URI,)
.then(() => {
    console.log('🟢 Conectado a MongoDB');
    httpServer.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
})
.catch(err => {
    console.error('🔴 Error al conectar con MongoDB:', err);
});