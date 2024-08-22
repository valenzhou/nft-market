"use client";
import usePinata from "../utils/usePinata";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useState } from "react";
import { Spin } from "antd";
import { Image } from "@nextui-org/react";

export default function UploadFile(props:any) {
 const { uploadFileToIPFS,fetchFileFromIPFS } = usePinata();
 const [spinning, setSpinning] = useState(false);
 const [files, setFiles] = useState([]);
 const [uri, setUri] = useState("");
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
    setSpinning(()=> true);
    const fileData = file.file;
    const res = await uploadFileToIPFS(fileData);
    const IpfsHash = res?.IpfsHash || '';
    if(IpfsHash){
        let imageUrl = (IpfsHash).replace("", "http://gateway.pinata.cloud/ipfs/") +"";
        setUri(imageUrl);
    }
    props?.upload(res);
    setSpinning(()=> false);
    return res;
  }
  return (
    <>
      <Spin spinning={spinning} percent='auto' fullscreen />
      {(!uri) && <FilePond files={files} allowMultiple={false} onupdatefiles={handleUpdate} onaddfile={handleAddFile} name="file"   />}
      {uri && <Image src={`${uri}`} width={132} height={140} alt="" />}
    </>
  );
}
