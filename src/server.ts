import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';
import { error } from 'console';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  setTimeout(() => {
    next(new Error('oops'));
  }, 1);
});

app.get('/', (req, res) => {
  console.log('hello from server');
  res.status(200);
  res.json({ message: 'hello from server' });
});

app.use('/api', protect, router)
app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
  if (err.type === 'auth') {
    res.status(401).json({ message: 'unauthorised' });
  } else if (err.type === 'input') {
    res.status(400).json({ message: 'invalid input' });
  } else {
    res.status(500).json({ message: 'my error zsorry' });
  }
});

export default app;