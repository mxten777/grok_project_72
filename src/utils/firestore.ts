/**
 * Firestore 데이터베이스 헬퍼 함수들
 *
 * Firebase Firestore와의 상호작용을 위한 유틸리티 함수들을 제공합니다.
 * 상품, 주문, 사용자 데이터의 CRUD 작업을 지원합니다.
 *
 * @example
 * ```typescript
 * // 상품 조회
 * const products = await getProducts();
 *
 * // 주문 추가
 * const orderId = await addOrder(orderData);
 *
 * // 사용자 주문 조회
 * const orders = await getOrders(userId);
 * ```
 */

import { collection, getDocs, query, where, doc, getDoc, addDoc, serverTimestamp, updateDoc, deleteDoc, Timestamp, writeBatch } from "firebase/firestore";
import { db } from '../firebase';
import type { Product, Order, User, InventoryHistory, PriceRule, ProductQuestion } from '../types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt,
      } as Product;
    });
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt,
      } as Product;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product: ", error);
    return null;
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updates);
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

// Price Rules
export const getPriceRules = async (): Promise<PriceRule[]> => {
  const querySnapshot = await getDocs(collection(db, 'price_rules'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceRule));
};

export const addPriceRule = async (rule: Omit<PriceRule, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'price_rules'), {
    ...rule,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updatePriceRule = async (id: string, updates: Partial<Omit<PriceRule, 'id' | 'createdAt'>>) => {
  const docRef = doc(db, 'price_rules', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deletePriceRule = async (id: string) => {
  await deleteDoc(doc(db, 'price_rules', id));
};

// Product Questions
export const addProductQuestion = async (question: Omit<ProductQuestion, 'id' | 'createdAt' | 'isAnswered'>) => {
  await addDoc(collection(db, 'product_questions'), {
    ...question,
    isAnswered: false,
    createdAt: serverTimestamp(),
  });
};

export const getProductQuestions = async (productId?: string): Promise<ProductQuestion[]> => {
  let q;
  if (productId) {
    q = query(collection(db, 'product_questions'), where('productId', '==', productId));
  } else {
    q = collection(db, 'product_questions');
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductQuestion))
    .sort((a, b) => (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis());
};

export const answerProductQuestion = async (questionId: string, answer: string) => {
  const docRef = doc(db, 'product_questions', questionId);
  await updateDoc(docRef, {
    answer,
    isAnswered: true,
    answeredAt: serverTimestamp(),
  });
};


// Inventory
export const addInventoryHistory = async (history: Omit<InventoryHistory, 'id' | 'timestamp'>) => {
  await addDoc(collection(db, 'inventory_history'), {
    ...history,
    timestamp: serverTimestamp(),
  });
};

export const getInventoryHistory = async (productId: string): Promise<InventoryHistory[]> => {
  const q = query(collection(db, 'inventory_history'), where('productId', '==', productId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryHistory))
    .sort((a, b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis());
};

export const updateStock = async (
  productId: string,
  quantityChange: number,
  changeType: InventoryHistory['changeType'],
  changedBy: string,
  reason?: string
) => {
  const productRef = doc(db, 'products', productId);
  const batch = writeBatch(db);

  const productDoc = await getDoc(productRef);
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }
  const previousStock = productDoc.data().stock;
  const newStock = previousStock + quantityChange;

  batch.update(productRef, { stock: newStock });

  const historyRef = doc(collection(db, 'inventory_history'));
  batch.set(historyRef, {
    productId,
    quantityChange,
    changeType,
    changedBy,
    reason,
    previousStock,
    newStock,
    timestamp: serverTimestamp(),
  });

  await batch.commit();
};

export const processShipment = async (orderId: string, userId: string) => {
  const orderRef = doc(db, 'orders', orderId);
  const batch = writeBatch(db);

  const orderDoc = await getDoc(orderRef);
  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }
  const order = orderDoc.data() as Order;

  if (order.status !== 'approved') {
    throw new Error('Order must be approved before shipping.');
  }

  for (const item of order.items) {
    const productRef = doc(db, 'products', item.productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      throw new Error(`Product with ID ${item.productId} not found.`);
    }
    const productData = productDoc.data();
    const previousStock = productData.stock;
    const newStock = previousStock - item.quantity;

    if (newStock < 0) {
      throw new Error(`Not enough stock for product ${item.productName}.`);
    }

    batch.update(productRef, { stock: newStock });

    const historyRef = doc(collection(db, 'inventory_history'));
    batch.set(historyRef, {
      productId: item.productId,
      quantityChange: -item.quantity,
      changeType: 'outbound',
      changedBy: userId,
      reason: `Order #${orderId}`,
      previousStock,
      newStock,
      timestamp: serverTimestamp(),
    });
  }

  batch.update(orderRef, { status: 'shipped', updatedAt: serverTimestamp() });

  await batch.commit();
};


// Orders
export const addOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding order: ", error);
    throw error;
  }
};

export const getOrders = async (userId?: string): Promise<Order[]> => {
  try {
    let q;
    if (userId) {
      q = query(collection(db, "orders"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "orders"));
    }
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        items: data.items,
        totalAmount: data.totalAmount,
        status: data.status,
        shippingAddress: data.shippingAddress,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Order;
    });
    // Sort by creation date descending
    return orders.sort((a, b) => (b.createdAt as unknown as Timestamp).toMillis() - (a.createdAt as unknown as Timestamp).toMillis());
  } catch (error) {
    console.error("Error fetching orders: ", error);
    return [];
  }
};

export const updateOrder = async (id: string, updates: Partial<Order>) => {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Users
export const addUser = async (user: Omit<User, 'id'>) => {
  const docRef = await addDoc(collection(db, 'users'), user);
  return docRef.id;
};

export const getUser = async (uid: string) => {
  const q = query(collection(db, 'users'), where('id', '==', uid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as unknown as User;
  }
  return null;
};