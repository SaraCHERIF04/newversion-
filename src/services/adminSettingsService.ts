import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

class AdminSettingsService {
  // Collection reference
  private settingsCollection = 'admin_settings';
  
  getAll() {
    return collection(db, this.settingsCollection);
  }

  async getBySection(section: string) {
    try {
      const docRef = doc(db, this.settingsCollection, section);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log(`No settings found for section ${section}`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting admin settings for section ${section}:`, error);
      return null;
    }
  }

  async create(section: string, data: Record<string, any>) {
    try {
      const docRef = doc(db, this.settingsCollection, section);
      await setDoc(docRef, data);
      console.log(`Settings created for section: ${section}`);
      return true;
    } catch (error) {
      console.error(`Error creating settings for section ${section}:`, error);
      return false;
    }
  }

  async update(section: string, data: Record<string, any>) {
    try {
      const docRef = doc(db, this.settingsCollection, section);
      await updateDoc(docRef, data);
      console.log(`Settings updated for section: ${section}`);
      return true;
    } catch (error) {
      console.error(`Error updating settings for section ${section}:`, error);
      return false;
    }
  }

  async save(section: string, data: Record<string, any>) {
    try {   
      const docRef = doc(db, this.settingsCollection, section);
      await setDoc(docRef, data, { merge: true });
      console.log(`Settings saved for section: ${section}`);
      return true;
    } catch (error) {
      console.error(`Error saving settings for section ${section}:`, error);
      return false;
    }
  }

  async delete(section: string) {
    try {
      const docRef = doc(db, this.settingsCollection, section);
      await deleteDoc(docRef);
      console.log(`Settings deleted for section: ${section}`);
      return true;
    } catch (error) {
      console.error(`Error deleting settings for section ${section}:`, error);
      return false;
    }
  }
}

export default new AdminSettingsService(); 