
import { useEffect, useMemo, useState} from 'react'
import AxiosInstance from './Axios'
import { MaterialReactTable } from 'material-react-table';
import Dayjs from 'dayjs';
import { Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {Link} from 'react-router-dom'

const Home = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
  }, []);

  const [userRole, setUserRole] = useState(null);

  const getUserRole = async (userId) => {
    try {
      const studentResponse = await axios.get(`/users/${userId}/`);
      if (studentResponse.is_professor===false) {
        setUserRole('student');
        return;
      }
      else {
        setUserRole('professor');
        return;
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  }
  // Call getUserRole when the user logs in
  // Replace 'userId' with the actual user ID
  getUserRole(localStorage.getItem('userId'));


  const [myData,setMydata] = useState()
  const [loading,setLoading] = useState(true)

  const GetData = () => {
    AxiosInstance.get(`project/`).then((res) =>{
      setMydata(res.data)
      console.log(res.data)
      setLoading(false)
 
    })

  }

  useEffect(() => {
    GetData();
  },[] )

  
  const columns = useMemo(
      () => [
        {
          accessorKey: 'name', //access nested data with dot notation
          header: 'Name',
          size: 150,
        },
        {
          accessorKey: 'status',
          header: 'Status',
          size: 150,
        },
        {
          accessorKey: 'comments', //normal accessorKey
          header: 'Comments',
          size: 200,
        },
        {
          accessorFn: (row) => Dayjs(row.start_date).format('DD-MM-YYYY'),
          header: 'Start date',
          size: 150,
        },
        {
          accessorFn: (row) => Dayjs(row.end_date).format('DD-MM-YYYY'),
          header: 'End date',
          size: 150,
        },
      ],
      [],
    );

  return (
    <div>
        { loading ? <p>Loading data...</p> :
        <MaterialReactTable 
        columns={columns} 
        data={myData}
        renderRowActions={isLoggedIn && userRole === 'professor' ? ({row}) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            <IconButton color="secondary" component={Link} to={`edit/${row.original.id}`}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" component={Link} to={`delete/${row.original.id}`}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : null}
      />
        }
    </div>
  )
}

export default Home