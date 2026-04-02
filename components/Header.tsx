import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return <header>
    <div className="main-container inner">
      <Link href="/">
        <Image src="/assets/logo.svg" alt="Logo" width={132} height={40} />
      </Link>
    </div>
  </header>;
};

export default Header;
