import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { userRouter } from './routes/user'
import { bookRouter } from './routes/book'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    "DATABASE_URL": string;
    "JWT_SECRET": string;
  },Variables:{
     userId?: string;
  }
}>()
app.use(cors());
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', bookRouter);
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
//middleware
//routes





export default app
