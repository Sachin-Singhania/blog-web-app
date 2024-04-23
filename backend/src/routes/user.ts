import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signupInput ,signinInput} from "medium-blog-zods"
export const userRouter = new Hono<{
  Bindings: {
    "DATABASE_URL": string;
    "JWT_SECRET": string;
  },Variables:{
    userId: string;
  }
}>()


  
  userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} =  signupInput.safeParse(body);
     if (!success) return c.json({message: "invalid inputs"});
    try {
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        }
      })
      const token = await sign(
         {id: user.id} , // payload
        c.env.JWT_SECRET,// secret key
      )
  
      return c.json({ message: 'Successfully signed in!', token, userId: user.id,user:user });
    } catch (error) {
      return c.json({
        error
      });
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success} =  signinInput.safeParse(body);
     if (!success) return c.json({message: "invalid inputs"});
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: body.email, password: body.password,
        },
      })
  
      if (!user) {
        return c.json({ message: 'Invalid credentials' })
      }
      const token = await sign(
        { id: user.id }, // payload
        c.env.JWT_SECRET,// secret key
      )
      return c.json({ message: 'Successfully signed in!', token, userId: user.id });
    } catch (error) {
      console.log(error);
      return c.json({ error });
    }
  
  })