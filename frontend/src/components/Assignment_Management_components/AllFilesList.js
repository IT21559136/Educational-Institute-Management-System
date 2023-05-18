import axios from 'axios';
import { useEffect, useState } from 'react';


export default function AllFilesList() {
  const [files, setFiles] = useState([]);
 
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
 

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:9090/items/getItems');
        const data = await response.json();
        setFiles(data.files);
        console.log(data.files);
        const filesWithDownloadedState = response.data.items.map(file => ({
          ...file,
          downloaded: localStorage.getItem(file._id) === 'true',
          marksSubmitted: submittedAssignments.includes(file._id)
        }));
        setFiles(filesWithDownloadedState);
        setFilteredFiles(filesWithDownloadedState); // Initialize filtered files with all files
      } catch (error) {
        console.log(error);
      }
    };

    fetchFiles();
  }, []);

  

  

  


  const handleDownload = (fileId) => {
    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file._id === fileId) {
          const updatedFile = { ...file, downloaded: true };
          localStorage.setItem(file._id, true);
          return updatedFile;
        } else {
          return file;
        }
      })
    );
  };

  const filterFiles = (assignmentType) => {
    if (assignmentType === 'all') {
      setFilteredFiles(files); // Show all files
    } else {
      const filtered = files.filter(file => file.assignmentType === assignmentType);
      setFilteredFiles(filtered);
    }
  };

  const handleMarkAssignment = (fileId, studentName, AssignmentType, marks) => {
    // Check if marks have already been submitted for this assignment
    if (submittedAssignments.includes(fileId)) {
      console.log('Marks already submitted for this assignment.');
      return;
    }

    // Make an API request to store the marks in the database
    // Adjust the endpoint URL and payload structure based on your backend API
    axios.post('http://localhost:9090/feed/addMark', {
      fileId,
      studentName,
      AssignmentType,
      marks
    })
      .then(response => {
        console.log('Marks stored successfully:', response.data);
        setSubmittedAssignments(prevAssignments => [...prevAssignments, fileId]);
        // You can handle success cases as per your requirement
      })
      .catch(error => {
        console.log('Error storing marks:', error);
        // Handle the error case appropriately
      });
  };
/////////////////////////////////
  //stay as it is
  useEffect(() => {
    // Retrieve the submitted assignments from local storage on component mount
    const storedSubmittedAssignments = localStorage.getItem('submittedAssignments');
    if (storedSubmittedAssignments) {
      setSubmittedAssignments(JSON.parse(storedSubmittedAssignments));
    }
  }, []);
   //stay as it is
   /////////////////////////////////////////////////////

  return (
    <div className="container">
      <h1 className="text-center my-5" style={{ fontSize: '2rem' }}>
        Students Answers
      </h1>

      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-info mr-5"
              onClick={() => filterFiles('Home Work')}
            >
              Home Work
            </button>
            <button
              className="btn btn-info mr-5"
              onClick={() => filterFiles('Group Work')}
            >
              Group Work
            </button>
            <button
              className="btn btn-info mr-5"
              onClick={() => filterFiles('Subject Related')}
            >
              Subject Related
            </button>
            <button
              className="btn btn-info mr-5"
              onClick={() => filterFiles('Extra Work')}
            >
              Extra Work
             
        </button>
      </div>
    </div>
  </div>

  <div className="row">
  {filteredFiles.map(file => (
    <div className="col-md-6 mb-4" key={file._id}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{file.name}</h5>
          <p className="card-text">{file.description}</p>
          <a
            href={`http://localhost:9090/items/getAll/${file._id}`}
            className={`btn btn-primary${file.downloaded ? ' btn-success' : ''}`}
            download
            onClick={() => handleDownload(file._id)}
          >
            {file.downloaded ? 'Downloaded' : 'Download'}
          </a>
          <div className="mt-3">
            {submittedAssignments.includes(file._id) ? (
              <p className="text-danger">Marks already submitted for this assignment.</p>
            ) : (
              <>
                <label htmlFor={`marks_${file._id}`}>Marks:</label>
                <input
                  type="number"
                  id={`marks_${file._id}`}
                  className="form-control"
                  min="0"
                  step="0.01"
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    const marksInput = document.getElementById(`marks_${file._id}`);
                    const marks = parseFloat(marksInput.value);
                    if (!isNaN(marks)) {
                      handleMarkAssignment(file._id, file.name, file.assignmentType, marks);
                      marksInput.value = '';
                    }
                  }}
                  disabled={file.marksSubmitted} // Disable the button if marks have already been submitted
                >
                  {file.marksSubmitted ? 'Marks Submitted' : 'Submit Marks'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

</div>
);
}