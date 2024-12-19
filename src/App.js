import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userData, setUserData] = useState(
    {
     name:'',
     age:'',
     location:''
    }
  )
  const [message, setMessage] = useState('')
  //get Full Users
  const getUsers = async () =>{
    await axios.get("http://localhost:4000/users").then((res)=>{
      setUsers(res.data)
      setFilteredUsers(res.data)
    })
  }
  useEffect(()=>{
    getUsers()
  },[])
  //search functionality
  const handleSearch = (e) =>{
     const searchText = e.target.value
     const filteredUser = users.filter((user)=>{
      return (
      user.name.toLowerCase().includes(searchText.toLowerCase()) || user.location.toLowerCase().includes(searchText.toLowerCase())
    )
    })
     setFilteredUsers(filteredUser)
  }
  //delete functionality
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure want to delete the user")
    if(isConfirmed){
      await axios.delete(`http://localhost:4000/users/${id}`).then((res)=>{
        setUsers(res.data)
        setFilteredUsers(res.data)
      })
    }
  }
  //modal
  const closeModal = () =>{
    setIsModalOpen(false)
    getUsers()
  }
  // add New User
  const handleuserData = (e) =>{
    setUserData({...userData,[e.target.name]:e.target.value})
  }
  const handleAddUser = (e) =>{
    setIsModalOpen(true)
    setUserData({
      name:'',
      age:'',
      location:''
    })
    setMessage('')
  }
  const handleSubmit = async (e) =>{
    e.preventDefault()
    if (userData.id) {
      const res = await axios.patch(`http://localhost:4000/users/${userData.id}`, userData);
        setMessage(res.data.message);
        getUsers(); 
    }else{
    await axios.post('http://localhost:4000/users',userData).then((res)=>{
      console.log(res.data)
      let message = res.data.message
      setMessage(message)
    })
  }
  }
  //update user data
  const handleUpdate = (user) =>{
    setIsModalOpen(true)
    setUserData(user)
    setMessage('')
  }
  return (
    <div className="App">
      <div className="content-area">
     <h2>CURD functionalities reactjs and Nodejs</h2>
     <div className="search-area">
      <input type="text" onChange={handleSearch} placeholder='Search' />
      <button className="btn-grad" onClick={handleAddUser}>Add New Users</button>
     </div>
     <div className="users-list">
     <table className='table'>
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Place</th>
      <th>Age</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredUsers && filteredUsers.map((user,index)=>{
      return (
        <tr key={user.id}>
        <td>{index+1}</td>
        <td>{user.name}</td>
        <td>{user.location}</td>
        <td>{user.age}</td>
        <td>
          <button onClick={() => handleUpdate(user)}>Edit</button>
          <button onClick={()=>handleDelete(user.id)} className='red'>Delete</button>
        </td>
      </tr>
    
      )
    }) }
   
  </tbody>
</table>

     </div>
     </div>
     {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <button onClick={closeModal} className="red">&times;</button>
      <h2>{userData.id ?"Update User":"Add User"}</h2>
      <label htmlFor="name">Full Name</label>
      <input type="text" value={userData.name} name="name" onChange={handleuserData} id="name" />
      <label htmlFor="age">Age</label>
      <input type="text" name="age" value={userData.age} onChange={handleuserData} id="age" />
      <label htmlFor="location">City</label>
      <input type="text" name="location" value={userData.location} onChange={handleuserData} id="location" />
      <button className="addUser" onClick={handleSubmit}>{userData.id?"update":"Add User"}</button>
    </div>
  </div>
)}


    </div>
  );
}

export default App;
