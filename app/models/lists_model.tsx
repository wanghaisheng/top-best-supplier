import { ObjectId } from "mongodb";

export type ListsModel = {
  [key: string]: string | Date | any | null | undefined;
  title?: string | null;
  _id?: ObjectId | null;
  description?: string | null;
  body?: string | null;
  featuredImagePath?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  topicId?: string | null;
  status?: string | null;
  subTitle?: string | null;
  slug?: string | null;
  catId?: string | null;
  image?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  importId?: string | null;
  rankingScore?: number | null;
  ratingScore?: string | null;
  views?: string | null;
  selectedImage?: any;
  ranking_position?: string | null;
  topic_slug?: string | null;
};
