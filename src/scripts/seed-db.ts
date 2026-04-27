import { doc, setDoc, Timestamp } from "firebase/firestore";
import { 
  usersCollection, 
  programsCollection, 
  eventsCollection, 
  pagesCollection 
} from "../lib/db/collections";
import { mockAlumni, mockAlumniEvents } from "../lib/alumni-data";
import { mockCourses, mockEvents, mockUser } from "../lib/dashboard-data";
import { UserRole } from "../lib/db/schema";

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // 1. Seed Users (Alumni + Mock Student + Admin)
    console.log("Seeding users...");
    const adminRef = doc(usersCollection, "admin_user");
    await setDoc(adminRef, {
      id: "admin_user",
      email: "admin@upskill.edu.ng",
      displayName: "System Administrator",
      photoURL: null,
      role: "admin",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const studentRef = doc(usersCollection, "student_user");
    await setDoc(studentRef, {
      id: "student_user",
      email: mockUser.email,
      displayName: mockUser.name,
      photoURL: null,
      role: "student",
      bio: mockUser.bio,
      phoneNumber: mockUser.phone,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    for (const alumni of mockAlumni) {
      const alumniRef = doc(usersCollection, alumni.id);
      await setDoc(alumniRef, {
        id: alumni.id,
        email: `${alumni.name.toLowerCase().replace(" ", ".")}@alumni.upskill.edu.ng`,
        displayName: alumni.name,
        photoURL: alumni.avatar || null,
        role: "alumni",
        bio: `${alumni.role} at ${alumni.company}. Graduated ${alumni.gradYear}.`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log("Users seeded successfully.");

    // 2. Seed Programs/Courses
    console.log("Seeding programs...");
    for (const course of mockCourses) {
      const programRef = doc(programsCollection, course.id);
      await setDoc(programRef, {
        id: course.id,
        title: course.title,
        slug: course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Learn ${course.title} with ${course.instructor}.`,
        category: "Certificate", // default mapping
        duration: course.duration,
        level: "Intermediate", // default mapping
        curriculum: [], // omitted for brevity
        isFeatured: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log("Programs seeded successfully.");

    // 3. Seed Events
    console.log("Seeding events...");
    for (const event of mockEvents) {
      const eventRef = doc(eventsCollection, event.id);
      await setDoc(eventRef, {
        id: event.id,
        title: event.title,
        description: `${event.type} event on ${event.date}`,
        date: Timestamp.fromDate(new Date(`${event.date} ${event.time}`)),
        location: "Campus / Online",
        isVirtual: event.type === "Webinar",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    for (const event of mockAlumniEvents) {
      const eventRef = doc(eventsCollection, event.id);
      await setDoc(eventRef, {
        id: event.id,
        title: event.title,
        description: `Alumni Event: ${event.title}`,
        date: Timestamp.fromDate(new Date(`${event.date} ${event.time}`)),
        location: event.location,
        isVirtual: event.type === "Virtual",
        featuredImage: event.image,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log("Events seeded successfully.");

    // 4. Seed Basic Pages
    console.log("Seeding default pages...");
    const homePageRef = doc(pagesCollection, "home");
    await setDoc(homePageRef, {
      id: "home",
      title: "Home",
      slug: "home",
      description: "Gateway Portal Home",
      status: "published",
      sections: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log("Pages seeded successfully.");

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
