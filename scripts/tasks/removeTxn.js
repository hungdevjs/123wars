import { firestore } from '../configs/firebase.config.js';

const removeTxn = async () => {
  const snapshot = await firestore.collection('transactions').where('type', '!=', 'bet').get();
  const promises = snapshot.docs.map((doc) => doc.ref.delete());
  await Promise.all(promises);
};

removeTxn().then(() => console.log('ok'));
