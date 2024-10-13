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
            <CardTitle className="tetx-2xl sm:text-3xl">Welcome {user.name}</CardTitle>
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
    <div className="flex  min-h-screen ">
      
        <div className="hidden lg:block lg:w-3/5 relative">
        <img 
        src = " /unsplash.jpg"
        alt="login Picture"
        className="w-full h-full object-cover"
        />
         <div className="absolute bottom-5 left-2 text-white text-sm ">
         Copyright © 2024 
        </div>
        </div>
        <div className="w-full lg:w-[30%] p-4 flex flex-auto items-center justify-center">
        <Card className="w-full max-w-md border-0  shadow-none">
      
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
                        <Input  
                        placeholder="user@example.com" 
                       {...field} type="email"
                       className={`text-sm sm:text-base p-2 sm:p-3 hover:bg-blue-100  transition-colors duration-200
                         ${field.name in form.formState.errors ? 'bg-red-200' : ''}
                      `}/>
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
                        <Input type="password" placeholder="Enter your password" {...field} 
                        className={`text-sm sm:text-base p-2 sm:p-3 hover:bg-blue-100 transition-colors duration-200
                         ${field.name in form.formState.errors ? 'bg-red-200' : ''}
                        `}/>
                      </FormControl>
                      <FormMessage />    
                      <FormDescription>
                        <a href="/password" className="text-sm sm:text-sm text-gray-500 hover:underline ml-2">
                          Forgot password ?
                        </a>
                      </FormDescription>
                      
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
    
  );
};

export default LoginPage;