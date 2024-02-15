import React, { useEffect, useState } from 'react';
import AxiosInstance from './Axios';

function GetStudents() {
    const [students, setStudents] = useState([]);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Realizar la solicitud GET a la API
            const response = await AxiosInstance.get('students/');
            // Establecer los datos obtenidos en el estado
            console.log(response.data); // Add this line
            setStudents(response.data);
          } catch (error) {
            console.error('Error al obtener los datos:', error);
          }
        };
    
        fetchData();
      }, []); // El segundo argumento es un array vacío para que el efecto solo se ejecute una vez
      return (
        <div>
          <h1>Datos de la API</h1>
          {students.length > 0 ? (
            students.map((student, index) => (
              <div key={index}>
                <p>Nombre: {student.user.first_name}</p>
                <p>Apellido: {student.user.last_name}</p> 
                {/* Display other fields based on your data structure */}
              </div>
            ))
          ) 
          : (
            <p>Cargando...</p>
          )}
        </div>
      );
}


export default GetStudents;
