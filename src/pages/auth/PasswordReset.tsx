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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { RootState, AppDispatch } from "./../../redux/store"
import { resetPassword } from "./../../redux/slices/authSlice"

// Define form validation schema with Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});



const Password : React.FC = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [resetSuccess, setResetSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  //  Define a submit handler
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await dispatch(resetPassword(values.email)).unwrap()
      setResetSuccess(true)
    } catch (err) {
      console.error("Password reset request failed:", err)
    }
  }
  if (resetSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-clip text-center">
            <CardTitle>Password Reset Requested</CardTitle>
            <CardDescription>Check your email for further instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">If an account exists for <span className="text-blue-600">{form.getValues().email}</span>, you will receive password reset instructions.</p>
            <Button className="w-full rounded-full text-base " onClick={() => window.location.href = "/login"}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img 
              src="./../../../public/unsplash.jpg?width=400&height=600"
              alt="reset password"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <Card className="shadow-none border-0">
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
                    <Button type="submit" className="w-full rounded-full text-base " disabled={loading}>
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
        </div>
      </Card>
    </div>
  );
};

export default Password;