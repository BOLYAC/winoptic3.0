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
import { register } from "./../../redux/slices/authSlice"


// Define form validation schema with Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(5, {
    message: "Email must be at least 5 characters long.",
  }),
  name: z.string().min(6, {
    message: "Please enter a valid username.",
  }),
  password: z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long.",
  })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  }),
  confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
  });


const Register : React.FC = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  //  Define  form with React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name:"",
      password: "",
      confirmPassword: "",
    },
  });

  //  Define a submit handler
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await dispatch(register(values)).unwrap()
      setRegistrationSuccess(true)
      
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="tetx-2xl sm:text-3xl">Registration Successful</CardTitle>
            <CardDescription className="text-sm sm:text-base">Your account has been created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">You can now log in with your new account</p>
            <Button className="w-full rounded-full" onClick={() => window.location.href = "/login"}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2">
            <img 
              src="./../../../public/unsplash.jpg?width=400&height=600"
              alt="register"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <Card className="shadow-none border-0">
      <CardHeader className="text-center">
        <CardTitle className="tetx-2xl sm:text-3xl">Create an account</CardTitle>
        <CardDescription className="text-sm sm:text-base">Sign up to get started</CardDescription>
        
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
            {/* username faild */}
          <FormField
              control={form.control}
              name="name" 
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-sm "> User name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} className="text-sm sm:text-base p-2 sm:p-3" />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            {/* Email field */}
            <FormField
              control={form.control}
              name="email" 
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-sm "> Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} className="text-sm sm:text-base p-2 sm:p-3"/>
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
             {/* password field */}
             <FormField
              control={form.control}
              name="password"  
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-sm "> Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} className="text-sm sm:text-base p-2 sm:p-3"/>
                  </FormControl>
                 <FormMessage />
                </FormItem>
              )}
            />
              {/* password confirmation field */}
              <FormField
              control={form.control}
              name="confirmPassword"  
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-sm">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} className="text-sm sm:text-base p-2 sm:p-3"/>
                  </FormControl>
                 <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-full text-sm sm:text-base py-2 sm:py-3 mb-4" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                          Registering...
                        </>
                      ) : "Create an account"}
              </Button>
            
          </form>
          
        </Form>
        <p className="text-center text-sm text- text-gray-600">By clicking continue, you agree to our <a className="hover:underline">Terms of Service </a>and <a className="hover:underline">Privacy Policy</a>.</p>
        
      </CardContent>
      <CardFooter  className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className=" text-md text-center w-full ">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
          </p>
      </CardFooter>
    </Card>
    </div>
    </div>
    </Card>
    </div>
    );
};

export default Register;