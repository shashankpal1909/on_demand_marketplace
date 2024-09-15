import { AxiosError } from "axios";
import { useCallback, useState } from "react";

import { toast } from "@/components/ui/use-toast";

import { getErrorMessage } from "@/lib/utils";

// UseRequestOptions no longer needs generics since types are inferred
interface UseRequestOptions<TData = any, TError = any> {
  successToast?: boolean;
  errorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  successCallback?: (result: TData) => void;
  errorCallback?: (error: TError) => void;
}
// Automatically infer types for TParams, TData, and TError from the promiseFunction
export function useRequest<TPromiseFn extends (params?: any) => Promise<any>>(
  promiseFunction: TPromiseFn,
  options: UseRequestOptions<
    Awaited<ReturnType<TPromiseFn>>, // Infer TData from the return type of the promiseFunction
    AxiosError // TError is assumed to be AxiosError, but can be adjusted based on your use case
  > = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const request = useCallback(
    (params?: Parameters<TPromiseFn>[0]) => {
      // Infer TParams from the promiseFunction parameters
      setLoading(true);
      setError(undefined);
      promiseFunction(params)
        .then((result) => {
          setLoading(false);
          setError(undefined);
          if (options.successCallback) {
            options.successCallback(result);
          }
          if (options.successToast) {
            toast({
              title: "Success",
              description: options.successMessage ?? "",
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          // Assuming AxiosError as the default error type
          let errorPayload = { detail: "An error occurred" };
          if (err instanceof AxiosError) {
            errorPayload = err?.response?.data || err?.message;
          }
          setLoading(false);
          const errorMessage = getErrorMessage(errorPayload);
          setError(errorMessage);
          if (options.errorCallback) {
            options.errorCallback(err);
          }
          if (options.errorToast) {
            toast({
              title: "Error",
              description: `${options.errorMessage ? "" : options.errorMessage + ":"} ${errorMessage}`,
              variant: "destructive",
              duration: 3000,
            });
          }
          console.error(err);
        });
    },
    [promiseFunction, options],
  );
  return { loading, error, request };
}
// import { AxiosError } from "axios";
// import { useCallback, useState } from "react";

// import { toast } from "@/components/ui/use-toast";

// import { getErrorMessage } from "@/lib/utils";

// interface UseRequestOptions {
//   successToast?: boolean;
//   errorToast?: boolean;
//   successMessage?: string;
//   errorMessage?: string;
//   successCallback?: (result: any) => void;
//   errorCallback?: (error: any) => void;
// }

// export function useRequest<T = any>(
//   promiseFunction: ((params: T) => Promise<any>) | (() => Promise<any>), // Function that takes optional params and returns a promise
//   options: UseRequestOptions = {},
// ) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>();

//   const request = useCallback(
//     (params: T) => {
//       setLoading(true);
//       setError(undefined);
//       promiseFunction(params)
//         .then((result) => {
//           setLoading(false);
//           setError(undefined);
//           if (options.successCallback) {
//             options.successCallback(result);
//           }
//           if (options.successToast) {
//             toast({
//               title: "Success",
//               description: options.successMessage ?? "",
//               duration: 3000,
//             });
//           }
//         })
//         .catch((err) => {
//           let errorPayload = { detail: "An error occurred" };
//           if (err instanceof AxiosError) {
//             errorPayload = err?.response?.data || err?.message;
//           }
//           setLoading(false);
//           const errorMessage = getErrorMessage(errorPayload);
//           setError(errorMessage);
//           if (options.errorCallback) {
//             options.errorCallback(err);
//           }
//           if (options.errorToast) {
//             toast({
//               title: "Error",
//               description: `${options.errorMessage ? "" : options.errorMessage + ":"} ${errorMessage}`,
//               variant: "destructive",
//               duration: 3000,
//             });
//           }
//           console.error(err);
//         });
//     },
//     [promiseFunction, options],
//   );

//   return { loading, error, request };
// }
