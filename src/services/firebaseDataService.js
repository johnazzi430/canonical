import firebase from "../firebase";
import 'firebase/compat/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import store from "../store";
import _ from 'lodash';

const db = firebase.firestore();

export const collectionMap = {
  product:'products',
  user:'users',
  comment:'comments',
  approval:'approvals',
  assumption:'assumptions',
  draft:'documentDrafts',
  change:'documentChanges',
  persona:'personas',
  goal:'productGoals',
  risk:'productRisks'
}

export function removeDeletedAddNew(list,from,to){
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

export function addInDefaults(value){
  if (!store.state.user.uid) {throw 'user must be logged in'}
  value.createdBy = store.state.user.uid;
  value.project = store.state.user.project;
  value.createDate = Date.now();
  value.updatedDate = Date.now();
  value.archived = false;
  return value
}

export function getDifference(o1,o2){
  // compare two objects and return changes
  var diff = {
    set: [],
    unset: []
  };

  for (const k in o1) {
    if (Object.prototype.hasOwnProperty.call(o1,k) && !_.isEqual(o1[k],o2[k])){
      const set = {}
      const unset = {}
      set[k] = o2[k]
      unset[k] = o1[k]
      diff.set.push(set)
      diff.unset.push(unset)
    }
  }
   return diff;
}


// users
export class User{
  static async getUserData(id){
    return await db.collection("users").doc(id).get().then((doc) => ({ id:doc.id, ...doc.data()}));
  }

  static async getUserAuth(){
     await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userDetails = await db.collection("users").doc(user.uid).get().then((doc) => ({ id:doc.id, ...doc.data()}));
        store.commit('login',userDetails)
      } else {
        console.log('user not logged in')
        return null
      }
    });
    return;
  }

  static async login(form){
    const auth = getAuth();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password)
      .then((result) => {return result})
      .catch((err) => {throw err; });
    const userDetails = await db.collection("users").doc(userCredential.user.uid).get().then((doc) => ({ id:doc.id, ...doc.data()}));
    store.commit('login',userDetails)
    return;
  }

  static async loginWithGoogle(){
    const auth = getAuth();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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

  static async getUsersByProject(){
    const snapshot =  await db.collection("users").where('project', '==' ,store.state.user.project).get()
    return snapshot.docs.map(doc =>({ id:doc.id, ...doc.data()}))
  }
}


// universals
export class Comment {
  constructor(value){
    this.docID = value.docID; //String
    this.docType = value.docType;  //String
    this.comment = value.comment; //String
    Object.assign(this,addInDefaults(this));
  }

  static async getCommentsByDocID(docType,docID){
    const snapshot = await db.collection("comments")
      .where("docType","==", docType)
      .where("docID","==", docID)
      .where("archived","==", false)
      .where("project","==",store.state.user.project)
      .get();
    return await Promise.all(snapshot.docs.map(async doc => ({
      id:doc.id,
      data:doc.data(),
      creator: await User.getUserData(doc.data().createdBy)
    })));
  }

  async createComment(){
    return await db.collection("comments").add(JSON.parse(JSON.stringify(this)));
  }

  async updateComment(id,newComment){
    return await db.collection("comments").doc(id).update({comment: newComment, updatedDate: Date()});
  }

  async deleteComment(id){
    return await db.collection("comments").doc(id).update({archived: true});
  }

  //   new Comment({docID:'',docType:'',comment:value}).createComment()

}

export class Assumption {
  constructor(value){
    this.docID = value.docID; //String
    this.docType = value.docType;  //String
    this.details = value.details; //String
    this.score = value.score; //Int
    this.closed = false; //Bool
  }

  static async getAssumptionByDocID(docType,docID){
    const snapshot = await db.collection("assumptions")
      .where("docType","==", docType)
      .where("docID","==", docID)
      .where("archived","==", false)
      .where("project","==",store.state.user.project)
      .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}));
  }

  async createAssumption(){
    return await db.collection("assumptions").add(JSON.parse(JSON.stringify(this)));
  }

}

export class Change {
  constructor(value){
    this.docID = value.docID; //String
    this.docType = value.docType;  //String
  }

