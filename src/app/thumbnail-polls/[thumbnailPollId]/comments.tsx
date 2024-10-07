import { ActionButton } from "@/components/action-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { formatDistance } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  text: z.string().min(1).max(100),
});

export const Comments = ({ poll }: { poll: Doc<"thumbnailPolls"> }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useMutationErrorHandler();
  const { session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });
  const addComment = useMutation(api.thumbnailPolls.addComment);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    await addComment({
      text: values.text,
      pollId: poll._id,
    })
      .then(() => {
        toast({
          title: "Comment Added",
          description: "Thanks for leaving your feedback",
        });
        form.reset();
      })
      .catch(handleError)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2 className="my-8 text-4xl font-bold text-center">Comments</h2>
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 justify-between mb-36">
        {session && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex-1"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Comment</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave a comment to help the content creator improve their
                      thumbnail designs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <ActionButton type="submit" isLoading={loading}>
                Post Comment
              </ActionButton>
            </form>
          </Form>
        )}
        <div className="flex-grow ml-0 sm:ml-20 space-y-4 mt-5 sm:mt-0">
          {poll.comments.map((comment) => (
            <div key={comment.createdAt} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={comment.profileUrl}></AvatarImage>
                <AvatarFallback>
                  {comment.userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="text-[13px]">{comment.userName}</div>
                <div className="text-muted-foreground text-[13px]">
                  {formatDistance(new Date(comment.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </div>
                <div className="text-sm mt-4">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
