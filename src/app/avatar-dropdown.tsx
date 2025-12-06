import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

interface Props {
  fullName: string | null | undefined;
  imageUrl: string | undefined;
  email: string | undefined;
}

export const AvatarDropdown = ({ fullName, email, imageUrl }: Props) => {
  const clerk = useClerk();

  const nameAcronym =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "";

  const ProfileImage = () => {
    return (
      <Avatar className="size-10 cursor-pointer ring-2 ring-border/50 hover:ring-primary/30 transition-all duration-300">
        <AvatarImage src={imageUrl} alt={fullName ?? nameAcronym} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {nameAcronym}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <ProfileImage />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[280px] p-0 rounded-2xl border-border/50 shadow-soft-lg bg-card/95 backdrop-blur-xl"
        >
          {/* User info section */}
          <div className="flex items-center gap-4 p-5 border-b border-border/50">
            <Avatar className="size-12 ring-2 ring-primary/20">
              <AvatarImage src={imageUrl} alt={fullName ?? nameAcronym} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {nameAcronym}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{fullName}</p>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <DropdownMenuItem
              onClick={() => clerk.signOut()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
