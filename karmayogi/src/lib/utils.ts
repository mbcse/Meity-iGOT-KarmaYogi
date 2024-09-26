import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "process";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function urlConstructor(childUrl:string){
  return "http://localhost:3010" + childUrl;
}