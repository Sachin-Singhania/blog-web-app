import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from 'medium-blog-zods'

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, Variables: {
        userId: string;
    }
}>()

bookRouter.use('/*', async (c, next) => {
    const header = c.req.header("Authorization") || "";
    try {
         const payload = await verify(header, c.env.JWT_SECRET);
        c.set('userId', payload.id);
        await next();    
    } catch (error) {
        console.error("Token verification failed:", error);
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
  })


bookRouter.post('/',async (c) => {
    const authorId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} =  createPostInput.safeParse(body);
     if (!success) return c.json({message: "invalid inputs"});
     const post = await prisma.post.create({
         data: {
             title: body.title,
             content: body.content,
             authorId: authorId,
             published:true
		}
	});
    return c.json({ message: "success", data: post, id: post.id});
})

bookRouter.put('/:id',async (c) => {
    const userId  = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} =  updatePostInput.safeParse(body);
     if (!success) return c.json({message: "invalid inputs"});
    if(!userId){
        return c.json({ message:"not authorized"});
    };
    const post = await prisma.post.update({
         where:{
            id:c.req.param("id"),
            authorId:userId
        },
         data:{
             title: body.title ? body.title : undefined ,
             content: body.content ? body.content : undefined,
         }
    })
    return  c.json({message:'updated' , data:post});
  })


// bookRouter.get('/hey',async (c) => {
//     console.log("hey")
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env?.DATABASE_URL	,
// 	}).$extends(withAccelerate());
//     const post = await prisma.post.deleteMany({})
//     return  c.json({message:'Deleted' , data:post});
//   })
  
  bookRouter.get('/:id',async (c) => {
    const id = c.req.param('id');
    if(!id) return c.json({message:"invalid id of the blog"});
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const blog = await prisma.post.findUnique({
        where:{id:id},
        select:{
            content:true,
            title:true,id:true,author:{
                select:{
                    id:true,name:true
                }
            }
        }
    }) ;

    return c.json({ blog });
  })
  
  bookRouter.get('/bulk/all', async (c) => {
      const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
        const blogs = await prisma.post.findMany({
            select:{
                content:true,
                title:true,id:true,author:{
                    select:{
                        id:true,name:true
                    }
                }
            }
        });
    return c.json({ blogs });
  })
  