import { collection, CollectionReference, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import {
  User,
  Page,
  Program,
  Event,
  Partner,
  Testimonial
} from "./schema";

// Helper to create a typed collection reference
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

// Export typed collections
export const usersCollection = createCollection<User>("users");
export const pagesCollection = createCollection<Page>("pages");
export const programsCollection = createCollection<Program>("programs");
export const eventsCollection = createCollection<Event>("events");
export const partnersCollection = createCollection<Partner>("partners");
export const testimonialsCollection = createCollection<Testimonial>("testimonials");
