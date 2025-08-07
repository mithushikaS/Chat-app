import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {
  const {getUsers, users, selectedUser, setSelectedUser,
    unseenMessages, setUnseenMessages } = useContext(ChatContext)
  
  const {logout, onlineUsers} = useContext(AuthContext);

  const [input, setInput] = useState(false)
  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user)=>user.fullname.toLowerCase().includes(input.toLowerCase())): users;

  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex items-center justify-between'>
          <img src={assets.logo} alt='logo' className='max-w-40' />
          <div className='py-2 group relative'>
            <img src={assets.menu_icon} alt='Menu' className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 px-4 py-2 mt-5'>
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
        </div>
      </div>
      <div className='flex flex-col '>
        {filteredUsers.map((user,index)=>(
          <div onClick={() => {setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]:0}))}}
          key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
            <div className='relative'>
              <img src={user?.profilepic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full'  />
              {onlineUsers.includes(user._id) && (
                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
              )}
            </div>
            <div className='flex flex-col leading-5'>
              <p>{user.fullname}</p>
              {
                onlineUsers.includes(user._id)
                ?<span className='text-green-500 text-xs'>Online</span>
                :<span className='text-neutral-500 text-xs'>Offline</span>
              }
            </div>
            { unseenMessages[user._id] > 0 && <p className='absolute top-3 right-1 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
