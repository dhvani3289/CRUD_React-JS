import { useEffect } from "react";
import { useState } from "react";


function App() {
  let [data, setData] = useState({});
  let [hobby, setHobby] = useState([]);
  let [list, setList] = useState([]);
  let [position, setPosition] = useState(-1);
  let [validationErrors, setValidationErrors] = useState({});
  let [currentPage, setcurrentPage] = useState(1);
  let [perPageData, setperPageData] = useState(3);
  let [page, setPage] = useState([]);
  let [find, setFind] = useState([]);


  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem('user')) || [];
    setList(getData);
    pagination();
  }, [setList, currentPage]);

  let handleChange = (e) => {
    let { name, value } = e.target;
    let activities = [...hobby];
    if (name == "hobbies") {
      if (e.target.checked) {
        activities.push(value);
      }
      else {
        let index = activities.findIndex((v, i) => v == value);
        activities.splice(index, 1);
      }
      value = activities;
      setHobby(value);
    }
    setData({ ...data, [name]: value })
  }


  let deleteData = ((i) => {
    list.splice(i, 1);
    localStorage.setItem("user", JSON.stringify([...list]));
    setList([...list]);
  })

  let validation = () => {
    let validationMessages = {};
    if (!data.username) {
      validationMessages.username = 'Username is required';
    }
    if (!data.email) {
      validationMessages.email = 'Email is required';
    }
    else if (!data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      validationMessages.email = 'You have entered an invalid email address!'
    }
    if (!data.password) {
      validationMessages.password = 'Password is required';
    }
    else if (!data.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)) {
      validationMessages.password = 'Enter a password between 7 to 15 characters which contain at least one numeric digit and a special character.'
    }
    return validationMessages
  }

  let submitData = ((e) => {
    e.preventDefault();
    let getData = JSON.parse(localStorage.getItem('user'));

    let validate = validation();
    if (Object.keys(validate).length > 0) {
      setValidationErrors(validate);
    }
    else {
      setValidationErrors("");
      if (position != -1) {
        list.map((v, i) => {
          if (position == i) {
            list[position] = data;
          }
        })
        localStorage.setItem("user", JSON.stringify([...list]))
        setList(list);
        setPosition(-1);
      } else {
        const newList = [...list, data]
        setList(newList);
        localStorage.setItem("user", JSON.stringify(newList));
      }
      setData({});
      setHobby([]);
    }
    pagination();
  })

  let updateData = ((index) => {
    setPosition(index)
    const updatedList = list.filter((v, i) => {
      if (index === i) {
        return v
      }
    })
    setData(updatedList[0])
    setHobby(updatedList[0].hobbies)
  })

  let sorting = (e) => {
    const sortBy = e.target.value;
    let sortedList = [...list];
    if (sortBy === "ascending") {
      sortedList.sort((a, b) => a.username.localeCompare(b.username));
    } else {
      sortedList.sort((a, b) => b.username.localeCompare(a.username));
    }
    setList(sortedList);
  };

  let pagination = () => {
    let getData = JSON.parse(localStorage.getItem('user'));
    console.log(getData);

    if (!getData || getData.length === 0) {
      setPage([]); // Setting an empty array for page numbers if no data is there
      return;
    }

    let totalPages = Math.ceil(getData.length / perPageData);

    let numOfPages = [];
    for (let i = 1; i <= totalPages; i++) {
      numOfPages.push(i);
    }
    setPage(numOfPages);

    let lastIndex = currentPage * perPageData;
    let firstIndex = lastIndex - perPageData;

    let paginationData = getData.slice(firstIndex, lastIndex);
    let pageDetails = paginationData ? paginationData : [];
    setList(pageDetails);
  }

  let searchData = (e) => {
    e.preventDefault();
    setFind(e.target.search.value);
  }


  return (
    <>
      <div className='signup-wrap'>
        <form method="post" onSubmit={(e) => submitData(e)}>
          <div className="box">
            <h2 className='register'>Registration</h2>
            <input type="text" placeholder='Enter Your Name' name='username' onChange={(e) => handleChange(e)} value={data.username ? data.username : ""} />
            <div className='error'> {validationErrors.username && <p>{validationErrors.username}</p>}</div>

            <input type="email" placeholder='Enter Your Email' name='email' onChange={(e) => handleChange(e)} value={data.email ? data.email : ""} />
            <div className='error'> {validationErrors.email && <p>{validationErrors.email}</p>}</div>

            <input type="password" placeholder='Create Password' name='password' onChange={(e) => handleChange(e)} value={data.password ? data.password : ""} />
            <div className='error'> {validationErrors.password && <p>{validationErrors.password}</p>}</div>

            <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={(e) => handleChange(e)} value={data.confirmPassword ? data.confirmPassword : ""} />
            <div className='error'> {validationErrors.confirmPassword && <p>{validationErrors.confirmPassword}</p>}</div>

            {/* gender */}
            <div className="gender">
              <span>GENDER : </span>
              <input type="radio" id="male" name='gender' value="male" onChange={(e) => handleChange(e)} checked={data.gender == 'male' ? "checked" : ""} />
              <label htmlFor="male" className="mr">MALE</label>

              <input type="radio" id="female" name='gender' value="female" onChange={(e) => handleChange(e)} checked={data.gender == 'female' ? "checked" : ""} />
              <label htmlFor="female">FEMALE</label>
            </div>

            {/* hobbies */}
            <div className="hobbies">
              <span>HOBBIES : </span>
              <input type="checkbox" id="dance" name='hobbies' value="dance" onChange={(e) => handleChange(e)} checked={hobby.includes('dance') ? "checked" : ""} />
              <label htmlFor="dance" className="mr">DANCE</label>

              <input type="checkbox" id="painting" name='hobbies' value="painting" onChange={(e) => handleChange(e)} checked={hobby.includes('painting') ? "checked" : ""} />
              <label htmlFor="painting" className="mr">PAINTING</label>

              <input type="checkbox" id="cricket" name='hobbies' value="cricket" onChange={(e) => handleChange(e)} checked={hobby.includes('cricket') ? "checked" : ""} />
              <label htmlFor="cricket">CRICKET</label>
            </div>

            <button type="submit" className='register-btn'>Register Now</button>
          </div>
        </form >
      </div >

      <form onSubmit={(e) => searchData(e)}>
        {/* searching */}
        <div className="search">
          <input type="search" name='search' placeholder='Search...' />
          <button>Search</button>
        </div>

        {/* sorting */}
        <div className="sorting">
          <h2>Sort : </h2>
          <select onChange={sorting} name="sorting">
            <option hidden >-- Sort Username --</option>
            <option value="Ascending" >ASCENDING</option>
            <option value="Descending">DESCENDING</option>
          </select>
        </div>
      </form>

      <table border={1} cellSpacing={10} cellPadding={10} align="center" style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th>USERNAME</th>
            <th>EMAIL</th>
            <th>PASSWORD</th>
            <th>CONFIRM PASSWORD</th>
            <th>GENDER</th>
            <th>HOBBIES</th>
            <th colSpan={2}>ACTIONS</th>
          </tr>
          {list.filter((v, i) => {
            if (find == '') {
              return v;
            }
            else if (v.username.toLocaleLowerCase().match(find.toLocaleLowerCase())) {
              return v;
            }
          }).map((val, index) => (
            <tr key={index}>
              <td>{val.username}</td>
              <td>{val.email}</td>
              <td>{val.password}</td>
              <td>{val.confirmPassword}</td>
              <td>{val.gender}</td>
              <td>{val.hobbies && Array.isArray(val.hobbies) ? val.hobbies.join(', ') : '-'}</td>
              <td colSpan={2} style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => updateData(index)} className="actions">Update</button>
                <button onClick={() => deleteData(index)} className="actions">Delete</button>
              </td>
            </tr>
          ))}


          <tr>
            <td colSpan={9} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {
                  page.map((v, i) => {
                    return (
                      <button onClick={() => setcurrentPage(v)} className="actions">{v}</button>

                    )
                  })
                }
              </div>
            </td>
          </tr>
        </thead>
      </table>
    </>
  )
}

export default App;