import NotificationsContent from '@/component/Customer/Notification';
import React from 'react';

const Page = () => {
      const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
    setUnreadNotifications(unreadNotifications - 1);
  };
    const [unreadNotifications, setUnreadNotifications] = useState(3);
  
      const [notifications, setNotifications] = useState([]);
    return (
       <NotificationsContent notifications={notifications} markAsRead={markAsRead} />
    );
}

export default Page;
