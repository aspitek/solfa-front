// src/stores/auth.ts
import { defineStore } from 'pinia';
import container from '@/container/inversify.config';
import type { IApiService } from '@/services/ApiService';
import type { LoginCredentials, RegisterPayload } from '@/types/interfaces';
import { UnauthorizedException } from '@/exceptions/UnauthorizedException';
import { HttpException } from '@/exceptions/HttpException';
import { SYMBOLS } from '@/constants';
import type { User } from '@/types/types';

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
          _isLoggedIn: false,
          user: null as User | null,
          _apiService: container.get<IApiService>(SYMBOLS.IApiService),
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return state._isLoggedIn;
        },
    },
    actions: {
      async login (credentials: LoginCredentials): Promise<void> {
        try {
            await this._apiService.login(credentials);
        } catch (error) {
            let message = 'service indisponible, reessayez plustard';
            if (error instanceof UnauthorizedException) {
                message = error.details;
            } else if (error instanceof HttpException) {
                message = error.details;
            }

            throw new Error(message);
        }
      },
      async register (payload: RegisterPayload): Promise<void> {
        try {
            await this._apiService.register(payload);
            this.login(payload);
        } catch (error) {
            let message = 'service indisponible, reessayez plustard';

            if (error instanceof HttpException) {
                console.error("Erreur HTTP :", error.statusCode, error.message);
                message = error.message;
            }

            throw new Error(message);
        }
    },
    async logout(): Promise<void> {
        await this._apiService.logout();
        this._isLoggedIn = false;
        this.user = null;
    },

    async checkAuth(): Promise<void> {
        try {
            this.user = await this._apiService.checkAuth();
            this._isLoggedIn = true;
        } catch {
            this._isLoggedIn = false;
            this.user = null;
        }
    },
  },
});
