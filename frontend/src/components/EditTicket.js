
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

function EditTicket(props) {
  const [StudentId, setStudentId] = useState("");
  const [subject, setsubject] = useState("");
  const [issueDate, setissueDate] = useState("");
  const [details, setdetails] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:9090/ticket/${id}`).then((res)=>{
      if(res.data.success){
        setStudentId(res.data.ticket.StudentId);
        setsubject(res.data.ticket.subject);
        setissueDate(res.data.ticket.issueDate);
        setdetails(res.data.ticket.details);
      }
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "StudentId") {
      setStudentId(value);
    } else if (name === "subject") {
      setsubject(value);
    } else if (name === "issueDate") {
      setissueDate(value);
    } else if (name === "details") {
      setdetails(value);
    }
     // Clear specific error message
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: ''
  }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Validate StudentId
    if (!StudentId) {
      newErrors.StudentId = "Student Id is required";
    }
  
    // Validate subject
    if (!subject) {
      newErrors.subject = "Subject is required";
    }
  
    // Validate issueDate
    if (!issueDate) {
      newErrors.issueDate = "Issue Date is required";
    }
  
    // Validate details
    if (!details) {
      newErrors.details = "Details are required";
    }
  
    setErrors(newErrors);
  
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  

  const onSubmit = (e) => {
    e.preventDefault();
    
    
  if (validateForm()) {
    const data = {
      StudentId:StudentId,
      subject:subject,
      issueDate:issueDate,
      details:details,
    };

   
    
    axios.put(`http://localhost:9090/ticket/update/${id}`, data).then((res) => {
      if (res.data.success) {
        alert("Ticket Update Successfully");
        setStudentId("");
        setsubject("");
        setissueDate("");
        setdetails("");
        navigate('/Stickets');
      }
    });
  }
  };

  return (
    <div>
    <br></br>
<div>
<h3 class="text-3xl font-bold dark:text-white" style={{marginLeft:'20px'}}>Edit Ticket</h3>
</div>

<form style={{padding: '50px'}} >
  <div class="mb-6">
    <label for="StudentId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Student Id</label>
    <input type="text" id="StudentId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="StudentId"
              placeholder="Enter Student Id"
              value={StudentId}
              onChange={handleInputChange} required></input>
              {errors.StudentId && <p className="text-red-500">{errors.StudentId}</p>}
  </div>
  <div class="mb-6">
    <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
    <input type="text" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            name="subject"
            placeholder="Enter subject"
            value={subject}
            onChange={handleInputChange}required></input>
            {errors.subject && <p className="text-red-500">{errors.subject}</p>}
  </div>
  
  <div class="mb-6">
    <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Issue Found Date</label>
    <input type="date" id="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
      name="issueDate"
      placeholder="Enter Date"
      value={issueDate}
      onChange={handleInputChange}required></input>
      {errors.issueDate && <p className="text-red-500">{errors.issueDate}</p>}
  </div>

  <div class="mb-6">
  <label for="details" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Details</label>
   <textarea id="details" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
     name="details"
     placeholder="Enter Details"
     value={details}
     onChange={handleInputChange} required></textarea>
     {errors.details && <p className="text-red-500">{errors.details}</p>}
  </div>

  

  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={onSubmit}>Submit</button>
  </form>


         
          
        </div>

  );
}

export default EditTicket;