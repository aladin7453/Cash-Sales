import { toast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";

export function useVerify(form: any, endpoint: string, prefix: string, id?: string) {
  const headers = getAuthHeaders();

  async function verifyField(field: string, value: string) {
    form.clearErrors(field);

    if (!value) {
      form.setError(field, {
        type: "custom",
        message: "This field is empty.",
      });
      return;
    } else if (!/^[^\s](.*[^\s])?$/.test(value)) {
      form.setError(field, {
        type: "custom",
        message: "This field must not start or end with a space.",
      });
      return;
    }

    const formData = new FormData();
    formData.append(`${prefix}[${field}]`, value);

    try {
      const fullUrl = id ? `${ORIGIN}${endpoint}?id=${id}` : `${ORIGIN}${endpoint}`;
      const res = await fetch(fullUrl, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          toast({
            title: "Error",
            description: errorData.message,
            variant: "destructive",
          });
        }
        throw new Error(errorData.message);
      }

      const data: boolean = await res.json();
      if (data) {
        form.setError(field, {
          type: "custom",
          message: `"${value}" already exists.`,
        });
      } else {
        form.clearErrors(field);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return { verifyField };
}
