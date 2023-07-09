import React ,{ useState } from 'react'
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        password,
      });

      console.log(response.data); // Handle success response
      console.log(name);
      // Clear form fields after successful signup
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error signing up:', error); // Handle error response
    }
    navigate('/');
  };

    return (
      <div>
        <div className = "d-flex justify-content-center mt-4">
        <h1>Create Your Account</h1>
        </div>
    
        <form className = "m-5 mr-10 justify-content-center" onSubmit={handleSubmit} >
          <div className="mb-3">
          <div className="mb-3">
            <label  className="form-label">Name</label>
            <input type="name" className="form-control"  value={name} onChange={(e) => setName(e.target.value)}></input>
          </div>
            <label for="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" aria-describedby="emailHelp" value ={email} onChange={(e) => setEmail(e.target.value)} ></input>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control"  value = {password} onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <Link to = "/" onClick={handleSubmit} type = "submit" className="btn btn-primary w-25">Submit</Link>
          <Link to = "/"  className="btn btn-danger m-4 w-25">Already a user</Link>
        </form>
      </div>
    );
  }
  
  export default SignUp;