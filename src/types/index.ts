export interface Profile {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  couple_id: string | null;
  created_at: string;
}

export interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
  started_at: string;
  invite_code: string;
  created_at: string;
}

export interface Memory {
  id: string;
  couple_id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author?: Profile;
}

export interface Message {
  id: string;
  couple_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}
