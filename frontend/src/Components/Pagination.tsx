import { useState } from "react";

const Pagination = ({totalpost,postperpage,setcurrentpage}:{totalpost:any,postperpage:any,setcurrentpage:any}) => {
    let pages=[];
    const [isactive, setisactive] = useState(1)
    for (let index = 1; index <=Math.ceil(totalpost/postperpage) ; index++) {
        pages.push(index);
    }
  return (
    <>
    <div className="flex gap-2">
        {pages.map((page,index)=>{
           return <button className={`w-8 border-white shadow-md ${isactive==page ? 'bg-slate-800 text-white':'bg-white border'}`} key={index} onClick={()=>{
            setcurrentpage(page);setisactive(page);
           }}>{page}</button>
        })}
    </div>
    </>
  )
}

export default Pagination