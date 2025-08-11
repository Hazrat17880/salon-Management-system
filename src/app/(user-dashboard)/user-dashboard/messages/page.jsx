"use client"
import MessagesContent from '@/component/Customer/Message';
import React, { useState } from 'react';

const Page = () => {
  const [messages, setMessages] = useState([]);

    return (
      <MessagesContent messages={messages} />
    );
}

export default Page;
