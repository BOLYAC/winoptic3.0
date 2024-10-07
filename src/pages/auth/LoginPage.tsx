import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
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
import { Loader2 } from "lucide-react"
import { RootState, AppDispatch } from "./../../redux/store"
import { login, logout } from "./../../redux/slices/authSlice"

// Define form validation schema with Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(5, {
    message: "Email must be at least 5 characters long.",
  }),
  password: z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      // In a real application, you would validate the token here
      dispatch(login({ email: "user@example.com", password: "password" }))
    }
  }, [dispatch])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    dispatch(login(values))
  }

  const handleLogout = () => {
    dispatch(logout())
    form.reset()
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="tetx-2xl sm:text-3xl">Welcome</CardTitle>
            <CardDescription className="text-sm sm:text-base">You are logged in</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Email: {user.email}</p>
            <Button onClick={handleLogout} className="w-full rounded-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      
        <Card className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row ">
        <div className="hidden md:block md:w-1/2">
        <img 
        src = "./../../../public/unsplash.jpg?width=400&height=600"
        alt="login Picture"
        className="w-full h-full object-cover rounded-l-lg"
        />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
        <Card className="shadow-none border-0">
          <CardHeader className="text-center ">
            <CardTitle className="tetx-2xl sm:text-3xl">Login to your account</CardTitle>
            <CardDescription className="text-sm sm:text-base">Good to see you again</CardDescription>
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
                      <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                      <FormControl>
                        <Input  placeholder="user@example.com" className="text-sm sm:text-base p-2 sm:p-3" {...field} type="email"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"  
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" className="text-sm sm:text-base p-2 sm:p-3" {...field} />
                      </FormControl>
                      <FormDescription>
                        <a href="/password" className="text-sm sm:text-sm text-gray-500 hover:underline ml-2">
                          Forgot password ?
                        </a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                
                <Button type="submit" className="w-full rounded-full text-sm sm:text-base py-2 sm:py-3 "  disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      Logging in...
                    </>
                  ) : "Log in"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-md text-center w-full ">
              Don't have an account? {" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
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

export default LoginPage;