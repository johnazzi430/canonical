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

export class feature {

  async getAll() {
    const snapshot = await db.collection("features").get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  createFeature(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("features").add(value);
  }

  updateFeature(id ,value) {
    return db.collection("features").doc(id).update(value);
  }

  deleteFeature(id) {
    return db.collection("features").doc(id).delete();
  }
}

export class idea {

  async getAll() {
    const snapshot = await db.collection("ideas").get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  createidea(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("ideas").add(value);
  }

  updateidea(id ,value) {
    return db.collection("ideas").doc(id).update(value);
  }

  deleteidea(id) {
    return db.collection("ideas").doc(id).delete();
  }
}

export class goal {

  async getAll() {
    const snapshot = await db.collection("productGoals").get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  creategoal(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("productGoals").add(value);
  }

  updategoal(id ,value) {
    return db.collection("productGoals").doc(id).update(value);
  }

  deletegoal(id) {
    return db.collection("productGoals").doc(id).delete();
  }
}

export class risk {

  async getAll() {
    const snapshot = await db.collection("productRisks").get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  createRisk(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("productRisks").add(value);
  }

  updateRisk(id ,value) {
    return db.collection("productRisks").doc(id).update(value);
  }

  deleteRisk(id) {
    return db.collection("productRisks").doc(id).delete();
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
