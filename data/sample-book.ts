import { Book } from "@/types/book";

export const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: ["Fiction", "Classic"],
    publishYear: 1925,
    description:
      "A classic American novel set in the Jazz Age, exploring themes of  wealth, love, and the American Dream",
    rating: 4.2,
    price: 12.99,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: ["Fiction", "Drama"],
    publishYear: 1960,
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South",
    rating: 4.5,
    price: 14.99,
  },
  {
    id: "3",
    title: "Harry Potter and the Sorcerers Stone",
    author: "J.K. Rowling",
    genre: ["Fantasy", "Young Adult"],
    publishYear: 1997,
    description:
      "A young wizard discovers his magical heritage on his 11th birthday",
    rating: 4.7,
    price: 16.99,
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: ["Fantasy", "Adventure"],
    publishYear: 1937,
    description:
      "Bilbo Baggins embarks on an unexpected journey to help dwarves reclaim their homeland",
    rating: 4.4,
    price: 13.99,
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: ["Romance", "Classic"],
    publishYear: 1813,
    description:
      "A witty romance between Elizabeth Bennet and Mr. Darcy in Georgian England",
    rating: 4.3,
    price: 11.99,
  },
];
