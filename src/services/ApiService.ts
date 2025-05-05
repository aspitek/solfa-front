import { inject, injectable } from "inversify";
import type { IHttpService } from "./HttpService";
import type { LoginCredentials, RegisterPayload, CreatePartitionPayload, SearchResult } from "@/types/interfaces";
import { SYMBOLS } from "@/constants";
import type { User } from "@/types/types";


export interface IApiService {
    login(credentials: LoginCredentials): Promise<void>;
    logout(): Promise<void>;
    checkAuth(): Promise<User>;
    register(payload: RegisterPayload): Promise<void>;
    createPartition(payload: CreatePartitionPayload): Promise<void>;
    searchPartitions(keywords: string[]): Promise<{results: SearchResult[]}>;
}

@injectable()
export class ApiService implements IApiService {
    constructor(
        @inject(SYMBOLS.IHttpService) private httpService: IHttpService
    ) {}

    async createPartition(payload: CreatePartitionPayload): Promise<void> {

      const { partitionFile, title, composer, genre, category, release_date } = payload;

      const formData = new FormData();
      formData.append('partition_file', partitionFile);
      formData.append('Title', title);
      formData.append('Composer', composer);
      formData.append('Genre', genre);
      formData.append('Category', category);
      formData.append('ReleaseDate', release_date?.toISOString().split('T')[0] ?? '');

      return await this.httpService.post<void>("/admin/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    async login(credentials: LoginCredentials): Promise<void> {
      return await this.httpService.post<void>("/login", credentials);
    }

    async logout(): Promise<void> {
      return await this.httpService.get<void>("/revoke");
    }

    async register(payload: RegisterPayload): Promise<void> {
        return await this.httpService.post<void>("/signup", payload);
    }

    async checkAuth(): Promise<User> {
        const {user} = await this.httpService.get<{user: User}>(`certify`);

        return user;
    }

    async searchPartitions(keywords: string[]): Promise<{results: SearchResult[]}> {
      return await this.httpService.get<{results: SearchResult[]}>("/search", {
        params: {
          q: encodeURIComponent(keywords.join(","))
        }
      });
    }
}
