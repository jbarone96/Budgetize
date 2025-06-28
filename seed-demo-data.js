// Firebase Admin seed script to upload mock demo data to Firestore

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// TODO: Replace with your actual service account key file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("./serviceAccountKey.json"), "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const data = JSON.parse(
  fs.readFileSync(path.resolve("./demo_mock_entries.json"), "utf8")
);

const uploadCollection = async (collectionName, items) => {
  const batch = db.batch();
  items.forEach((item) => {
    const docRef = db.collection(collectionName).doc(item.id);
    batch.set(docRef, item);
  });
  await batch.commit();
  console.log(`Uploaded ${items.length} documents to '${collectionName}'`);
};

(async () => {
  try {
    await uploadCollection("transactions", data.transactions);
    await uploadCollection("goals", data.goals);
    await uploadCollection("income", data.income);
    console.log("✅ Demo data uploaded successfully.");
  } catch (err) {
    console.error("❌ Error uploading demo data:", err);
  }
})();
