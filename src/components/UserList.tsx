import { useEffect, useState } from 'react';
import { collection, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList: User[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        userList.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || ''
        });
      });
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="user-list">
      <h2>Список пользователей</h2>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            <span>{user.name}</span>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 