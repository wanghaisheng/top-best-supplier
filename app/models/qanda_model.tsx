export type QandAModel = {
  [key: string]: string | Date | any | null | undefined;
  title?: string | null;
  description?: string | null;
  _id?: string | null;
  body?: any | null;
  steps?: any | null;
  listId?: any | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  slug?: string | null;
  importId?: string | null;
};
