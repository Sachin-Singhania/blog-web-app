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
    //@ts-ignore
    const {success,data} =  signupInput.safeParse(body.inputs);
     if (!success) return c.json({message: "invalid inputs"});
     const { name, email, password } = data;
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
        }
      })
      const token = await sign(
         {id: user.id} , // payload
        c.env.JWT_SECRET,// secret key
      )
      return c.json({ message: 'Successfully signed in!', token, userId: user.id,user:user });
    } catch (error) {
      return c.json({ error: 'User creation failed',message:error }, 500);
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    //@ts-ignore
    const {success,data} = signinInput.safeParse(body.inputs);
    if (!success) return c.json({ message: 'Invalid inputs' }, 400);
    const { email,password} = data;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,password
        },
      })
  
      if (!user) {
        return c.json({ message: 'Invalid credentials' },401)
      }
      const token = await sign(
        { id: user.id },
        c.env.JWT_SECRET,
      )
      return c.json({ message: 'Successfully signed in!', token, userId: user.id });
    } catch (error) {
      return c.json({ error: 'Sign-in failed' }, 500);
    }
  
  })
  userRouter.get('/auth-status', async (c) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7, authHeader.length);
        const verifytoken = await verify(token, c.env.JWT_SECRET);
        return c.json({ loggedIn: true,userid:verifytoken.id });
      } else {
        return c.json({ loggedIn: false });
      }
    } catch (error) {
      return c.json({ error: 'An error occurred' },500);
    }
  });
  
  