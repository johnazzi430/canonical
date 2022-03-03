import firebase from "../firebase";
import 'firebase/compat/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from "firebase/auth";
import store from "../store";

const db = firebase.firestore();

function removeDeletedAddNew(list,from,to){
  // this function removes values in the :list array that contain items in the :from array
  // then the function adds values to the :list array from the :to array
  for (var i = 0; i < from.length; i++) {
    list = list.filter(val => val != from[i])
  }
  // remove "to" datasets from what already exists in database
  for (var j = 0; j < to.length; j++) {
    list = list.filter(val => val != to[j])
  }
  // push updates
  to.forEach(e => list.push(e));
  return list
}

function addInDefaults(value){
  if (!store.state.user.uid) {throw 'user must be logged in to add product'}
  value.createdBy = store.state.user.uid;
  value.project = store.state.user.project;
  value.createDate = Date();
  value.updatedDate = Date();
  value.archived = false;
  return value
}

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
      project : 'nCHJGmd9sx9VuiiqKrFN' //hardcode to default projectID
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
        project : 'nCHJGmd9sx9VuiiqKrFN' //hardcode to default projectID
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
    const snapshot = await db.collection("products")
      .where("archived","==", false)
      .where("project","==",store.state.user.project)
      .get();
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
    value = addInDefaults(value)
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

  static async updateProductField(id ,field, value) {
    return await db.collection("products").doc(id).update({$field:value});
  }

  static async updateProductRel(id ,field, from, to) {
    const doc = await db.collection("products").doc(id).get()
    const newList = removeDeletedAddNew(doc.data()[field],from,to)
    var dict = {};
    dict[field]=newList
    return await db.collection("products").doc(id).update(dict);
  }

  static async deleteProduct(id) {
    return await db.collection("products").doc(id).update({archived: true});
  }
}

export class Feature {
  static async getAll() {
    const snapshot = await db.collection("features")
        .where("archived","==", false)
        .where("project","==",store.state.user.project)
        .get();
    const products = await db.collection("products").where("features","!=", []).get();
    const joinProducts = products.docs.map(doc => ({id:doc.id, features:doc.data().features}) );
    return snapshot.docs.map(doc => ({
      id:doc.id,
      data:doc.data(),
                                                          //// TODO: remove name here and replace with id
      products: joinProducts.filter(e => e.features.includes(doc.data().name)).map(e=> ({id:e.id}))
    }));
  }

  static createFeature(value) {
    value = addInDefaults(value)
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
    const snapshot = await db.collection("ideas")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const products = await db.collection("products").where("ideas","!=", []).get();
    const joinProducts = products.docs.map(doc => ({id:doc.id, ideas:doc.data().ideas}) );
    return snapshot.docs.map(doc => ({
      id:doc.id,
      data:doc.data(),
      products: joinProducts.filter(e => e.ideas.includes(doc.data().id)).map(e=> ({id:e.id}))
    }));
  }

  static createidea(value) {
    value = addInDefaults(value)
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
    const snapshot = await db.collection("productGoals")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const products = await db.collection("products").where("goals","!=", []).get();
    const joinProducts = products.docs.map(doc => ({id:doc.id, goals:doc.data().goals}) );
    return snapshot.docs.map(doc => ({
      id:doc.id,
      data:doc.data(),
      products: joinProducts.filter(e => e.goals.includes(doc.data().id)).map(e=> ({id:e.id}))
    }));
  }

  static createGoal(value) {
    value = addInDefaults(value)
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
    const snapshot = await db.collection("productRisks")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const products = await db.collection("products").where("risks","!=", []).get();
    const joinProducts = products.docs.map(doc => ({id:doc.id, risks:doc.data().risks}) );
    return snapshot.docs.map(doc => ({
      id:doc.id,
      data:doc.data(),
      products: joinProducts.filter(e => e.risks.includes(doc.data().id)).map(e=> ({id:e.id}))
    }));
  }

  static createRisk(value) {
    value = addInDefaults(value)
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
    const snapshot = await db.collection("personas")
          .where("archived","==", false)
          .where("project","==",store.state.user.project)
          .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createPersona(value) {
    value = addInDefaults(value)
    return db.collection("personas").add(value);
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
    const snapshot = await db.collection("needs")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createNeed(value) {
    value = addInDefaults(value)
    return db.collection("needs").add(value);
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
    const snapshot = await db.collection("insights")
              .where("archived","==", false)
              .where("project","==",store.state.user.project)
              .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createInsight(value) {
    value = addInDefaults(value)
    return db.collection("insights").add(value);
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
    const snapshot = await db.collection("journeymaps")
          .where("archived","==", false)
          .where("project","==",store.state.user.project)
          .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createJourney(value) {
    value = addInDefaults(value)
    return db.collection("journeymaps").add(value);
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
    const snapshot = await db.collection("jobsToBeDone")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createJobToBeDone(value) {
    value = addInDefaults(value)
    return db.collection("jobsToBeDone").add(value);
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
    const snapshot = await db.collection("interviewFeedback")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}) );
  }
  static createInterview(value) {
    value = addInDefaults(value)
    return db.collection("interviewFeedback").add(value);
  }

  static updateInterview(id,value) {
    return db.collection("interviewFeedback").doc(id).update(value);
  }

  static deleteInterview(id) {
    return db.collection("interviewFeedback").doc(id).delete();
  }
}
