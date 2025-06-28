import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const formatDisplayDate = (value: string) => {
  const parts = value.split(/[\/\-]/);
  if (parts.length === 3) {
    let [a, b, c] = parts;
    if (a.length === 4) {
      // YYYY-MM-DD → MM-DD-YYYY
      return `${b.padStart(2, "0")}-${c.padStart(2, "0")}-${a}`;
    } else {
      // MM/DD/YYYY → MM-DD-YYYY
      return `${a.padStart(2, "0")}-${b.padStart(2, "0")}-${c}`;
    }
  }
  return value;
};

const capitalizeDescription = (text: string) => {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
};

const cleanupCollection = async (
  collectionName: string,
  fieldMap: Record<string, string>
) => {
  const snapshot = await getDocs(collection(db, collectionName));
  const updates = snapshot.docs.map(async (docSnap) => {
    const data = docSnap.data();
    const ref = doc(db, collectionName, docSnap.id);

    const formattedDate = formatDisplayDate(data[fieldMap.date] || "");
    const description = capitalizeDescription(data[fieldMap.description] || "");
    const category = capitalizeDescription(data[fieldMap.category] || "");

    return updateDoc(ref, {
      [fieldMap.date]: formattedDate,
      [fieldMap.description]: description,
      [fieldMap.category]: category,
    });
  });

  await Promise.all(updates);
  console.log(`${collectionName} cleanup complete!`);
};

export const runCleanupScript = async () => {
  await cleanupCollection("entries", {
    date: "date",
    description: "label",
    category: "type",
  });

  await cleanupCollection("transactions", {
    date: "date",
    description: "description",
    category: "category",
  });

  await cleanupCollection("goals", {
    date: "createdAt",
    description: "title",
    category: "category",
  });

  await cleanupCollection("income", {
    date: "date",
    description: "source",
    category: "category",
  });

  alert("Firestore cleanup complete! ✅");
};

const DevTools = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dev Tools</h1>
      <button
        onClick={runCleanupScript}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        🔧 Run Cleanup Script
      </button>
    </div>
  );
};

export default DevTools;
