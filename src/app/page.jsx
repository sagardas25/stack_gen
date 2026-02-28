import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";

export default function Home() {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Button>test</Button>
      </div>
    </ClerkProvider>
  );
}
