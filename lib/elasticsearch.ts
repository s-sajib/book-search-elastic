import { Client } from "@elastic/elasticsearch";
export const client = new Client({
  node: process.env.ELASTICSEARCH_URL!,
});

export const BOOKS_INDEX = "books";
