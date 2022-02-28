import firebase from "../firebase";
import 'firebase/compat/firestore';

const db = firebase.firestore();

export class product {
  async getAll() {
    const snapshot = await db.collection("products").get();
    return snapshot.docs.map(doc => doc.data());
  }
  create(tutorial) {
    return db.collection("products").add(tutorial);
  }

  update(id, value) {
    return db.collection("products").doc(id).update(value);
  }

  delete(id) {
    return db.collection("products").doc(id).delete();
  }
}

export class persona {
  async getAll() {
    const snapshot = await db.collection("personas").get();
    return snapshot.docs.map(doc => doc.data());
  }
  create(tutorial) {
    return db.collection("personas").add(tutorial);
  }

  update(id, value) {
    return db.collection("personas").doc(id).update(value);
  }

  delete(id) {
    return db.collection("personas").doc(id).delete();
  }
}
