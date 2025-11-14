import React, { useState } from "react";


function Message({ msg }) {
const mine = msg.from === "user";
return (
<div className={`flex ${mine ? "justify-end" : "justify-start"} mb-3`}>
<div
className={`${
mine
? "bg-sky-600 text-white rounded-bl-2xl rounded-tl-2xl rounded-tr-xl px-4 py-2"
: "bg-gray-100 text-gray-800 rounded-br-2xl rounded-tr-2xl rounded-tl-xl px-4 py-2"
}`}
>
{msg.text}
</div>
</div>
);
}


export default function ChatPanel({ messages, onSend, lang }) {
const [text, setText] = useState("");


function submit(e) {
e.preventDefault();
if (!text.trim()) return;
onSend(text);
setText("");
}


return (
<div className="flex flex-col h-full">
<div className="p-6 overflow-auto scrollbar-hide" style={{ flex: 1 }}>
{messages.map((m, i) => (
<Message msg={m} key={i} />
))}
</div>


<form onSubmit={submit} className="p-4 border-t border-gray-200 bg-white flex gap-2">
<input
value={text}
onChange={(e) => setText(e.target.value)}
placeholder={lang === "ta" ? "எழுதவும்..." : "Type a message..."}
className="flex-1 p-2 rounded border border-gray-200"
/>
<button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">
Send
</button>
</form>
</div>
);
}