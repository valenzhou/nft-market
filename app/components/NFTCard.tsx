import Image from "next/image";

export default function Page(props:any) {
    const info = props;
    console.log(info)
  return (
    <div style={{flexBasis: '33%'}} className="flex justify-center">
      <div className="nft-card" style={{borderRadius: '12px'}}>
        <div className="nft-card--header">
          <div className="nft-user">
            <Image src="/BYBYLOGO.png" width={40} height={40} alt=""  />
            {info.name}
            {/* <span>owner@{info.wallet}</span> */}
          </div>
        </div>
        <div className="nft-card--content">
          <div className="nft-action">
            <span>
            &nbsp;#&nbsp;{info.tokenId} <i className="far fa-heart"></i>
            </span>
          </div>
          <Image src={`/${info.tokenId}.png`} width={354} height={480} alt="" />
          <div className="nft-qrcode">
            {/* {info.tokenId} */}
            {/* <span>/023</span> */}
            <i className="fas fa-qrcode"></i>
          </div>
        </div>
        <div className="nft-card--footer flex justify-between">
          
          <div className="nft-time">
            <span>
                <i className="far fa-clock"></i> <strong>Traits</strong>
                {
                    info?.meta?.map((v:{trait_type:string,value:string},i:number)  =>{
                        return (
                            <p key={i}>{
                                v?.trait_type || ""
                            }: {v?.value}</p>
                        )
                    })
                }
             
            </span>
          </div>

          <div className="nft-price">
            {/* <span>($803.39)</span> */}
            {/* <i className="fab fa-ethereum"></i> 0.23 ETH */}
          </div>
        </div>
      </div>
    </div>
  );
}
