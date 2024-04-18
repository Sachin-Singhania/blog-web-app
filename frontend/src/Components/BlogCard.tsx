import React from 'react';
import { Link } from 'react-router-dom';

interface BlogCardType {
    id:string,
    authorname: string ;
    title: string;
    content: string;
    publishedDate: string;
}

export const BlogCard = ({
    id,
    authorname,
    title,
    content,
    publishedDate
}: BlogCardType) => {
    return (
        <Link to={`/blog/${id}`}>
        <div className="max-w-screen-lg bg-slate-200 shadow-md  p-4 mb-4 m-10 rounded-lg">
            <div className="flex items-center mb-2">
                <Avatar name={authorname} />
                <div className="ml-2 text-sm text-black font-medium">{authorname}</div>
                <div className="ml-auto text-sm text-black">{publishedDate}</div>
            </div>
            <div className="text-3xl font-bold text-black mb-2">{title}</div>
            <div className="text-sm text-black">{content.slice(0, 50) + "..."}</div>
            <div className="text-sm text-black">{Math.ceil(content.length / 100)} minutes</div>
        </div>
        </Link>
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
