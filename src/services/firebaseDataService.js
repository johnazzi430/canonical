import firebase from "../firebase";
import 'firebase/compat/firestore';

const db = firebase.firestore();

export class product {

  // constructor({}){
  //   this.name = value.name;
  //   this.description = value.description;
  //   this.archived = value.archived;
  //   this.createDate = value.createDate;
  //   this.createdBy = value.createdBy;
  //   this.updatedDate = value.updatedDate;
  //   this.githubLink = value.githubLink;
  //   this.url = value.url;
  //   this.version = value.version;
  //   this.lifesCycleStag= value.lifesCycleStag;
  //   this.partners= value.partners;
  //   this.customerEngagementModel= value.customerEngagementModel;
  //   this.businessModel = value.businessModel;
  //   this.economicModel= value.economicModel;
  //   this.weaknesses= value.weaknesses;
  //   this.strengths= value.strengths;
  //   this.threats= value.threats;
  //   this.opportunities= value.opportunities;
  // }

  async getAll() {
    const snapshot = await db.collection("products").get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  createProduct(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("products").add(value);
  }

  update(id ,value) {
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

  update(id,value) {
    return db.collection("personas").doc(id).update(value);
  }

  delete(id) {
    return db.collection("personas").doc(id).delete();
  }
}
