import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Resizer from 'react-image-file-resizer'
import {Avatar, Badge} from 'antd'
import axios from 'axios'
import { apiBase } from '../../functions/api'

const FileUpload = ({values, setvalues, setloading}) => {
    const { user } = useSelector((state) => ({...state }))
    
    const fileUploadAndResize = useCallback((e) => {
          
            let files = e.target.files
            let allUploadedFiles = values.images

        if (files) {
            console.log('files');
            setloading(true)
            for (let index = 0; index < files.length; index++) {
                // const element = array[index];
                Resizer.imageFileResizer(
                    files[index],
                    200,
                    200,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        //   resolve(uri);
                        console.log(uri);
                        axios.post(`${apiBase}/upload-image`, 
                            { image: uri },
                            {
                                headers:{
                                    authtoken: user ? user.token : ''
                                }
                            }
                        )
                        .then((res) => {
                            console.log("Image Upload Res Data", res);
                            setloading(false)
                            allUploadedFiles.push(res.data)
                            setvalues({...values, images: allUploadedFiles})
                        })
                        .catch((err) => {
                            setloading(false)
                            console.log('CLOUDINARY UPLOAD ERR',err);
                        })
                    },
                    "base64",
                );
            }
        }
    }, [setloading, setvalues, user, values])

    const handleImageRemove = useCallback(( public_id ) => {
        setloading(true)
        axios.post(`${apiBase}/remove-image`, 
        { public_id },
        {
            headers:{
                authtoken: user ? user.token : "" 
            },
        })
        .then((res) => {
            setloading(false)
            const { images } = values
            let filteredImages = images.filter((item) => {
                return item.public_id !== public_id
            })
            setvalues({...values, images: filteredImages})
        })
        .catch((err) => {
            console.log(err);
            setloading(false)
        })
    }, [setloading, setvalues, user, values])
  return (
    <>
        <div className='row'>
            {values.images &&
            values.images.map((image) =>(
                <div className='col-md-3' style={{cursor:"pointer"}}>
                    <Badge count="X" key={image.public_id} onClick = {() => handleImageRemove(image.public_id)}>
                        <Avatar src={image.url} size={100} shape='square' className='ml-3'/>
                    </Badge>
                </div>
            ))}
        </div>
        <div className='row'>
            <label className='btn btn-pirmary'>Choose File
            <input type='file' multiple accept='images/*' hidden onChange={fileUploadAndResize}/>
            </label>
        </div>
    </>
  )
}

export default FileUpload