export type Community = {
  id: string;
  name: string;
  description: string;
  whenWhere: string;
  createdAt: number;
};

export type Profile = {
  id: string;
  communityId: string;
  name: string;
  title: string;
  location: string;
  interests: string;
  skills: string;
  experience: string;
  building: string;
  canHelpWith: string;
  needsHelpWith: string;
  lookingFor: string;
  createdAt: number;
};

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type HelpRequest = {
  id: string;
  communityId: string;
  authorId: string;
  text: string;
  comments: Comment[];
  createdAt: number;
};

export type Feedback = {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type Product = {
  id: string;
  communityId: string;
  ownerId: string;
  name: string;
  description: string;
  link: string;
  feedback: Feedback[];
  createdAt: number;
};

export type Db = {
  communities: Community[];
  profiles: Profile[];
  requests: HelpRequest[];
  products: Product[];
};

export type Match = {
  profile: Profile;
  score: number;
  reasons: string[];
  complementary: { you: string; them: string }[];
  starter: string;
};
