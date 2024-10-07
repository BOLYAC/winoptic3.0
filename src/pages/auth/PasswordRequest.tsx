import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { RootState, AppDispatch } from "./../../redux/store"
import { requestReset } from "./../../redux/slices/authSlice"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const RequestResetPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, resetTokens } = useSelector((state: RootState) => state.auth)
  const [resetRequested, setResetRequested] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await dispatch(requestReset(values.email)).unwrap()
      setResetRequested(true)
      setResetEmail(values.email)
    } catch (err) {
      console.error("Password reset request failed:", err)
    }
  }

  const getMockResetLink = (email: string) => {
    const resetToken = resetTokens[email]
    if (resetToken) {
      return `${window.location.origin}/reset-password/${resetToken.token}`
    }
    return ""
  }

  if (resetRequested) {
    const mockResetLink = getMockResetLink(resetEmail)

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>We've sent you instructions to reset your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">If an account exists for {resetEmail}, you will receive password reset instructions.</p>
            {mockResetLink && (
              <Alert>
                <AlertTitle>Mock Reset Link (for demonstration only)</AlertTitle>
                <AlertDescription>
                  <a href={mockResetLink} className="text-green-600 hover:underline break-all">
                    {mockResetLink}
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full rounded-full" onClick={() => window.location.href = "/login"}>
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your email to receive reset instructions</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} type="email"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Sending Reset Instructions...
                  </>
                ) : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Remember your password? {" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RequestResetPage;