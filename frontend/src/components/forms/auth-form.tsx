"use client";

import { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { signUpFetcher } from "@/lib/api";
import { AppErrorCode } from "@/lib/errors/app-error";
import { ErrorCode, isErrorCode } from "@/lib/next-auth/error-codes";

const ZSignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters in length" })
    .max(72, { message: "Cann't be more than 72 characters in length." })
    .refine((value) => value.length > 25 || /[A-Z]/.test(value), {
      message: "One uppercase is required",
    })
    .refine((value) => value.length > 25 || /[a-z]/.test(value), {
      message: "One lowercase is required",
    })
    .refine((value) => value.length > 25 || /\d/.test(value), {
      message: "One number is required",
    })
    .refine(
      (value) =>
        value.length > 25 ||
        /[`~<>?,./!@#$%^&*()\-_"'+=|{}[\];:\\]/.test(value),
      {
        message: "One special character is required",
      }
    ),
});

type TSignUpSchema = z.infer<typeof ZSignUpSchema>;

const ZSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type TSignInSchema = z.infer<typeof ZSignInSchema>;

const signUpErrorMessages: Record<string, string> = {
  [AppErrorCode.EMAIL_ALREADY_EXISTS]:
    "User with this email already exists. please use a different email address.",
  [AppErrorCode.INVALID_REQUEST]:
    "We are unable to create your account. please review the information you provided then try again.",
  [AppErrorCode.UNKNOWN_ERROR]:
    "We are unable to create your account. please try again later.",
};

const signInErrorMessages: Record<string, string> = {
  [ErrorCode.CREDENTIALS_NOT_FOUND]:
    "The email or password you provided is incorrect.",
  [ErrorCode.INCORRECT_EMAIL_PASSWORD]:
    "The email or password you provided is incorrect.",
  [ErrorCode.UNVERIFIED_EMAIL]:
    "The account has not been verified. please verify your account before signing in.",
  [ErrorCode.ACCOUNT_DISABLED]: "The account has been disabled.",
  [ErrorCode.USER_MISSING_PASSWORD]:
    "This account appears to be using a social login method. please sign in using that method.",
  [ErrorCode.INCORRECT_PASSWORD]:
    "The email or password you provided is incorrect.",
};

const signInSocialErrorMessages: Record<string, string> = {
  [AppErrorCode.UNKNOWN_ERROR]: signInErrorMessages[AppErrorCode.UNKNOWN_ERROR],
};

export const AuthForm = ({
  setIsAuthDialogOpen,
}: {
  setIsAuthDialogOpen: (value: boolean) => any;
}) => {
  const [formMode, setFormMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const form = useForm<TSignInSchema>({
    values: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver:
      formMode === "SIGN_IN"
        ? zodResolver(ZSignInSchema)
        : zodResolver(ZSignUpSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSignInFormSubmit = async ({ email, password }: TSignInSchema) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error && isErrorCode(result.error)) {
        const errorMessage = signInErrorMessages[result.error];

        toast.error("Unable to sign in", {
          description: errorMessage,
          duration: 5000,
          position: "top-right",
        });
        return;
      }

      setIsAuthDialogOpen(false);
    } catch (err) {
      toast.error("An unknown error occured", {
        description:
          "We encountered an error while trying to sign you in. please try again later.",
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const onSignUpFormSubmit = async ({ email, password }: TSignInSchema) => {
    try {
      await signUpFetcher({ email, password });
      toast.success("Registeration Successful", {
        description: "You have successfully registered.",
        duration: 5000,
        position: "top-right",
      });
      form.reset();
      setFormMode("SIGN_IN");
    } catch (error: any) {
      const errorMessage =
        signUpErrorMessages[error.status_text] ??
        signUpErrorMessages[AppErrorCode.UNKNOWN_ERROR];

      toast.error("Something went wrong.", {
        description: errorMessage,
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const onAuthWithGoogleClick = async () => {
    try {
      await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });
    } catch (err) {
      toast.error("An unknown error occured", {
        description:
          formMode === "SIGN_IN"
            ? ErrorCode.UNKNOWN_ERROR
            : AppErrorCode.UNKNOWN_ERROR,
        duration: 5000,
        position: "top-right",
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          formMode === "SIGN_IN" ? onSignInFormSubmit : onSignUpFormSubmit
        )}
        className="flex flex-col items-center gap-y-4"
      >
        <AnimatePresence>
          {formMode == "SIGN_IN" ? (
            <motion.div
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -450,
              }}
              className="flex flex-col items-center gap-y-4"
            >
              <h2 className="text-center font-bold text-lg md:text-xl  bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                Sign in to VidBoost Agent
              </h2>
              <p className="text-xs md:text-sm text-center text-blue-300">
                Welcome back! Please sign in to continue
              </p>
            </motion.div>
          ) : (
            <motion.div
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -450,
              }}
              className="flex flex-col items-center gap-y-4"
            >
              <h2 className="text-center font-bold text-lg md:text-xl  bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                Create a new account
              </h2>
              <p className="text-xs md:text-sm text-center text-blue-300">
                Welcome! Please fill in the details to get started
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          type="button"
          size="lg"
          className="flex-1 w-full py-2 mt-6 bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-shadow duration-300 hover:bg-transparent rounded-xl text-blue-500 hover:text-blue-300"
          disabled={isSubmitting}
          onClick={onAuthWithGoogleClick}
        >
          <FcGoogle className="!h-6 !w-6 mr-2" />
          Continue with Google
        </Button>
        <div className="flex w-full items-center justify-center my-4 ">
          <div className="flex-1 bg-blue-300 h-[1px]" />
          <span className="mx-2 text-blue-300 font-semibold mb-1">or</span>
          <div className="flex-1 bg-blue-300 h-[1px]" />
        </div>

        <fieldset
          disabled={isSubmitting}
          className="flex flex-col gap-y-4 h-[11rem] w-full"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-300">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="border-none 
                        ring-1
                        ring-blue-300 
                         focus-visible:ring-blue-600  text-blue-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-300">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    className="border-none 
                        ring-1
                        ring-blue-300 
                         focus-visible:ring-blue-600  text-blue-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button
          type="submit"
          size="lg"
          className="flex-1 w-full py-2 mt-6 bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-shadow duration-300 hover:bg-transparent rounded-xl text-blue-500 hover:text-blue-300"
          disabled={isSubmitting}
          loading={isSubmitting}
          loaderSize="lg"
        >
          {formMode === "SIGN_UP" ? "Sign Up" : "Sign In"}
        </Button>
        <AnimatePresence>
          {formMode == "SIGN_IN" ? (
            <motion.p
              className="mt-6 text-blue-300"
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -450,
              }}
            >
              Don’t have an account?{" "}
              <Button
                type="button"
                className="bg-transparent p-0 hover:bg-transparent hover:cursor-pointer ml-1 text-blue-600 hover:text-blue-600/50"
                onClick={() => {
                  form.clearErrors();
                  form.reset();

                  setFormMode("SIGN_UP");
                }}
              >
                {" "}
                Sign Up
              </Button>
            </motion.p>
          ) : (
            <motion.p
              className="mt-6 text-blue-300"
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -450,
              }}
            >
              Already have an account?{" "}
              <Button
                type="button"
                onClick={() => {
                  form.clearErrors();
                  form.reset();

                  setFormMode("SIGN_IN");
                }}
                className="bg-transparent p-0 hover:bg-transparent hover:cursor-pointer ml-1 text-blue-600 hover:text-blue-600/50"
              >
                {" "}
                Sign In
              </Button>
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
};

export default AuthForm;
