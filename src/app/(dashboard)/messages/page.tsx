"use client";
import { useEffect, useState, useRef } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRealtime } from "@/hooks/useRealtime";
import { Send, User } from "lucide-react";

export default function MessagesPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetch("/api/chat");
      if (res.ok) setContacts(await res.json());
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetch(`/api/chat?userId=${activeContact.id}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [activeContact]);

  useRealtime("chat_messages", () => {
    if (activeContact) {
      fetch(`/api/chat?userId=${activeContact.id}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeContact.id, message: newMessage }),
    });
    setNewMessage("");
    const res = await fetch(`/api/chat?userId=${activeContact.id}`);
    if (res.ok) setMessages(await res.json());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6 flex gap-6 h-[calc(100vh-100px)]">
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100"><h2 className="font-bold text-lg">المحادثات</h2></div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button key={contact.id} onClick={() => setActiveContact(contact)} className={`w-full text-right p-4 border-b border-gray-50 hover:bg-gray-50 ${activeContact?.id === contact.id ? "bg-blue-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center"><User size={18} /></div>
                  <div><h3 className="font-bold text-sm">{contact.name}</h3><p className="text-xs text-gray-500">{contact.role}</p></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">اختر جهة اتصال لبدء المحادثة</div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100"><h2 className="font-bold">{activeContact.name}</h2></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? <p className="text-center text-gray-500">لا توجد رسائل بعد.</p> :
                  messages.map((msg) => (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[70%] p-3 rounded-2xl bg-blue-600 text-white">
                        <p className="text-sm">{msg.message}</p>
                        <span className="text-[10px] opacity-70 block mt-1">{new Date(msg.created_at).toLocaleTimeString('ar-IQ')}</span>
                      </div>
                    </div>
                  ))
                }
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <Input placeholder="اكتب رسالتك..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} className="flex-1" />
                <Button onClick={handleSendMessage}><Send size={16} /> إرسال</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
