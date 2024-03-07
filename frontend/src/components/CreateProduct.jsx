import { Box, Button, Typography } from '@mui/material'
import MyTextField from './forms/MyTextField'
import MyMultiLineField from './forms/MyMultilineField'
import {useForm} from 'react-hook-form'
import AxiosInstance from './Axios'
import {useNavigate} from 'react-router-dom'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import MyIMGField from './forms/MyIMGField'
const CreateProduct = () => {

  
  const navigate = useNavigate()
  const defaultValues = {
    name : '', 
    description: '', 
    price: '', 
    
  }

  const schema = yup
  .object({
    name: yup.string().required('Name is a required field'),
    price: yup.string().required('Price is a required field'),
    description: yup.string(), 
 })

  const {handleSubmit, control} = useForm({defaultValues:defaultValues, resolver: yupResolver(schema)})


  const submission = (data) => {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('image', data.image);  // assuming data.image is the image file
    formData.append('status', data.status);
    // append other data as needed

    AxiosInstance.post('products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then((res) => {
        navigate(`/`)
    })
}
  
  return (
    <div>

      <form onSubmit={handleSubmit(submission)}>

      <Box sx={{display:'flex', justifyContent:'space-between',width:'100%', backgroundColor:'#00003f', marginBottom:'10px'}}>
         <Typography sx={{marginLeft:'20px', color:'#fff'}}>
            Create records
         </Typography>

      </Box>

      <Box sx={{display:'flex', width:'100%', boxShadow:3, padding:4, flexDirection:'column'}}>

          <Box sx={{display:'flex', justifyContent:'space-around', marginBottom:'40px'}}> 
              <MyTextField
                label="Name"
                name={"name"}
                control={control}
                placeholder="Provide a project name"
                width={'30%'}
                
              />

          </Box>

          <Box sx={{display:'flex', justifyContent:'space-around'}}> 
              <MyMultiLineField
                label="Description"
                name="description"
                control={control}
                placeholder="Provide product description"
                width={'30%'}
                
              />

            <MyTextField
                label="Price"
                name={"price"}
                control={control}
                placeholder="Provide a product price"
                width={'30%'}
                rules={{ 
                    required: true, 
                    pattern: {
                        value: /^(?!0*(\.0+)?$)(\d{1,4}|\d{0,4}\.\d{1,2})$/,
                        message: "Only numbers up to 4 digits with 2 decimal places are allowed"
                    } 
                }}
            />


                <MyIMGField
                  label="Image"
                  name="image"
                  control={control}
                />

    
          </Box>

          <Box sx={{display:'flex', justifyContent:'start', marginTop:'40px'}}> 
                <Button variant="contained" type="submit" sx={{width:'30%'}}>
                   Submit
                </Button>
          </Box>

      </Box>

      </form> 

  
    </div>
  )
}

export default CreateProduct