import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebase";
import { toast } from "react-toastify";

export const deleteTransactionOnFirebase = async (userId, deleteField) => {
  try {
    const transactionRef = doc(
      db,
      `users/${userId}/transactions/${deleteField.id}`
    );
    const transactionDoc = await getDoc(transactionRef);
    if (transactionDoc.exists()) {
      const transactionData = transactionDoc.data();
      await deleteDoc(transactionRef, transactionData);
      toast.success("Transaction Data Deleted Successfully!");
    } else {
      toast.error("Transaction Not Found in Database");
    }
  } catch (error) {
    toast.error(error.message);
  }
};
