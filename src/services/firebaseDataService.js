import firebase from "../firebase";
import 'firebase/compat/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from "firebase/auth";
import store from "../store";

const db = firebase.firestore();

export class User{

  static async getUserData(id){
    return await db.collection("users").doc(id).get().then((doc) => ({ id:doc.id, ...doc.data()}));
  }

  static async login(form){
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password)
      .then((result) => {return result})
      .catch((err) => {throw err; });
    const userDetails = await db.collection("users").doc(userCredential.user.uid).get().then((doc) => ({ id:doc.id, ...doc.data()}));
    store.commit('login',userDetails)
    return;
  }

  static async loginWithGoogle(){
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider)
      .then((result) => {return result})
      .catch((err) => {throw err});
    const userDetails = await db.collection("users").doc(userCredential.user.uid).get().then((doc) => ({ id:doc.id, ...doc.data()}));
    store.commit('login',userDetails)
    return;
  }

  static async logout(){
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((err) => {throw err});
    store.commit('logout')
  }

  static async createUser(form){
    const auth = getAuth();
    const userCredential = createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((result) => {return result})
      .catch((err) => {throw err});
    const newUser = {
      displayName : form.firstName + ' ' +form.lastName,
      email : form.email,
      group : null
    }
    await db.collection("users").doc(userCredential.user.uid).set(newUser);
    const userDetails = await db.collection("users").doc(userCredential.user.uid).get().then((doc) => ({ id:doc.id, ...doc.data()}));
    store.commit('login',userDetails)
    return
  }

  static async createUserWithGoogle(){
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider)
      .then((result) => {return result})
      .catch((err) => {throw err})
    const newUser ={
        displayName : userCredential.user.displayName,
        email : userCredential.user.email,
        group : null
    }
    await db.collection("users").doc(userCredential.user.uid).set(newUser);
    const userDetails = await db.collection("users").doc(userCredential.user.uid).get().then((doc) => ({ id:doc.id, ...doc.data()}));
    store.commit('login',userDetails)
    return

  }

  static async updateUser(){

  }


}

export class Product {

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

  static async getAll() {
    const snapshot = await db.collection("products").where("archived","==", false).get();
    const products = await Promise.all(snapshot.docs.map(async(doc) => ({
      id:doc.id,
      data:doc.data(),
      personas: await db.collection("linkProductPersona").where("productId","==", doc.id).get().then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => ({ id:doc.id, ...doc.data()}));
                })
    })));
    return await products
  }


  static async createProduct(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;

    return await db.collection("products").add(value);
//    const { id } = await db.collection("products").add(value)
    //// TODO: Need to make sure "personas" arent inserted into above

    // value.personas.forEach((personaId) => {
    //   var row = {productID: id , personaId:personaId}
    //   var docRef = db.collection("linkProductPersona").doc(); //automatically generate unique id
    //   batch.set(docRef, row);
    // });
    // batch.commit()
  }

  static async updateProduct(id ,value) {
    return await db.collection("products").doc(id).update(value);
  }

  static async deleteProduct(id) {
    return await db.collection("products").doc(id).update({archived: true});
  }
}

export class Feature {

  static async getAll() {
    const snapshot = await db.collection("features").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  static createFeature(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("features").add(value);
  }

  static updateFeature(id ,value) {
    return db.ref("features/"+id).update(value);
  }

  static deleteFeature(id) {
    return db.collection("features").doc(id).update({archived: true});
  }
}

export class Idea {

  static async getAll() {
    const snapshot = await db.collection("ideas").get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  static createidea(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("ideas").add(value);
  }

  static updateidea(id ,value) {
    return db.collection("ideas").doc(id).update(value);
  }

  static deleteidea(id) {
    return db.collection("ideas").doc(id).delete();
  }
}

export class Goal {

  static async getAll() {
    const snapshot = await db.collection("productGoals").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  static createGoal(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("productGoals").add(value);
  }

  static updateGoal(id ,value) {
    return db.collection("productGoals").doc(id).update(value);
  }

  static deleteGoal(id) {
    return db.collection("productGoals").doc(id).delete();
  }
}

export class Risk {

  static async getAll() {
    const snapshot = await db.collection("productRisks").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }

  static createRisk(value) {
    value.createDate = Date();
    value.updatedDate = Date();
    value.archived = false;
    return db.collection("productRisks").add(value);
  }

  static updateRisk(id ,value) {
    return db.collection("productRisks").doc(id).update(value);
  }

  static deleteRisk(id) {
    return db.collection("productRisks").doc(id).delete();
  }
}

export class Persona {
  static async getAll() {
    const snapshot = await db.collection("personas").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createPersona(tutorial) {
    return db.collection("personas").add(tutorial);
  }

  static updatePersona(id,value) {
    return db.collection("personas").doc(id).update(value);
  }

  static deletePersona(id) {
    return db.collection("personas").doc(id).delete();
  }
}

export class Need {
  static async getAll() {
    const snapshot = await db.collection("needs").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createNeed(tutorial) {
    return db.collection("needs").add(tutorial);
  }

  static updateNeed(id,value) {
    return db.collection("needs").doc(id).update(value);
  }

  static deleteNeed(id) {
    return db.collection("needs").doc(id).delete();
  }
}

export class Insight {
  static async getAll() {
    const snapshot = await db.collection("insights").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createInsight(tutorial) {
    return db.collection("insights").add(tutorial);
  }

  static updateInsight(id,value) {
    return db.collection("insights").doc(id).update(value);
  }

  static deleteInsight(id) {
    return db.collection("insights").doc(id).delete();
  }
}

export class Journey {
  static async getAll() {
    const snapshot = await db.collection("journeymaps").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createJourney(tutorial) {
    return db.collection("journeymaps").add(tutorial);
  }

  static updateJourney(id,value) {
    return db.collection("journeymaps").doc(id).update(value);
  }

  static deleteJourney(id) {
    return db.collection("journeymaps").doc(id).delete();
  }
}

export class JobToBeDone {
  static async getAll() {
    const snapshot = await db.collection("jobsToBeDone").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createJobToBeDone(tutorial) {
    return db.collection("jobsToBeDone").add(tutorial);
  }

  static updateJobToBeDone(id,value) {
    return db.collection("jobsToBeDone").doc(id).update(value);
  }

  static deleteJobToBeDone(id) {
    return db.collection("jobsToBeDone").doc(id).delete();
  }
}

export class Interview {
  static async getAll() {
    const snapshot = await db.collection("interviewFeedback").where("archived","==", false).get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createInterview(tutorial) {
    return db.collection("interviewFeedback").add(tutorial);
  }

  static updateInterview(id,value) {
    return db.collection("interviewFeedback").doc(id).update(value);
  }

  static deleteInterview(id) {
    return db.collection("interviewFeedback").doc(id).delete();
  }
}
