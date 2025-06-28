import admin from "firebase-admin";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Init Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadMockData() {
  try {
    const dataPath = join(__dirname, "demo_mock_entries.json");
    const rawData = await readFile(dataPath, "utf-8");
    const entries = JSON.parse(rawData);

    const batch = db.batch();
    const entriesRef = db.collection("entries");

    entries.forEach((entry) => {
      const docRef = entriesRef.doc(entry.id);
      batch.set(docRef, entry);
    });

    await batch.commit();
    console.log(`✅ Uploaded ${entries.length} entries to Firestore`);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

uploadMockData();
