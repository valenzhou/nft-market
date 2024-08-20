"use client";
import usePinata from "./UsePinata";
// Import React FilePond
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
  const getImage = async()=>{
    const res = await fetchFileFromIPFS("QmaaCCDPC3tzMsx8w17mJXic5JTUogmXe894C4dgjJbA5V");
    props?.download(res);
    return res;
  }
  return (
    <>
     
      {/* <input
        id="uploadFile"
        type="file"
        name="file"
        accept=".png,.jpg,.jpge,.svg,.webp"
        onChange={handleUpload}
      /> */}

      <FilePond files={files} allowMultiple={false} onupdatefiles={handleUpdate} onaddfile={handleAddFile} name="file"   />
    </>
  );
}
