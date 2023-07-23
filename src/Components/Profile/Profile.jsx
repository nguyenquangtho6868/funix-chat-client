
import { useEffect, useState } from 'react';
import { API_URL } from '../../Constants/ApiConstant';
import { Grid, Box, Typography, Button } from '@mui/material';
import { getUserDetail } from '../../Services/UserService';
import { toast } from 'react-toastify';
import { uploadFile } from '../../uploadfile/uploadfile';
import { editImageUser } from '../../Services/UserService';
import './profile.css';


function ProfileComponent() {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState(null);

    const handleGetUserDetail = () => {
        getUserDetail((rs) => {
            if (rs.statusCode === 200) {
                console.log(rs.data);
                setUser(rs.data);
            } else {
                toast.error('Có lỗi trong quá trình xử lý!')
            }
        }, userId, '')
    }

    useEffect(() => {
        handleGetUserDetail();
    }, []);

    const handleSendFile = (file) => {
        console.log(file);
        editImageUser((res) => {
            res.statusCode === 200 ? handleGetUserDetail() : toast.error('Có lỗi trong quá trình xử lý!');
        }, user, file);
    }

    const handleGetFile = async (event) => {
        const file = await uploadFile(event.target.files[0]);
        file ? handleSendFile(file) : toast.error('firebase error!');
    };

    return (
        <Grid className='layout-children layout-mentor-main'>
            <Grid className='layout-mentor'>
                <Grid container>
                    <Grid item xs={4} lg={5}>
                        {
                            user && user.file ? <Box sx={{ height: '100%' }} display="flex" justifyContent="center" alignItems="center">
                                <img className='user-image' src={user.file} alt="" />
                            </Box>
                                :
                                <Box sx={{ height: '100%' }} display="flex" justifyContent="center" alignItems="center">
                                    <input
                                        id="image-user"
                                        type="file"
                                        hidden
                                        onChange={(e) => handleGetFile(e)}
                                    />
                                    <label htmlFor="image-user" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <img className='user-image' style={{ width: '50%' }} src={require('../../assets/img/add-image.jpg')} alt="" />
                                    </label>
                                </Box>
                        }

                    </Grid>

                    <Grid item xs={8} lg={7}>
                        {
                            user && <Box sx={{ minHeight: '30vh' }}>
                                <Box sx={{ width: '100%', paddingBottom: '3rem' }} display="flex" justifyContent="center"  >
                                    <Typography variant='h2'>Thông Tin Tài Khoản</Typography>
                                </Box>
                                <Box display="flex"   marginBottom="2rem">
                                    <Typography
                                        sx={{
                                            alignSelf: 'center',
                                            width: '15%',
                                            fontWeight: '600',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        Email
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                            width: '80%',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        {user.email}
                                    </Box>
                                </Box>
                                <Box display="flex"   marginBottom="2rem">
                                    <Typography
                                        sx={{
                                            alignSelf: 'center',
                                            width: '15%',
                                            fontWeight: '600',
                                            fontSize: '1.2rem'
                                        }}>
                                        Name
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                            width: '80%',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        {user.username}
                                    </Box>
                                </Box>
                                <Box display="flex"   marginBottom="2rem">
                                    <Typography
                                        sx={{
                                            alignSelf: 'center',
                                            width: '15%',
                                            fontWeight: '600',
                                            fontSize: '1.2rem'
                                        }}>
                                        Chức vụ
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                            width: '80%',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        {user.role}
                                    </Box>
                                </Box>

                                <Box display="flex"   marginBottom="2rem">
                                    <Typography
                                        sx={{
                                            alignSelf: 'center',
                                            width: '15%',
                                            fontWeight: '600',
                                            fontSize: '1.2rem'
                                        }}>
                                        Mật khẩu
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                            width: '80%',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        {user.password}
                                    </Box>
                                </Box>
                            </Box>
                        }
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    )
};

export default ProfileComponent;