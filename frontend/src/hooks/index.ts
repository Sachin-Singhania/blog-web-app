import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
export type Blogtypes={
  title: string;
  content: string;
  id :string;
  authorId:string,
  author:{
    name:string;
    id?:string;
  },
  category:string;
  photo:string;
}
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blogtypes[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        const headers = {
            Authorization: `${token}`
        };

        axios.get(`${BACKEND_URL}/api/v1/blog/bulk/all`, { headers })
            .then(response => {
                setBlogs(response.data.blogs); 
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    return { loading, blogs };
}
export const useBlog= (id:string)=> {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blogtypes[]>([]);
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const headers = {
            Authorization: `${token}`
        };
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, { headers })
            .then(response => {
                setBlog(response.data.blog); 
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [id]);

    return { loading, blog };
}
export const useCategories= ()=> {
    const [loading, setLoading] = useState(true);
    const [categories, setcategoriesBlog] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk/categories`)
        .then(response => {
            setcategoriesBlog(response.data.categories); 
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    }, [])
    return { loading, categories };
}
export const useTop= ()=> {
    const [loading, setLoading] = useState(true);
    const [toppost, usetoppost] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk/top`)
        .then(response => {
            usetoppost(response.data.blogs); 
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    }, [])
    return { loading, toppost };
}
