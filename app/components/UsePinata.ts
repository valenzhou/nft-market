export default function usePinata() {
    const JWT = process.env.NEXT_PUBLIC_PINATAJWT;
    // const GATEWAT = process.env.NEXT_PUBLIC_PINATAGATEWAY;
    const GATEWAT = "gateway.pinata.cloud";

    async function uploadFileToIPFS(file:File){
        try{
            const data = new FormData();
            data.append("file",file);
            const request = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS",{
                method: "POST",
                headers: {
                  Authorization: `Bearer ${JWT}`,
                },
                body: data,
            });
            const response = await request.json();
            return response;
        }catch(err){
            console.log(err);
        }
       
    }

    async function fetchFileFromIPFS(cid:string){
        const url = `https://${GATEWAT}/ipfs/${cid}`;
        try{
            const request = await fetch(url);
            const response = await request.json();
            return response;
        }catch(err){
            console.log(err)
        }
    }
    return {
        uploadFileToIPFS,
        fetchFileFromIPFS
    }
}
