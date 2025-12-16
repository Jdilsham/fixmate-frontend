import Footercard from "../components/footer";
import Header from "../components/header";

export default function Wanted() {
  return (
    <div>
      <Header />
      <div className="w-full bg-[url('/wanted.png')] bg-center bg-cover h-screen bg-no-repeat">
        <h1>Wanted Page</h1>
      </div>
      <Footercard />
    </div>
  );
}
