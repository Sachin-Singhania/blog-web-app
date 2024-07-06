import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { Category, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from 'medium-blog-zods'
import { createClient } from 'pexels'
import { env } from 'hono/adapter'

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, Variables: {
        userId: string;
    }
}>()
// @ts-ignore
async function verifyToken(c, next) {
    const header = c.req.header("Authorization") || "";
    try {
        const payload = await verify(header, c.env.JWT_SECRET);
        c.set('userId', payload.id);
        await next(); 
    } catch (error) {
        console.error("Token verification failed:", error);
        c.status(401),c.json({ error: "unauthorized" ,status});
    }
}

bookRouter.post('/', verifyToken, async (c) => {
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        const success = createPostInput.safeParse(body);
        
        if (!success.success) {
            return c.status(400),c.json({ message: "invalid inputs" });
        }
        const { title, content, category } = body;
        //@ts-ignore
        const {API_KEY_PEXELS} = env<{ NAME: string }>(c)
        let url;
        if(API_KEY_PEXELS){
            const client = createClient(API_KEY_PEXELS);
            const page= Math.floor(Math.random() * 20);
            const image=await client.photos.search({ query:category, per_page: 1,page});
            //@ts-ignore
            url=image?.photos[0]?.src.original;
        }
        const post = await prisma.post.create({
            data: {
                category,
                title,
                content,
                published: true,
                authorId,photo:url
            },
        });

        return c.json({ message: "success", data: post, id: post.id },200);
    } catch (error) {
        console.error('Error creating post:', error);
        return c.json({ message: "Internal server error" },500);
    } finally {
        await prisma.$disconnect();
    }
});

bookRouter.put('/:id', verifyToken, async (c) => {
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        const { success } = updatePostInput.safeParse(body);

        if (!success) {
            return c.json({ message: "invalid inputs" },400);
        }

        if (!userId) {
            return c.json({ message: "not authorized" },401);
        }

        const post = await prisma.post.update({
            where: {
                id: c.req.param("id"),
                authorId: userId,
            },
            data: {
                title: body.title ? body.title : undefined,
                content: body.content ? body.content : undefined,
                category: body.category ? body.category : undefined,
            },
        });

        return c.json({ message: 'updated', data: post },200);
    } catch (error) {
        console.error('Error updating post:', error);
        return c.json({ message: "Internal server error" },500);
    } finally {
        await prisma.$disconnect();
    }
});

bookRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        if (!id) {
            return c.json({ message: "invalid id of the blog" },400);
        }

        const blog = await prisma.post.findUnique({
            where: { id },
            select: {
                content: true,
                title: true,
                id: true,
                category:true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return c.json({ blog },200);
    } catch (error) {
        console.error('Error retrieving post:', error);
        return c.json({ message: "Internal server error" },500);
    } finally {
        await prisma.$disconnect();
    }
});

bookRouter.get('/bulk/all', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
       
        const blogs = await prisma.post.findMany({
            take:40,
            select: {
                content: true,
                title: true,
                id: true,
                category: true,
                photo:true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return c.json({ blogs },200);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        return c.json({ message: "Internal server error" },500);
    } finally {
        await prisma.$disconnect();
    }
});
bookRouter.get('/bulk/top', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blogs = await prisma.post.findMany({
            take:5,
            select: {
                content: true,
                title: true,
                id: true,
                category: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return c.json({ blogs },200);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        return c.json({ message: "Internal server error" },500);
    } finally {
        await prisma.$disconnect();
    }
});

bookRouter.get('/bulk/category/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const categoryName = c.req.param("id");

        if (!categoryName) {
            return c.json({ error: 'Category name is required' },400);
        }

        if (!Object.values(Category).includes(categoryName as Category)) {
            return c.json({ error: 'Invalid category name' },400);
        }

        const blogs = await prisma.post.findMany({
            //@ts-ignore
            where: { category: categoryName },
            select: {
                content: true,
                title: true,
                id: true,
                category: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return c.json({ blogs },200);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        return c.json({ message: "Internal server error" },500);
    } finally {
        await prisma.$disconnect();
    }
});

bookRouter.get('/bulk/categories', async (c) => {
    try {
        const categories = Object.values(Category);
        return c.json({ categories },200);
    } catch (error) {
        return c.json({ message: "Internal server error" },500);
    }
});

