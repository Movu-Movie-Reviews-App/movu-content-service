import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private readonly axios: AxiosInstance = axios;


    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {

            const { data } = await this.axios.get<T>(url, config);
            return data;
        } catch (error) {

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const body = JSON.stringify(error.response?.data);
                // Never let the api_key reach the logs.
                const safeUrl = url.replace(/(api_key=)[^&]*/, '$1***');
                throw new Error(`GET ${safeUrl} failed (${status ?? error.code}): ${body ?? error.message}`)
            }

            throw error;
        }
    }

}