  static async getChangeByDocID(docType,docID){
    const snapshot = await db.collection("documentChanges")
      .where("docType","==", docType)
      .where("docID","==", docID)
      .where("archived","==", false)
      .where("project","==",store.state.user.project)
      .get();
    return snapshot.docs.map(doc => ({id:doc.id, data:doc.data()}));
  }

  async createChange(set){
    const currentSnapshot = await db.collection(`${this.docType}`).doc(this.docID).get()
    const currentValues = currentSnapshot.data();
    const changedFields = getDifference(currentValues,JSON.parse(JSON.stringify(set)))
    addInDefaults(this)
    this.set = changedFields.set
    this.unset = changedFields.unset

    return await db.collection("documentChanges").add(JSON.parse(JSON.stringify(this)));
    // return
  }
}

export class Draft {
  constructor(value){
    this.draftName = value.draftName;
    this.parentID = value.parentID; //String
    this.parentType = value.parentType;  //String
    this.docData = value.docData; //Strin
    this.parentVersion= value.parentVersion; //Object
    Object.assign(this,addInDefaults(this));
  }

  static async getAll(){
    const snapshot = await db.collection("documentDrafts")
              .where("archived","==", false)
              .get();
    return snapshot.docs.map(doc =>({ id:doc.id, ...doc.data()}))
  }

  static async getDraftById(id){
    const snapshot = await db.collection("documentDrafts").doc(id).get();
    return {id:snapshot.id, data:snapshot.data()};
  }

  static async getDraftByParentId(id){
    const snapshot = await db.collection("documentDrafts")
              .where("parentID","==",id)
              .where("archived","==", false)
              .get();
    return snapshot.docs.map(doc =>({ id:doc.id, ...doc.data()}))
  }

  async createDraft(){
    return await db.collection("documentDrafts").add(JSON.parse(JSON.stringify(this)));
  }

  static async updateDraft(id,data){
    return await db.collection("documentDrafts").doc(id).update({
        docData: data,
        updatedDate: Date.now(),
        updatedBy: store.state.user.uid,
    });
  }

  static async updateDraftApproval(id,data){
    return await db.collection("documentDrafts").doc(id).update({
        approval: data,
        updatedDate: Date.now(),
        updatedBy: store.state.user.uid,
    });
  }

}

export class Approvals{
  constructor({approver,approved = false, required = true}){
    this.approver = approver; //String
    this.approved = approved;  //Bool
    this.required = required; //Bool
  }
}

export class Approval {
  constructor(value){
    Object.assign(this,addInDefaults(this));
    this.docID = value.docID; //String
    this.docType = value.docType;  //String
    this.approvals = value.approvals.map(e => {
      return new Approvals(e)
    });
  }

  static async getAll(){
    const snapshot = await db.collection("approvals")
              .where("archived","==", false)
              .get();
    return snapshot.docs.map(doc =>({ id:doc.id, ...doc.data()}))
  }

  static async getApprovalByDoc(docID){
    const snapshot = await db.collection("approvals")
              .where("archived","==", false)
              .where("docID","==", docID)
              .get();
    return snapshot.docs.map(doc =>({ id:doc.id, ...doc.data()}))
  }

  static async getApprovalByApprover(){
    const snapshot = await db.collection("approvals")
              .where("archived","==", false)
              .whereField("approvals.approver",store.state.user.uid)
              .get();
    return snapshot.docs.map(doc =>({ id:doc.id, ...doc.data()}))
  }

  async createApprovalRecord(){
    return await db.collection("approvals").add(JSON.parse(JSON.stringify(this)));
  }

}


// docs
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

  static async getProductById(id) {
    const snapshot = await db.collection("products").doc(id).get()
    const products = {
      id:snapshot.id,
      data:snapshot.data(),
      personas: await db.collection("linkProductPersona").where("productId","==", snapshot.id).get().then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => ({ id:doc.id, ...snapshot.data()}));
                })
    }
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
    new Change({docID:id,docType:'products'}).createChange(value)
    await db.collection("products").doc(id).update(value)
    return await db.collection("products").doc(id).update({updatedDate:Date.now()});
  }

  static async updateProductField(id ,field, value) {
    var dict = {}
    dict[field] = value
    return await db.collection("products").doc(id).update(dict);
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
      products: joinProducts.filter(e => e.features.includes(doc.id)).map(e=> ({id:e.id}))
    }));
  }

  static async createFeature(value) {
    value = addInDefaults(value)
    return db.collection("features").add(value);
  }

  static async updateFeature(id ,value) {
    new Change({docID:id,docType:'features'}).createChange(value)
    await db.collection("features").doc(id).update(value)
    return await db.collection("features").doc(id).update({updatedDate:Date.now()});
  }

  static async deleteFeature(id) {
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

  static createIdea(value) {
    value = addInDefaults(value)
    return db.collection("ideas").add(value);
  }

  static async updateIdea(id ,value) {
    new Change({docID:id,docType:'ideas'}).createChange(value)
    await db.collection("ideas").doc(id).update(value)
    return await db.collection("ideas").doc(id).update({updatedDate:Date.now()});
  }

  static deleteIdea(id) {
    return db.collection("ideas").doc(id).update({archived: true});
  }
}

