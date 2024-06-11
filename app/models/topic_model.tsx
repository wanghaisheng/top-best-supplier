import { ObjectId } from "mongodb";

export type TopicModel = {
  [key: string]: string | Date | any | null | undefined;
  title?: string | null;
  _id?: ObjectId | null;
  description?: string | null;
  body?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  topId?: string | null;
  status?: string | null;
  subTitle?: string | null;
  slug?: string | null;
  catId?: string | null;
  image?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  importId?: string | null;
  featuredImagePath?: string | null;
  rankingScore?: string | null;
  ratingScore?: string | null;
  views?: string | null;
  selectedImage?: any;
  lists?: any;
};
