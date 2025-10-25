import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Testimonial() {
  //todo: remove mock functionality
  const users = [
    { name: "John D", initials: "JD" },
    { name: "Sarah M", initials: "SM" },
    { name: "Mike R", initials: "MR" },
    { name: "Emily K", initials: "EK" },
  ];

  return (
    <div className="max-w-xs space-y-4">
      <blockquote className="text-lg text-foreground">
        "Shocked by the simplicity of getting it up and running, it took me exactly 2 mins."
      </blockquote>
      <p className="text-sm text-muted-foreground">- Khaled H.</p>
      
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {users.map((user, i) => (
            <Avatar key={i} className="w-8 h-8 border-2 border-background">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <p className="text-sm font-medium">
          <span className="text-foreground">1 million+</span>{" "}
          <span className="text-muted-foreground">happy users</span>
        </p>
      </div>
    </div>
  );
}
