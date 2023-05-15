//latest AddPayment
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { InformationCircleIcon } from '@heroicons/react/solid';
import '../../stylesheets/Payment.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddPayment() {
    //set values
    const [studentId, setStudentId] = useState('');
    const [grade, setGrade] = useState('');
    // const [subjects, setSubjects] = useState([]);
    const [month, setMonth] = useState('');
    const [notice, setNotice] = useState('');
    const [paidAmount, setAmount] = useState(0);
    //set subject list getting from DB
    const [subjectList, setSubjectList] = useState([]);
    //set selected subjects
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    //search student details
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const now = new Date();
    const ldate = now.toLocaleDateString('en-CA');
    const ltime = now.toLocaleTimeString('en-US', { hour12: false });
    const [date, setDate] = useState(`${ldate}T${ltime}`);


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:9090/api/subject/subjects');
                setSubjectList(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSubjects();
    }, []);


    //Sum the total of selecting
    const [subWithID, setSubWithID] = useState([]);
    const subjects = subWithID.map((subject) => subject.name);

    const handleCheckboxChange = (event, sub) => {
        if (event.target.checked) {
            setSelectedSubjects([...selectedSubjects, sub]);
            setAmount(prevAmount => prevAmount + sub.subjectAmount);
            setSubWithID(prevSubjects => [...prevSubjects, { id: sub.subjectID, name: sub.subjectName }]);

        } else {
            setSelectedSubjects(selectedSubjects.filter((s) => s._id !== sub._id));
            setAmount(prevAmount => prevAmount - sub.subjectAmount);
            setSubWithID(prevSubjects => prevSubjects.filter((s) => s.id !== sub.subjectID));
        }

        // console.log(subjects); // ["Subject 1", "Subject 2", "Subject 3"]

        //logic for checkbox required
        const isChecked = event.target.checked;
        sub.checked = isChecked;
        setSubjectList([...subjectList]);
        if (isChecked) {
            setNumChecked(numChecked + 1);
        } else {
            setNumChecked(numChecked - 1);
        }
    };

    const totalAmount = selectedSubjects.reduce((total, sub) => total + sub.subjectAmount, 0);
    const subjectsIDs = [...selectedSubjects];

    //checkbox required logic
    const [numChecked, setNumChecked] = useState(0);
    const [submitted, setSubmitted] = useState(false);


    //handleSubmit for Adding payemnts
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);

        try {
            await axios.post('http://localhost:9090/api/payment/add', { studentId, date, month, subjects, subjectsIDs, grade, paidAmount, notice });
            toast.success('Payment added successfully!');
            window.location.reload(); // Reloads the page after successful submission
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.error); // Displays the error message from the server
        }
    };


    const [payments, setPayments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleStudentIdChange = (event) => {
        setStudentId(event.target.value);
    };

    //handleSubmit for search previous payments
    const handleSearchClick = async () => {
        try {
            const response = await axios.get(`http://localhost:9090/api/payment/history/${studentId}`);
            setPayments(response.data);
            setErrorMessage('');
        } catch (err) {
            setPayments([]);
            setErrorMessage(err.response.data.message);
        }
    };


    //search student details
    //search ekata oni useeffect eka(searchTerm)
    useEffect(() => {
        const search = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/user/search/${searchTerm}`);
                setSearchResults(response.data);
            } catch (err) {
                setSearchResults([]);
            }
        };

        if (searchTerm.length > 0) {
            search();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    //AAAAAAAAAAAAAA
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    //nikn id eka ghuwama set une nathi hinda dektama call kala
    const handleInputChange = (event) => {
        handleStudentIdChange(event);
        handleSearchTermChange(event);
    };

    //search by ID or Name
    const handleClickOutside = (e) => {
        if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
            setShowResults(false);
        }
    };
    const [showResults, setShowResults] = useState(false);
    const searchBoxRef = useRef(null);
    useEffect(() => {
        // add event listener to detect click outside the search box
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const handleOnClick = (result) => {
        setStudentId(result.studentID);
        setSearchTerm(result.studentID);
    };

    return (
        <div className="h-full w-full flex items-start text-lg font-medium text-gray-900 dark:text-white">
            <div className='w-2/3 bg-gray-300 p-4 pt-2'>
                <h1 className='text-4xl font-bold text-center text-blue-900 tracking-tight p-2'>Student Payment Collecting</h1>
                <form onSubmit={handleSubmit} className='center'>
                    <div className='mb-2 flex items-center'>
                        <label className='mr-2 mb-2 text-lg font-medium text-gray-900 dark:text-white w-20'>
                            Student ID:
                        </label>
                        <div ref={searchBoxRef} className="search-box mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light" onClick={() => setShowResults(true)}>
                            <input
                                // className='border-none mt-1 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light'
                                className='border-none w-full'
                                type="text"
                                value={searchTerm}
                                onChange={handleInputChange}
                                placeholder="Search by ID or Name"
                            />
                            {showResults && searchTerm && (
                                <ul className='search-results mr-2 mb-2 text-lg font-medium text-gray-900 dark:text-white '>
                                    {searchResults.map((result) => (
                                        <li key={result._id} onClick={() => handleOnClick(result)}>
                                            <p>{`ID: ${result.studentID}`}</p>
                                            <p>{`Name: ${result.name}`}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className='mb-2 flex items-center'>
                        <div className="w-full md:w-1/3 mb-6 mr-1 md:mb-0">
                            {/*grade */}
                            <label className='mr-2 text-lg font-medium text-gray-900 dark:text-white w-20'>
                                Grade:
                            </label>
                            <select value={grade} onChange={(e) => setGrade(e.target.value)} required className='mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light'
                            >
                                <option value="">--Select Grade--</option>
                                <option value="1">Grade 1</option>
                                <option value="2">Grade 2</option>
                                <option value="3">Grade 3</option>
                                <option value="4">Grade 4</option>
                                <option value="5">Grade 5</option>
                                <option value="6">Grade 6</option>
                                <option value="7">Grade 7</option>
                                <option value="8">Grade 8</option>
                                <option value="9">Grade 9</option>
                                <option value="10">Grade 10</option>
                                <option value="11">Grade 11</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 ml-1 mr-1 md:mb-0">
                            {/* month */}
                            <label className='mr-2 text-lg font-medium text-gray-900 dark:text-white w-20'>
                                Month:</label>
                            <select value={month} onChange={(e) => setMonth(e.target.value)} required className='mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light'>
                                <option value="">--Select Month--</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </div>
                        {/* Amount */}
                        <div className="w-full md:w-1/3 mb-6 ml-1 md:mb-0">
                            <label className='mr-2 text-lg font-medium text-gray-900 dark:text-white w-20'>
                                Amount:
                            </label>
                            <input
                                type='number'
                                value={totalAmount}
                                readOnly
                                className='mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light'
                            />
                        </div>
                    </div>


                    {/* Subject */}
                    <div className='mb-2'>
                        <div className='bg-gray-200 pl-5 pt-2 pb-2 rounded h-full'>
                            <label className='block text-lg font-medium text-gray-900 dark:text-white'>Subjects: {subjects.join(',  ')}</label>
                            <ul>
                                <div className="grid grid-cols-2 gap-2 p-2 mt-1">
                                    {subjectList.map((sub) => (
                                        <div key={sub._id}>
                                            <label htmlFor={`subject-${sub._id}`} className='block mb-1 mt-1 text-lg font-medium text-gray-900 dark:text-white'>
                                                <input
                                                    type='checkbox'
                                                    id={`subject-${sub._id}`}
                                                    value={sub.subjectAmount}
                                                    checked={sub.checked}
                                                    onChange={(event) => handleCheckboxChange(event, sub)}
                                                    className='w-4 h-4 mr-1 mb-1 border-2 border-black-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
                                                />
                                                {sub.subjectName} | {sub.subjectTeacherName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ul>
                        </div>
                    </div>
                    {/* date */}
                    <div className='mb-2 flex items-center'>
                        <label className='mr-2 w-20 mb-2 text-lg font-medium text-gray-900 dark:text-white'>
                            Date:</label>
                        <input type="datetime-local" id="date" value={date} onChange={(event) => setDate(event.target.value)} required className='mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light' />
                    </div>
                    <div className='mb-2 flex items-center'>
                        <label className='mr-2 w-20 mb-2 text-lg font-medium text-gray-900 dark:text-white'>
                            Note:</label>
                        <input type="text" id="notice" value={notice} onChange={(event) => setNotice(event.target.value)} placeholder='Add note (If any)' className='mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:mt-1 shadow-sm-light' />
                    </div>
                    <button type="submit" disabled={numChecked === 0} className='disabled:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full'>CONFIRM</button>
                    {submitted && numChecked === 0 && (
                        <p className="text-red-500">Please select at least one checkbox.</p>
                    )}
                </form >
                <button>Search by QR</button>
            </div>
            <div className='w-1/3 flex bg-gray-200 p-4'>
                <div>
                    <h2 className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>See Payment History</h2>
                    <button onClick={handleSearchClick} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>See previous payments</button>
                    {errorMessage && <p>{errorMessage}</p>}
                    {payments.length > 0 && (
                        <div className='mt-3'>
                            <table className="text-center rounded-lg" style={{ border: "1px solid black" }}>
                                <thead >
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black" }}>Date</th>
                                        <th style={{ border: "1px solid black" }}>Month</th>
                                        <th style={{ border: "1px solid black" }}>Subjects</th>
                                        <th style={{ border: "1px solid black" }}>Grade</th>
                                        <th style={{ border: "1px solid black" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {payments.map((payment) => (
                                        <tr key={payment._id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }}>{new Date(payment.date).toLocaleDateString()}</td>
                                            <td className="px-3 py-2 text-lg font-medium text-green-700" style={{ border: "1px solid black" }}><span className="mr-2">{payment.month}</span>
                                                {payment.notice && (
                                                    <>
                                                        <div className="inline-block cursor-pointer" onClick={() => setIsOpen(true)}>
                                                            <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                                                        </div>
                                                        {isOpen && (
                                                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                                                <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
                                                                <div className="z-50 w-1/2 max-w-md p-6 bg-white rounded-lg shadow-lg">
                                                                    <h2 className="text-lg font-medium mb-4">Payment Notice</h2>
                                                                    <p className="mb-4">{payment.notice}</p>
                                                                    <button
                                                                        className="px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                                                                        onClick={() => setIsOpen(false)}
                                                                    >
                                                                        Close
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}</td>
                                            <td style={{ border: "1px solid black" }}>{payment.subjects.join(',  ')}</td>
                                            <td style={{ border: "1px solid black" }}>{payment.grade}</td>
                                            <td style={{ border: "1px solid black" }}>{payment.paidAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div >
    );
}

export default AddPayment;
