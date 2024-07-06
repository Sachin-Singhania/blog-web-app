import { Link } from 'react-router-dom';
interface BlogCardType {
    id: string;
    authorname: string;
    title: string;
    content: string;
    category: string;
    photo?:string;
}

export const BlogCard = ({
    id,
    authorname,
    title,
    content,category,photo
}: BlogCardType) => {
    return (
        <div className='w-80 h-96 rounded-lg overflow-hidden mb-4 shadow-md'>
            <Link to={`/blog/${id}`}>
                <div className='border bg-card h-full flex flex-col'>
                    <div className='w-full h-52'>
                        <img
                        src={photo}
                            alt=""
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div className='p-3 flex-grow flex flex-col'>
                        <div>
                            <div className='font-extralight'>{authorname.toUpperCase()} | {category?category:"Nope"}</div>
                        </div>
                        <div className='text-blue-900 font-bold'>{title}</div>
                        <div className='font-light flex-grow' dangerouslySetInnerHTML={{ __html: content.slice(0, 100) + "..." }}></div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

interface AvatarProps {
    name: string;
}

export function Avatar({ name }: AvatarProps) {
    return (
        <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 dark:bg-gray-600 rounded-full mr-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {name[0]}
            </span>
        </div>
    );
}

export default BlogCard;
