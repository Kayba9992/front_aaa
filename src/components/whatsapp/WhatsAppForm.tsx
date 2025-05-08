
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendWhatsAppMessage } from "@/services/whatsappService";

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل" }),
  message: z.string().min(10, { message: "الرسالة مطلوبة ويجب أن تكون 10 أحرف على الأقل" }),
});

type FormValues = z.infer<typeof formSchema>;

const WhatsAppForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  // This would typically come from an environment variable or configuration
  const whatsappNumber = "212612345678"; // Example number with country code (Morocco)

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const message = `مرحباً، اسمي ${data.name}. ${data.message}`;
      sendWhatsAppMessage(whatsappNumber, message);
      
      toast({
        title: "تم إرسال الرسالة",
        description: "ستفتح نافذة الواتساب الآن",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="rtl text-2xl font-bold text-center">
          تواصل معنا عبر واتساب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rtl">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              الاسم
            </label>
            <Input
              id="name"
              placeholder="أدخل اسمك"
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              الرسالة
            </label>
            <Textarea
              id="message"
              placeholder="أدخل رسالتك هنا..."
              {...register("message")}
              className="w-full h-32"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-academy-green hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال عبر الواتساب"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            سيتم فتح تطبيق واتساب تلقائيًا بعد الضغط على الزر
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppForm;
