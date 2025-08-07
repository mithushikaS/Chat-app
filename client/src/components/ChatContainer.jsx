import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, users } = useContext(ChatContext)
  const { authUser, onlineUsers} = useContext(AuthContext)
  
  const scrollEnd = useRef()

  const [input, setInput] = useState('');

  // Handle sending a message
  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessage({text: input.trim()});
    setInput("")

  }

  // Handle sending an image
  const handleSendImage = async (e) =>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async ()=>{
      await sendMessage({image: reader.result})
      e.target.value= ""
    }
    reader.readAsDataURL(file)
  }

  // Helper to get profilePic by senderId
  const getProfilePic = (senderId) => {
    if (senderId === authUser._id && authUser?.profilepic) return authUser.profilepic;
    if (selectedUser && senderId === selectedUser._id && selectedUser?.profilepic) return selectedUser.profilepic;
    const user = users.find(u => u._id === senderId);
    if (user && user.profilepic) return user.profilepic;
    return null; // Explicitly return null if no profilepic
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages]) 

  return selectedUser ? (
    <div className='h-full overflow-hidden relative backdrop-blur-lg'> {/* ✅ Changed overflow to overflow-hidden */}
      {/*------- Header---------- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone500'>
        {selectedUser.profilepic ? (
          <img src={selectedUser.profilepic}
               alt="profile"
               className='w-8 rounded-full bg-gray-300 object-cover'
               onError={e => { e.target.onerror = null; e.target.src = assets.avatar_icon; }} />
        ) : (
          <div className='w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold'>
            {getInitials(selectedUser.fullname)}
          </div>
        )}
        <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullname}
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500 inline-block'></span>
          )}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/*------- Chat area ---------- */}
      <div className='flex flex-col h-[calc(100%-100px)] overflow-y-auto p-3 pb-6'> {/* ✅ Fixed height from 100%-120x to 100%-100px and changed overflow-y-scroll to overflow-y-auto */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className='flex flex-row items-end gap-2'>
              {msg.senderId === authUser._id ? (
                <>
                  {msg.image ? (
                    <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                  ) : (
                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white rounded-br-none`}>{msg.text}</p>
                  )}
                  <div className='text-center text-xs'>
                    <img src={getProfilePic(msg.senderId) || assets.avatar_icon}
                         alt="profile"
                         className='w-7 rounded-full bg-gray-300 object-cover'
                         onError={e => { e.target.onerror = null; e.target.src = assets.avatar_icon; }} />
                    <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className='text-center text-xs'>
                    <img src={getProfilePic(msg.senderId) || assets.avatar_icon}
                         alt="profile"
                         className='w-7 rounded-full bg-gray-300 object-cover'
                         onError={e => { e.target.onerror = null; e.target.src = assets.avatar_icon; }} />
                    <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                  </div>
                  {msg.image ? (
                    <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                  ) : (
                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white rounded-bl-none`}>{msg.text}</p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*----bottom area-----*/}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Send a message" className='flex-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
          <input type="file" id='image' accept='image/png, image/jpeg' hidden onChange={handleSendImage} />
          <label htmlFor='image'>
            <img src={assets.gallery_icon} alt="" className='w-5 ml-25 cursor-pointer' />
          </label>
        </div>
        <div>
          <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
