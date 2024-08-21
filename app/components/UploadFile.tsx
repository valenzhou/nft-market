"use client";
import usePinata from "../utils/usePinata";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useState } from "react";

export default function UploadFile(props:any) {
 const { uploadFileToIPFS,fetchFileFromIPFS } = usePinata();
 const [files, setFiles] = useState([]);
 const handleUpdate = (files: any)=>{
    // console.log(files);
 }
  const handleUpload = async (e: any) => {

    console.log(e, "test");
    const file = e.target.files[0];
    const res = await uploadFileToIPFS(file);
    console.log(res);
  };
  const handleAddFile = async (error:any,file:any)=>{
    const fileData = file.file;
    const res = await uploadFileToIPFS(fileData);
    props?.upload(res);
    return res;
  }
  return (
    <>
      <FilePond files={files} allowMultiple={false} onupdatefiles={handleUpdate} onaddfile={handleAddFile} name="file"   />
    </>
  );
}
