import { useEffect, useState } from "react";

import { Grid, Box, Typography, Button } from "@mui/material";
import { getUserDetail } from "../../Services/UserService";
import { resetPassword } from "../../Services/LoginService";
import { toast } from "react-toastify";

import "./resetpassword.css";
import Input from "@mui/material/Input";
function ResetPasswordComponet() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");
  const hadleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
    console.log(e.target.value);
  };
  const hadleChangeRetyNewPassword = (e) => {
    setRetypeNewPassword(e.target.value);
    console.log(e.target.value);
  };
  useEffect(() => {
    getUserDetail(
      (rs) => {
        if (rs.statusCode === 200) {
          console.log(rs.data);
          setUser(rs.data);
        } else {
          toast.error("Có lỗi trong quá trình xử lý!");
        }
      },
      userId,
      ""
    );
  }, []);
  const handleSubmit = () => {
    const data = { email: user.email, password: newPassword, id: user._id };
    if (newPassword === retypeNewPassword) {
      resetPassword((rs) => {
        if (rs.statusCode === 200) {
          toast.success("Thay Đổi Mật Khẩu Thành Công");
        } else {
          toast.error("Có lỗi trong quá trình xử lý!");
        }
      }, data);
    } else {
      toast.error("Nhập Lại Mật Khẩu Không Trung");
    }
  };

  return (
    <Grid className="layout-children layout-mentor-main">
      <Grid className="layout-mentor">
        <Grid container>
          <Grid item sx={4} lg={5}>
            {user && user.file ? (
              <Box
                sx={{ height: "100%" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img className="user-image" src="" alt="" />
              </Box>
            ) : (
              <Box
                sx={{ height: "100%" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  className="user-image"
                  style={{ width: "50%" }}
                  src={require("../../assets/img/add-image.jpg")}
                  alt=""
                />
              </Box>
            )}
          </Grid>

          <Grid item sx={8} lg={7}>
            {user && (
              <Box sx={{ minHeight: "30vh" }}>
                <Box
                  sx={{ width: "100%", paddingBottom: "3rem" }}
                  display="flex"
                  justifyContent="center"
                  fullWith
                >
                  <Typography variant="h2">Thông Tin Tài Khoản</Typography>
                </Box>
                <Box display="flex" fullWith marginBottom="2rem">
                  <Typography
                    sx={{
                      alignSelf: "center",
                      width: "15%",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    Email
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                      width: "80%",
                      borderRadius: "5px",
                    }}
                  >
                    {user.email}
                  </Box>
                </Box>
                <Box display="flex" fullWith marginBottom="2rem">
                  <Typography
                    sx={{
                      alignSelf: "center",
                      width: "15%",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    Name
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                      width: "80%",
                      borderRadius: "5px",
                    }}
                  >
                    {user.username}
                  </Box>
                </Box>
                <Box display="flex" fullWith marginBottom="2rem">
                  <Typography
                    sx={{
                      alignSelf: "center",
                      width: "15%",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    Nhập Mật khẩu Mới
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                      width: "80%",
                      borderRadius: "5px",
                    }}
                  >
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={hadleChangeNewPassword}
                    ></Input>
                  </Box>
                </Box>

                <Box display="flex" fullWith marginBottom="2rem">
                  <Typography
                    sx={{
                      alignSelf: "center",
                      width: "15%",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    Nhập Lại Mật khẩu Mới
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                      width: "80%",
                      borderRadius: "5px",
                    }}
                  >
                    <Input
                      type="password"
                      value={retypeNewPassword}
                      onChange={hadleChangeRetyNewPassword}
                    ></Input>
                  </Box>
                </Box>
                <Box display="flex" fullWith marginBottom="2rem">
                  <Typography
                    sx={{
                      alignSelf: "center",
                      width: "15%",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    SUBMIT
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                      width: "80%",
                      borderRadius: "5px",
                    }}
                  >
                    <Button
                      disabled={newPassword === "" || retypeNewPassword === ""}
                      onClick={handleSubmit}
                    >
                      SUBMIT
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ResetPasswordComponet;
