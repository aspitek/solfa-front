import { HttpException } from "@/exceptions/HttpException";
import { UnauthorizedException } from "@/exceptions/UnauthorizedException";
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { injectable } from "inversify";

export interface IHttpService {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
}

@injectable()
export class HttpService implements IHttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors()
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error(error)
        const status = error.response?.status || 500;
        let message = error.response?.data?.message
          || error.response?.data?.error
          || error.message;

        if (status === 401) {
          return Promise.reject(new UnauthorizedException(message));
        }

        if (status >= 500) {
          message = 'service indisponible, reessayez plustard';
        }

        return Promise.reject(
          new HttpException(message, status, error.response?.data)
        );
      }
    );
  }
}