export class Goal {
  static async getAll() {
    const snapshot = await db.collection("productGoals")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const products = await db.collection("products").where("productGoals","!=", []).get();
    const joinProducts = products.docs.map(doc => ({id:doc.id, goals:doc.data().productGoals}) );
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

  static async updateGoal(id ,value) {
    new Change({docID:id,docType:'productGoals'}).createChange(value)
    await db.collection("productGoals").doc(id).update(value)
    return await db.collection("productGoals").doc(id).update({updatedDate:Date.now()});
  }

  static deleteGoal(id) {
    return db.collection("productGoals").doc(id).update({archived: true});
  }
}

export class Risk {

  static async getAll() {
    const snapshot = await db.collection("productRisks")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const products = await db.collection("products").where("productRisks","!=", []).get();
    const joinProducts = products.docs.map(doc => ({id:doc.id, risks:doc.data().productRisks}) );
    return snapshot.docs.map(doc => ({
      id:doc.id,
      data:doc.data(),
      products: joinProducts.filter(e => e.risks.includes(doc.id)).map(e=> ({id:e.id}))
    }));
  }

  static createRisk(value) {
    value = addInDefaults(value)
    return db.collection("productRisks").add(value);
  }

  static async updateRisk(id ,value) {
    new Change({docID:id,docType:'productRisks'}).createChange(value)
    await db.collection("productRisks").doc(id).update(value)
    return await db.collection("productRisks").doc(id).update({updatedDate:Date.now()});
  }

  static async deleteRisk(id) {
    return db.collection("productRisks").doc(id).update({archived: true});
  }
}

export class Persona {
  static async getAll() {
    const snapshot = await db.collection("personas")
          .where("archived","==", false)
          .where("project","==",store.state.user.project)
          .get();
    const personas = await Promise.all(snapshot.docs.map(async(doc) => ({
      id:doc.id,
      data:doc.data(),
      personas: await db.collection("linkProductPersona").where("personaId","==", doc.id).get().then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => ({ id:doc.id, ...doc.data()}));
                })
    })));
    return personas
  }
  static async createPersona(value) {
    value = addInDefaults(value)
    return db.collection("personas").add(value);
  }

  static async updatePersona(id,value) {
    new Change({docID:id,docType:'personas'}).createChange(value)
    await db.collection("personas").doc(id).update(value)
    return await db.collection("personas").doc(id).update({updatedDate:Date.now()});
  }

  static deletePersona(id) {
    return db.collection("personas").doc(id).update({archived: true});
  }
}

export class Need {
  static async getAll() {
    const snapshot = await db.collection("needs")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const personas = await db.collection("personas").where("needs","!=", []).get();
    const joinPersonas = personas.docs.map(doc => ({id:doc.id, needs:doc.data().needs}) );
    return snapshot.docs.map(doc => ({
              id:doc.id,
              data:doc.data(),
              personas:  joinPersonas .filter(e => e.needs.includes(doc.data().id)).map(e=> ({id:e.id}))
            }));
  }
  static async createNeed(value) {
    value = addInDefaults(value)
    return db.collection("needs").add(value);
  }

  static async updateNeed(id,value) {
    new Change({docID:id,docType:'needs'}).createChange(value)
    await db.collection("needs").doc(id).update(value)
    return await db.collection("needs").doc(id).update({updatedDate:Date.now()});
  }

  static async deleteNeed(id) {
    return db.collection("needs").doc(id).update({archived: true});
  }
}

