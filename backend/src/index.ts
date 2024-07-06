import { Hono } from 'hono'
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
app.use(cors({
 origin: 'https://blogapp-sachin.vercel.app',
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  credentials: true,
}));
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', bookRouter);
app.get('/', (c) => {
  return c.text('Hello Weblogs')
})

//middleware
//routes





export default app
