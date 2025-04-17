import type { Route } from "./+types/route";

import { useHydrated } from "remix-utils/use-hydrated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, redirect, useSubmit, data, useActionData } from "react-router";
import { formSchema } from "./form-schema";
import { wait } from "~/utils/time";
import { parseZodError } from "./utils";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = formSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = parseZodError(result.error.errors);

    return data({ errors }, { status: 400 });
  }

  await wait(1_000);

  throw redirect("/");
}

export default function ProgressivelyEnhancedFormValidation() {
  const isHydrated = useHydrated();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    errors: actionData?.errors,
  });

  return (
    <div className="flex py-24">
      <Form
        method="post"
        className="max-w-md mx-auto w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6"
        noValidate={isHydrated}
        onSubmit={handleSubmit((_, event) => submit(event?.target))}
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <div className="relative">
            <input
              {...register("email")}
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              required
            />
            {errors.email?.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              required
              minLength={8}
            />
            {errors.password?.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer transition-colors duration-200">
          Submit
        </button>
      </Form>
    </div>
  );
}
