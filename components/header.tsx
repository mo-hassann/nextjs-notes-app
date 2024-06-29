import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import Spinner from "./spinner";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-slate-200 p-3">
      <h1 className="text-3xl font-bold">Todo App</h1>
      <div className="">
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
      </div>
    </header>
  );
}
