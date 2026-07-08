import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "@base-ui/react/input";
import { Button } from "@base-ui/react/button";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* header */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.png" alt="Logo" />
                </a>

                <h1 className="text-2xl font-bold">Tạo Tài Khoản Kairo</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu hành trình học tập!
                </p>
              </div>
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                {/* last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastname">Họ</Label>
                  <Input id="lastname" type="text" />
                </div>
                {/* first Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstname">Tên</Label>
                  <Input id="firstname" type="text" />
                </div>
              </div>

              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" />
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" />
              </div>

              {/* confirm password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input id="confirm-password" type="password" />
              </div>

              {/* button */}
              <Button className="w-full" type="submit">
                Đăng ký
              </Button>

              {/* link to login */}
              <div className="text-center text-sm">
                <p>
                  Bạn đã có tài khoản?{" "}
                  <a href="/login" className="font-medium hover:underline">
                    Đăng nhập
                  </a>
                </p>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
