// Interface pour les données de login
export interface LoginCredentials {
    email: string;
    password: string;
}

// Interface pour l'état du store
export interface AuthState {
  token: string | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface CreatePartitionPayload {
  partitionFile: File;
  title: string;
  composer: string;
  genre: string;
  category: string;
  release_date?: Date;
}

export interface SearchResult {
  _id: string; // Ajouter _id pour identifier la partition
  _source: {
    title: string;
    composer: string;
    category: string;
    genre: string;
    release_date: string;
    path: string;
    id: string;
  }
}
