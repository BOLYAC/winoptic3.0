import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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


// Define form validation schema with Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(5, {
    message: "Email must be at least 5 characters long.",
  }),
  password: z
  .string()
  .min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

const LoginPage: React.FC = () => {
  //  Define  form with React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //  Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // This will be type-safe and validated
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <div className="relative sm:max-w-xl ">
    <Card className="w-[450px] ">
      <CardHeader className="text-center">
        <CardTitle >Login to your account</CardTitle>
        <CardDescription>Good to see you again</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field */}
            <FormField
              control={form.control}
              name="email" 
              render={({ field }) => (
                <FormItem >
                  <FormLabel> Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@gmail.com" {...field} />
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
                <FormItem className="text-left">
                  <FormLabel> Passsword</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormDescription>Forgot password ? <a href="/password"  className="hover:underline ">Reset </a></FormDescription>
                 <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="ghost" className="text-white mx-auto block px-10 ">Login</Button>
            
            <p className="mt-4 text-sm text-center">
            Don't have an account? <a href="/register" className="text-blue-500">Register</a>
            </p>
          
        
          </form>
          
        </Form>
      </CardContent>
      
    </Card>
    </div>
    </div>
  );
};

export default LoginPage;