export class Insight {
  static async getAll() {
    const snapshot = await db.collection("insights")
              .where("archived","==", false)
              .where("project","==",store.state.user.project)
              .get();
    const personas = await db.collection("personas").where("insights","!=", []).get();
    const joinPersonas = personas.docs.map(doc => ({id:doc.id, insights:doc.data().insights}) );
    return snapshot.docs.map(doc => ({
          id:doc.id,
          data:doc.data(),
          personas:  joinPersonas .filter(e => e.insights.includes(doc.data().id)).map(e=> ({id:e.id}))
        }));
  }

  static async createInsight(value) {
    value = addInDefaults(value)
    return db.collection("insights").add(value);
  }

  static async updateInsight(id,value) {
    new Change({docID:id,docType:'insights'}).createChange(value)
    await db.collection("insights").doc(id).update(value)
    return await db.collection("insights").doc(id).update({updatedDate:Date.now()});
  }

  static async deleteInsight(id) {
    return db.collection("insights").doc(id).update({archived: true});
  }
}

export class Journey {
  static async getAll() {
    const snapshot = await db.collection("journeymaps")
          .where("archived","==", false)
          .where("project","==",store.state.user.project)
          .get();
    const personas = await db.collection("personas").where("journeymaps","!=", []).get();
    const joinPersonas = personas.docs.map(doc => ({id:doc.id, journeymaps:doc.data().journeymaps}) );
    return snapshot.docs.map(doc => ({
        id:doc.id,
        data:doc.data(),
        personas:  joinPersonas .filter(e => e.journeymaps.includes(doc.data().id)).map(e=> ({id:e.id}))
      }));
  }

  static async createJourney(value) {
    value = addInDefaults(value)
    return db.collection("journeymaps").add(value);
  }

  static async updateJourney(id,value) {
    new Change({docID:id,docType:'journeymaps'}).createChange(value)
    await db.collection("journeymaps").doc(id).update(value)
    return await db.collection("journeymaps").doc(id).update({updatedDate:Date.now()});
  }

  static deleteJourney(id) {
    return db.collection("journeymaps").doc(id).update({archived: true});
  }
}

export class JobToBeDone {
  static async getAll() {
    const snapshot = await db.collection("jobsToBeDone")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const personas = await db.collection("personas").where("jobsToBeDone","!=", []).get();
    const joinPersonas = personas.docs.map(doc => ({id:doc.id, jobsToBeDone:doc.data().jobsToBeDone}) );
    return snapshot.docs.map(doc => ({
          id:doc.id,
          data:doc.data(),
          personas:  joinPersonas .filter(e => e.jobsToBeDone.includes(doc.data().id)).map(e=> ({id:e.id}))
        }));
  }
  static async createJobToBeDone(value) {
    value = addInDefaults(value)
    return db.collection("jobsToBeDone").add(value);
  }

  static async updateJobToBeDone(id,value) {
    new Change({docID:id,docType:'jobsToBeDone'}).createChange(value)
    await db.collection("jobsToBeDone").doc(id).update(value)
    return await db.collection("jobsToBeDone").doc(id).update({updatedDate:Date.now()});
  }

  static async deleteJobToBeDone(id) {
    return db.collection("jobsToBeDone").doc(id).update({archived: true});
  }
}

export class Interview {
  static async getAll() {
    const snapshot = await db.collection("interviewFeedback")
            .where("archived","==", false)
            .where("project","==",store.state.user.project)
            .get();
    const personas = await db.collection("personas").where("interviews","!=", []).get();
    const joinPersonas = personas.docs.map(doc => ({id:doc.id, interviews:doc.data().interviews}) );
    return snapshot.docs.map(doc => ({
            id:doc.id,
            data:doc.data(),
            personas:  joinPersonas .filter(e => e.interviews.includes(doc.data().id)).map(e=> ({id:e.id}))
        }));
  }
  static async createInterview(value) {
    value = addInDefaults(value)
    return db.collection("interviewFeedback").add(value);
  }

  static async updateInterview(id,value) {
    new Change({docID:id,docType:'interviewFeedback'}).createChange(value)
    await db.collection("interviewFeedback").doc(id).update(value)
    return await db.collection("interviewFeedback").doc(id).update({updatedDate:Date.now()});
  }

  static async deleteInterview(id) {
    return db.collection("interviewFeedback").doc(id).update({archived: true});
  }
}
