"use client";
import { useState } from "react";
import Blog from "./components/blog";
export default function Protal() {
    const [num,setNum] = useState(0);
    console.log(num);
    return (
        <div>protal
            <Blog></Blog>
        </div>
        
    );
}