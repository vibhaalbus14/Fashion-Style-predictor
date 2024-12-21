import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (isLogin && !email.trim()) newErrors.email = 'Email is required'; // Login validation
    if (isLogin && !password.trim()) newErrors.password = 'Password is required';

    if (!isLogin) { // Additional validations for signup
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
      if (!password.trim()) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
      if (!role) newErrors.role = 'Role is required';
      if (!age) newErrors.age = 'Age is required';
      else if (isNaN(age) || age < 1 || age > 120) newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for SignUp and Login
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        if (isLogin) {
          // Login API call
          const response = await fetch('http://localhost:8000/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Correct Content-Type for JSON
            },
            body: JSON.stringify({
              email, // Email field
              password, // Password field
            }), // Correctly format the body as JSON
          });
          
          const data = await response.json();
          if (data.access_token) {
            alert('Logged in successfully!');
            localStorage.setItem('access_token', data.access_token);

            // Redirect based on user role
            if (data.role === 'user') {
              navigate('/style-your-outfit');
            } else if (data.role === 'admin') {
              navigate('/admin');
            }
          } else {
            alert('Login failed: ' + (data.detail || 'Unknown error'));
          }
        } else {
          // Sign Up API call
          const response = await fetch('http://127.0.0.1:8000/userSignUp/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              password,
              age: parseInt(age), // Convert age to an integer
              role,
            }),
          });

          const data = await response.json();
          if (data.obj) {
            alert('Signed up successfully! Redirecting to login...');
            setIsLogin(true);
          } else {
            alert('Sign up failed');
          }
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }

      setLoading(false);
      setName('');
      setEmail('');
      setPassword('');
      setAge('');
      setRole('');
      setErrors({});
    }
  };

  return (
    <div className='loginsignup'>
      <div className={`loginsignup-container ${isLogin ? 'login' : 'signup'}`}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <div className="loginsignup-fields">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder='Your Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          {!isLogin && (
            <>
              <div>
                <input
                  type="number"
                  placeholder='Your Age'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                {errors.age && <p className="error">{errors.age}</p>}
              </div>
              <div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="loginsignup-select"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="error">{errors.role}</p>}
              </div>
              
            </>
          )}
        </div>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Continue'}
        </button>
        <p className='loginsignup-login'>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
            {isLogin ? 'Sign up here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
