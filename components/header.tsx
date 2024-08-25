import { SignedIn, SignedOut, SignInButton, UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import Spinner from "./spinner";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col">
      <nav className="flex items-center justify-between w-full py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="notes app logo image" width={50} height={50} />
          <h2 className="text-xl font-semibold text-primary">Notes App</h2>
        </div>
        <ClerkLoading>
          <Spinner />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <Button asChild>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkLoaded>
      </nav>
      <div className="flex items-center flex-col md:flex-row px-10 py-20 gap-20 md:gap-40 lg:gap-60">
        <div className="space-y-2">
          <h1 className="text-primary text-5xl font-semibold">Notes App ✏</h1>
          <p className="max-w-[500px] text-muted-foreground">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum, inventore, pariatur animi esse iste recusandae vero vel consequuntur voluptas voluptate in asperiores dicta nihil nesciunt et quisquam illo corporis quibusdam.</p>
        </div>
        <div>
          <Image src="/header-img.png" alt="notes app header image" width={290} height={290} />
        </div>
      </div>
    </header>
  );
}
