import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <main className="">
        <h1>Hello World</h1>
        <p>

        <Link href='/translate'>
          Translate Now
        </Link>
        </p>
      </main>
    
  );
}
