import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ORIGIN,versionPath } from "@/lib/constants";
import { PasswordInput } from "../form/PasswordInput";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";
import JSEncrypt from "jsencrypt";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current Password is required",
    }),
    newPassword: z
      .string()
      .min(6, {
        message: "New Password must be at least 6 characters long",
      })
      .refine((newPassword) => /[A-Z]/.test(newPassword), {
        message: "New Password must contain at least one uppercase letter",
      })
      .refine((newPassword) => /[a-z]/.test(newPassword), {
        message: "New Password must contain at least one lowercase letter",
      })
      .refine((newPassword) => /[0-9]/.test(newPassword), {
        message: "New Password must contain at least one number",
      })
      .refine((newPassword) => /[^a-zA-Z0-9]/.test(newPassword), {
        message:
          "New Password must contain at least one special character (any special characters on keyboard)",
      }),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password is required",
    }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch the newPassword field for real-time validation
  const newPassword = form.watch("newPassword");

  // Define new password requirements
  const newPasswordRequirements = [
    { label: "At least 6 characters", isValid: newPassword.length >= 6 },
    {
      label: "At least 1 uppercase letter",
      isValid: /[A-Z]/.test(newPassword),
    },
    {
      label: "At least 1 lowercase letter",
      isValid: /[a-z]/.test(newPassword),
    },
    { label: "At least 1 number", isValid: /[0-9]/.test(newPassword) },
    {
      label:
        "At least 1 special character (any special characters on keyboard)",
      isValid: /[^a-zA-Z0-9]/.test(newPassword),
    },
  ];

    const isDev = process.env.NODE_ENV === "development";
    const fetchPublicKey = async () => {
    const response = await fetch(isDev ? "/password_public.pem" : `/${versionPath}/password_public.pem`);
    const pem = await response.text();
    return pem;
  };

  async function encryptPassword(password: string): Promise<string> {
    const publicKey = await fetchPublicKey();

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);

    const encrypted = encryptor.encrypt(password);
    if (!encrypted) throw new Error("Encryption failed.");

    return encrypted;
  }

  const onSubmit = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: z.infer<typeof ChangePasswordSchema>) => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description:
          "The new password and confirm password do not match. Please try again.",
      });
      form.setError("newPassword", { message: "Password Mismatch" });
      form.setError("confirmPassword", { message: "Password Mismatch" });
      return;
    }

    const username = JSON.parse(localStorage.getItem("username") ?? "");
    const authToken = JSON.parse(localStorage.getItem("authToken") ?? "");

    const headers = new Headers();
    headers.set("Authorization", "Basic " + btoa(`${username}:${authToken}`));

    const encryptedCurrentPassword = await encryptPassword(
      currentPassword.trim()
    );
    const encryptedNewPassword = await encryptPassword(newPassword.trim());
    const encryptedConfirmPassword = await encryptPassword(
      confirmPassword.trim()
    );

    const bodyContent = new FormData();
    bodyContent.append("current_password", encryptedCurrentPassword);
    bodyContent.append("new_password", encryptedNewPassword);
    bodyContent.append("confirm_password", encryptedConfirmPassword);
    try {
      const response = await fetch(
        `${ORIGIN}/site/api/site/change-password`,
        {
          method: "POST",
          headers,
          body: bodyContent,
        }
      );

      if (response.status === 400) {
        const data = await response.json();

        if (data.message === "Current Password did not match.") {
          form.setError("currentPassword", {
            message: "The current password you entered is incorrect",
          });
          toast({
            variant: "destructive",
            title: "Invalid Current Password",
            description:
              "The current password you entered is incorrect. Please try again.",
          });
        }
      } else if (response.status === 200) {
        const data = await response.json();

        if (data.message === "Password changed successfully.") {
          localStorage.removeItem("username");
          localStorage.removeItem("authToken");
          toast({
            title: "Password Changed Successfully",
            description:
              "You've successfully changed your password. You'll be redirected to the login page.",
          });
          router.push("/login");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Change Password Failed",
          description:
            "An error occurred while trying to change your password. Please try again.",
        });
      }
    } catch (error) {
      if (typeof error === "string") {
        toast({
          variant: "destructive",
          title: "An error occurred while trying to change your password.",
          description: `Error message: ${error}`,
        });
      } else if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "An error occurred while trying to change your password.",
          description: `Error message: ${error.message}`,
        });
      }
    }
  };

  return (
    <DialogContent
      className="max-w-lg"
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
    >
      <DialogHeader className="space-y-2">
        <DialogTitle>Change Password</DialogTitle>
        <DialogDescription className="flex flex-col gap-y-2">
          <p className="text-base">
            {"Make changes to your password here. Click save when you're done."}
          </p>
          <div className="text-secondary-foreground">
            <p>{"New password must contain:"}</p>
            <ul className="list-inside list-disc marker:text-muted-foreground">
              {newPasswordRequirements.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span
                    className={req.isValid ? "text-green-600" : "text-red-500"}
                  >
                    {req.isValid ? "✅" : "❌"}
                  </span>
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="col-span-2 text-right">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="col-span-2 text-right">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
