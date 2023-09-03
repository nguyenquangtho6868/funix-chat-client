import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import "./login.css";
import Grid from "@mui/material/Grid";
import { loginPage } from "../../Services/LoginService";
import { AuthContext } from "../../Context/AuthLogin";
import { Howl } from "howler";

function LoginComponent() {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Bạn chưa nhập mật khẩu!"),
      email: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Bạn chưa nhập đúng định dạng email!"
        )
        .required("Trường này là băt buộc!"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);
      setSubmitting(true);
      let data = {
        password: values.password,
        email: values.email,
      };
      loginPage((res) => {
        if (res.statusCode === 200) {
          toast.success("Đăng nhập thành công!");
          setTimeout(() => {
            navigate("/home");
            setIsLoading(false);
            const sound = new Howl({
              src: [require("../../assets/sounds/sound-login.mp3")], // Đường dẫn đến file âm thanh
            });
            sound.play();
          }, 300);
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("username", res.username);
          localStorage.setItem("email", res.email);
          localStorage.setItem("minutes", 0);
          localStorage.setItem("seconds", 0);
        } else {
          setTimeout(() => {
            setIsLoading(false);
            toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
            setSubmitting(false);
            navigate("/");
          }, 300);
        }
      }, data);
    },
  });

  return (
    <div className="login">
      <div className="login-box">
        <Grid container>
          <Grid item xs={12} md={12} lg={7} className="login-box-left">
            <img
              className="login-box-left-img"
              src={require("../../assets/img/logo-funix.png")}
              alt=""
            />
          </Grid>
          <Grid item xs={12} md={12} lg={5} className="login-box-right">
            <Form className="form-middle">
              <h1>Login</h1>
              <FormGroup className="form-middle-group">
                <TextField
                  id="filled-basic"
                  label="Email"
                  variant="filled"
                  name="email"
                  className="form-input-add input-login"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="form-error mt-2">{formik.errors.email}</div>
                )}
              </FormGroup>
              <FormGroup className="form-middle-group">
                <TextField
                  id="filled-basic"
                  label="Password"
                  type="password"
                  variant="filled"
                  name="password"
                  className="form-input-add input-login"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="form-error mt-2">
                    {formik.errors.password}
                  </div>
                )}
              </FormGroup>
              <div className="login-submit">
                <button
                  className="button-submit"
                  disabled={formik.isSubmitting}
                  onClick={formik.handleSubmit}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  submit
                </button>
              </div>
              <div className="text-register"></div>
            </Form>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default LoginComponent;
