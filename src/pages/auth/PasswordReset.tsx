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
  }).min(12, {
    message: "Email must be at least 12 characters long.",
  }),

});



const Password : React.FC = () => {
    //  Define  form with React Hook Form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
       
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
              <CardTitle >Forgot Password</CardTitle>
              <CardDescription >Enter the email associated with your account and we'll send an email with instructions to reset your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                
            <Button type="submit" variant="ghost" className="text-white mx-auto block px-10 ">Send</Button>
            
            <p className="mt-4 text-sm text-center">
           <a href="/login" className="text-blue-500 ">Return to login</a>
            </p>
          
        
          </form>
          
        </Form>
      </CardContent>
      
    </Card>
        </div>
      </div>
      
    );
};

export default Password;