import Footercard from "../components/footer";
import Header from "../components/header";


export default function Contact(){
    return(
        <div className="w-full h-full">
            {/* first quarter */}
            <Header />
            <div className="w-full bg-[url('/contact-background.jpg')] bg-center bg-cover h-screen bg-no-repeat">
             <div className="absolute left-[270px] top-[210px] font-inter text-[90px] font-normal leading-none">
                <span className="text-white">Contact </span>
                <span className="text-[#01BDEF]">Us</span>
             </div>
            
              <div className="absolute left-[305px] top-[340px] font-inter text-[32px] font-normal leading-none">
                <span className="text-white">Fixmate is ready to provide the<br/> right solution according to<br/>your needs  </span>
              </div>

             <img src="/tel.png" className="absolute left-[130px] top-[270px] w-[510px] h-[510px] object-contain"/>
            </div>





            <Footercard/>
        </div>
            
    );
}