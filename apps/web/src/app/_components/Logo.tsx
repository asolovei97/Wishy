import Link from "next/link";
import { BodyLarge } from "./Typography";

export const Logo = () => {
  return (
    <Link href="/" className="inline-flex justify-center items-center gap-2">
      <div className="bg-primary-500 rounded-xl flex justify-center items-center size-10">
        <BodyLarge color="white">W</BodyLarge>
      </div>
      <BodyLarge>Wishy</BodyLarge>
    </Link>
  );
};
