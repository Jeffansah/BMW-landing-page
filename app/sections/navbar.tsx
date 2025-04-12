import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/bmw-logo.png";
import Navlinks from "../components/navbar/navlinks";
import NavButtons from "../components/navbar/navbuttons";

const Navbar = () => {
  return (
    <div className="boxed absolute top-0 left-1/2 z-50 hidden -translate-x-1/2 items-center justify-between border-b-[0.5px] border-white py-4 xl:flex">
      <div className="flex gap-8">
        <Link href="/">
          <Image src={logo} alt="logo" className="size-12" />
        </Link>
        <Navlinks />
      </div>
      <div className="flex items-center gap-4">
        <NavButtons />
      </div>
    </div>
  );
};

export default Navbar;
